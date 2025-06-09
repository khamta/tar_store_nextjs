"use server";

import { InitialFormState } from "@/types/action";
import { signin, signup, signout, sendResetPasswordEmail, resetPassword } from "@/features/auths/db/auths"

export const authAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = rawData.confirmPassword ? await signup(rawData) : await signin(rawData)
  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : { success: true, message: rawData.confirmPassword ? "ສະໝັກສະມາຊິກສຳເລັດ" : "ເຂົ້າສູ່ລະບົບສຳເລັດ" };
};

export const signoutAction = async () => {
 const result = await signout()
 return result && result.message ? { success: false, message: result.message } : {
  success: true, message: 'ອອກຈາກລະບົບສຳເລັດ'
 }
}

export const forgotPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const email = formData.get("email") as string;

  const result = await sendResetPasswordEmail(email);

  return result && result.message
    ? { success: false, message: result.message }
    : {
        success: true,
        message: "ເຮົາສົ່ງອີເມລ໌ເພື່ອຂໍກູ້ຄືນລະຫັດຜ່ານຮຽບຮ້ອຍແລ້ວ",
      };
};

export const resetPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm-password") as string,
  };

  const result = await resetPassword(data);
  
  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error
      }
    : {
        success: true,
        message: "ກູ້ຄືນລະຫັດຜ່ານສຳເລັດ ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ",
      };
};