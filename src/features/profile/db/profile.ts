import { authCheck } from "@/features/auths/db/auths";
import { revalidateUserCache } from "@/features/users/db/cache";
import { db } from "@/lib/db";
import { deleteFromImageKit } from "@/lib/imageKit";
import { redirect } from "next/navigation";

export const updateProfileImage = async (
  url: string | undefined,
  fileId: string | undefined
) => {
  const user = await authCheck();
  if (!user) {
    redirect("/");
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      return {
        message: "ບໍ່ພົບຜູ້ໃຊ້ນີ້ໃນລະບົບ",
      };
    }

    if (user.pictureId) {
      await deleteFromImageKit(user.pictureId);
    }

    if (url && fileId) {
       await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            pictureId: fileId,
            picture: url,
          },
        });
    }

    revalidateUserCache(user.id);
  } catch (error) {
    console.error("Error Updatting User: ", error);
    return {
      message: "ມີບາງຢ່າງຜິດພາດລອງອີກຄັ້ງພາຍຫລັງ!",
    };
  }
};
