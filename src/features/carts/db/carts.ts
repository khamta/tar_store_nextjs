import { redirect } from "next/navigation";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCartTag, revalidateCartCache } from "./cache";
import { db } from "@/lib/db";
import { authCheck } from "@/features/auths/db/auths";
import { canUpdateUserCart } from "../permissions/carts";

interface AddToCartInput {
  productId: string;
  count: number;
}

interface UpdateCartInput {
  cartItemId: string;
  newCount: number;
}

export const getUserCart = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));
  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        products: {

          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });
    if (!cart) {
      return null;
    }
    const cartWithDetails = {
      ...cart,
      items: cart.products.map((item) => {
        const mainImage = item.product.images.find((image) => image.isMain);
        return {
          id: item.id,
          count: item.count,
          price: item.price,
          product: {
            ...item.product,
            mainImage: mainImage || null,
            lowStock: 5,
            sku: item.product.id.substring(0, 8).toUpperCase(),
          },
        };
      }),
      itemCount: cart.products.reduce((sum, item) => sum + item.count, 0),
    };
    return cartWithDetails;
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return null;
  }
};

export const getCartItemCount = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));
  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        products: true,
      },
    });
    if (!cart) {
      return 0;
    }
    return cart.products.reduce((sum, item) => sum + item.count, 0);
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    return 0;
  }
};

export const recalculateCartTotal = async (cartId: string) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId,
    },
  });
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  await db.cart.update({
    where: {
      id: cartId,
    },
    data: {
      cartTotal,
    },
  });
};

export const addToCart = async (input: AddToCartInput) => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const product = await db.product.findUnique({
      where: {
        id: input.productId,
        status: "Active",
      },
    });
    if (!product) {
      return {
        message: "ສິນຄ້າບໍ່ມີ ຫຼື ຫາບໍ່ພົບສິນຄ້າ",
      };
    }
    if (product.stock < input.count) {
      return {
        message: "ສິນຄ້າໃນສາງບໍ່ພຽງພໍ",
      };
    }

    let cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });
    if (!cart) {
      cart = await db.cart.create({
        data: {
          cartTotal: 0,
          orderedById: user.id,
        },
      });
    }
    const existingProduct = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });
    if (existingProduct) {
      await db.cartItem.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          count: existingProduct.count + input.count,
          price: (existingProduct.count + input.count) * product.price,
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          count: input.count,
          price: product.price * input.count,
        },
      });
    }
    await recalculateCartTotal(cart.id);

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      message: "ເກີດຂໍ້ມຜິດພາດໃນການເພີ່ມສິນຄ້າລົງໃນກະຕ່າ",
    };
  }
};

export const updateCartItem = async (input: UpdateCartInput) => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }
  try {
    if (input.newCount < 1) {
      return {
        message: "ຈຳນວນສິນຄ້າຕ້ອງມີຢ່າງນ້ອຍ 1 ອັນ",
      };
    }
    const cartItem = await db.cartItem.findUnique({
      where: {
        id: input.cartItemId,
      },
      include: {
        cart: true,
        product: true,
      },
    });
    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ບໍ່ພົບສິນຄ້າໃນກະຕ່າ",
      };
    }
    if (cartItem.product.stock < input.newCount) {
      return {
        message: "ສິນຄ້າໃນສາງບໍ່ພຽງພໍ",
      };
    }

    await db.cartItem.update({
      where: {
        id: input.cartItemId,
      },
      data: {
        count: input.newCount,
        price: cartItem.product.price * input.newCount,
      },
    });
    await recalculateCartTotal(cartItem.cartId);
    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      message: "ເກີດຂໍ້ມຜິດພາດໃນການອັບເດດສິນຄ້າລົງໃນກະຕ່າ",
    };
  }
};

export const removeFromCart = async (cartItemId: string) => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }
  try {
    const cartItem = await db.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        cart: true,
      },
    });
    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ບໍ່ພົບສິນຄ້າໃນກະຕ່າ",
      };
    }
    await db.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
    await recalculateCartTotal(cartItem.cartId);
    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      message: "ບໍ່ສາມາດລົບລາຍການສິນຄ້ານີ້ອອກຈາກກະຕ່າໄດ້",
    };
  }
};

export const clearCart = async () => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }
  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });
    if (!cart) {
      return {
        message: "ບໍ່ພົບກະຕ່າ",
      };
    }
    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cartTotal: 0,
      },
    });
    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      message: "ເກີດຂໍ້ຜິດພາດໃນການລົບກະຕ່າ",
    };
  }
};
