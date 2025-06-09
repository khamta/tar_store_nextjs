import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { categorySchema } from "../schemas/categories";
import { authCheck } from "@/features/auths/db/auths";
import {
  canCreateCategory,
  canUpdateCategory,
} from "../permissions/categories";
import { redirect } from "next/navigation";
import { CategoryStatus } from "@prisma/client";

interface CreateCategoryInput {
  name: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
}

export const getCategories = async () => {
  "use cache";

  cacheLife("days");
  cacheTag(await getCategoryGlobalTag());

  try {
    return await db.category.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  } catch (error) {
    console.log("Error getting categories data: ", error);
    return [];
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const user = await authCheck();
  if (!user || !canCreateCategory(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ",
        error: error.flatten().fieldErrors,
      };
    }

    //  Check category already exists from data base
    const category = await db.category.findFirst({
      where: {
        name: data.name,
      },
    });
    if (category) {
      return {
        message: "ໝວດໝູ່ນີ້ມີໃນລະບົບແລ້ວ",
      };
    }

    // Create new category
    const newCategory = await db.category.create({
      data: {
        name: data.name,
      },
    });
    revalidateCategoryCache(newCategory.id);
  } catch (error) {
    console.error("Error creating new category", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const updateCategory = async (input: UpdateCategoryInput) => {
  const user = await authCheck();
  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຖືກຕ້ອງ",
        error: error.flatten().fieldErrors,
      };
    }

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existingCategory) {
      return {
        message: "Category not found",
      };
    }

    // Check if another category with the same name exists
    const duplicateCategory = await db.category.findFirst({
      where: {
        name: data.name,
        id: {
          not: input.id,
        },
      },
    });
    if (duplicateCategory) {
      return {
        message: "A category with this name already exists",
      };
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });
    revalidateCategoryCache(updatedCategory.id);
  } catch (error) {
    console.error("Error updating category", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const changeCategoryStatus = async (
  id: string,
  status: CategoryStatus
) => {
  const user = await authCheck();
  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }
  try {
    //  Check if category exists
    const existsCategory = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!existsCategory) {
      return {
        message: "ບໍ່ພົບໝວດໝູ່ນີ້ໃນລະບົບ",
      };
    }
    // if status is already
    if (existsCategory.status === status) {
      return {
        message: `ສະຖານະ ${status.toLowerCase()} ຖືກໃຊ້ແລ້ວ`,
      };
    }
    // Update status
    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    revalidateCategoryCache(updatedCategory.id);
  } catch (error) {
    console.error("Error changing category status", error);
    return {
      message: "ມີບາງຢ່າງຜິດພາດ ກະລຸນາລອງອີກຄັ້ງພາຍຫລັງ",
    };
  }
};

export const removeCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Inactive");
};

export const restoreCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Active")
}
