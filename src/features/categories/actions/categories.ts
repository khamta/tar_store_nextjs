"use server";

import { InitialFormState } from "@/types/action";
import {
  createCategory,
  removeCategory,
  restoreCategory,
  updateCategory,
} from "../db/categories";

export const categoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("category-id") as string,
    name: formData.get("category-name") as string,
  };

  const result = rawData.id
    ? await updateCategory(rawData)
    : await createCategory(rawData);

  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error,
      }
    : {
        success: true,
        message: rawData.id ? "ແກ້ໄຂສຳເລັດ" : "ເພີ່ມຂໍ້ມູນສຳເລັດ",
      };
};

export const deleteCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("category-id") as string;
  const result = await removeCategory(id);
  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "ລົບໝວດໝູ່ສຳເລັດ",
      };
};

export const restoreCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("category-id") as string;
  const result = await restoreCategory(id);
  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "ກູ້ຄືນໝວດໝູ່ສຳເລັດ",
      };
};