"use server";

import { uploadToImageKit } from "@/lib/imageKit";
import { InitialFormState } from "@/types/action";
import { updateProfileImage } from "../db/profile";

export const imageProfileAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    image: formData.get("user-image") as File,
  };

  const uploadResult = await uploadToImageKit(rawData.image, "user");
  if (!uploadResult) {
    return {
      success: false,
      message: "ເພີ່ມຮູບພາບຂຶ້ນຄາວບໍ່ສຳເລັດ",
    };
  }
  const url = uploadResult.url;
  const fileId = uploadResult.fileId;

  const result = await updateProfileImage(url, fileId);
  

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "ແກ້ໄຂຮູບພາບສຳເລັດ",
      };
};
