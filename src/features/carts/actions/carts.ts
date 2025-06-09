"use server";

import { addToCart, clearCart, removeFromCart, updateCartItem } from "../db/carts";

export const addToCartAction = async (formData: FormData) => {
  const data = {
    productId: formData.get("product-id") as string,
    count: parseInt(formData.get("count") as string) || 1,
  };

  const result = await addToCart(data);
  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  } else {
    return {
      success: true,
      message: "ສິນຄ້າເພີ່ມເຂົ້າໃນກະຕ່າແລ້ວ",
    };
  }
};

export const updateCartItemAction = async (formData: FormData) => {
  const data = {
    cartItemId: formData.get("cart-item-id") as string,
    newCount: parseInt(formData.get("new-count") as string) || 1,
  };

  const result = await updateCartItem(data);

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const removeFromCartAction = async (cartItemId: string) => {
  const result = await removeFromCart(cartItemId);
  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const clearCartAction = async () => {
  const result = await clearCart();

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  } else {
    return {
      success: true,
      message: "ລ້າງກະຕ່າແລ້ວ",
    };
  }
};