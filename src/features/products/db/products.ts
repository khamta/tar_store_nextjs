import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import {
  getProductGlobalTag,
  getProductIdTag,
  revalidateProductCache,
} from "./cache";
import { productSchema } from "../schemas/products";
import { authCheck } from "@/features/auths/db/auths";
import { canCreateProduct, canUpdateProduct } from "../permissions/products";
import { redirect } from "next/navigation";
import { deleteFromImageKit } from "@/lib/imageKit";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  mainImageIndex: number;
  images: Array<{ url: string; fileId: string }>;
}

export const getProducts = async (page: number = 1, limit: number = 2) => {
  "use cache";
  cacheLife("hours");
  cacheTag(await getProductGlobalTag());
  const skip = (page - 1) * limit;
  try {
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          images: true,
        },
      }),
      db.product.count(),
    ]);

    return {
      products: products.map((product) => {
        const mainImage = product.images.find((image) => image.isMain);

        return {
          ...product,
          lowStock: 5,
          sku: product.id.substring(0, 8).toUpperCase(),
          mainImage,
        };
      }),
      totalCount,
    };
  } catch (error) {
    console.error("Error getting products: ", error);
    return { products: [], totalCount: 0 };
  }
};

export const getProductById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductIdTag(id));

  try {
    const product = await db.product.findFirst({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return null;
    }

    // find main product image
    const mainImage = product.images.find((image) => image.isMain);
    // find index of main product
    const mainImageIndex = mainImage
      ? product.images.findIndex((image) => image.isMain)
      : 0;

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex,
    };
  } catch (error) {
    console.error("Error getting product by id", error);
    return null;
  }
};

export const getFeaturedProducts = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag(await getProductGlobalTag());
  try {
    const products = await db.product.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        sold: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
      take: 8,
    });

    return products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain);
      return {
        ...product,
        lowStock: 5,
        sku: product.id.substring(0, 8).toUpperCase(),
        mainImage: mainImage,
      };
    });
  } catch (error) {
    console.error("Error getting featured products: ", error);
    return [];
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();
  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບ!!",
        error: error.flatten().fieldErrors,
      };
    }
    // Check category exists
    const category = await db.category.findUnique({
      where: {
        id: data.categoryId,
        status: "Active",
      },
    });
    if (!category) {
      return {
        message: "ບໍ່ພົບໝວດໝູ່ ຫລື ໝວດໝູ່ນີ້ຖຶືກລົບໄປແລ້ວ",
      };
    }

    // Create new product
    const newProduct = await db.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
      });

      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: input.mainImageIndex === index,
                productId: product.id,
              },
            });
          })
        );
      }
      return product;
    });
    revalidateProductCache(newProduct.id);
  } catch (error) {
    console.error("Error creating product: ", error);
    return {
      message: "ມີບາງຢ່າງຜິດພາດຄວນຕິດຕໍ່ຜູ້ພັດທະນາ",
    };
  }
};

export const updateProduct = async (
  input: CreateProductInput & { id: string; deletedImageIds: string[] }
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບ!!",
        error: error.flatten().fieldErrors,
      };
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
      },
    });
    if (!existingProduct) {
      return {
        message: "ບໍ່ພົບສິນຄ້າ",
      };
    }

    const category = await db.category.findUnique({
      where: {
        id: data.categoryId,
        status: "Active",
      },
    });
    if (!category) {
      return {
        message: "ບໍ່ພົບໝວດໝູ່ ຫລື ໝວດໝູ່ບໍ່ພ້ອມໃຊ້ງານ",
      };
    }

    if (input.deletedImageIds && input.deletedImageIds.length > 0) {
      for (const deletedImageId of input.deletedImageIds) {
        const imageToDelete = existingProduct.images.find(
          (image) => image.id === deletedImageId
        );
        if (imageToDelete) {
          await deleteFromImageKit(imageToDelete.fileId);
        }
      }
    }

    const updatedProduct = await db.$transaction(async (prisma) => {
      // 1. update product
      const product = await prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
      });

      // 2. ລົບຮູບພາບໃນຖານຂໍ້ມູນ
      if (input.deletedImageIds && input.deletedImageIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: {
              in: input.deletedImageIds,
            },
            productId: product.id,
          },
        });
      }

      // 3. set isMain ໃຫ້ເປັນ false ທັງໝົດ
      await prisma.productImage.updateMany({
        where: {
          productId: product.id,
        },
        data: {
          isMain: false,
        },
      });

      // 4. ເພີ່ມຮູບພາບໃຫມ່ເຂົ້າໄປ
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: product.id,
              },
            });
          })
        );
      }

      // 5. ຄົ້ນຫາຮູບທັງໝົດ ແລະ ຕັ້ງຄ່າພາບຫລັກ
      const allImages = await prisma.productImage.findMany({
        where: {
          productId: product.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1);
        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id,
            },
            data: {
              isMain: true,
            },
          });
        }
      }
      return product;
    });

    revalidateProductCache(updatedProduct.id);
  } catch (error) {
    console.error("Error Updatting Product: ", error);
    return {
      message: "ມີບາງຢ່າງຜິດພາດລອງອີກຄັ້ງພາຍຫລັງ!",
    };
  }
};


export const changeProductStatus = async (
  id: string,
  status: ProductStatus
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        message: "Product not found",
      };
    }

    if (product.status === status) {
      return {
        message: `Product is already ${status.toLowerCase()}`,
      };
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: { status },
    });

    revalidateProductCache(updatedProduct.id);
  } catch (error) {
    console.error("Error changing product status:", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};
