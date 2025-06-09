import { UserType } from "@/types/user";

export const canUpdateUserCart = async (user: UserType) => {
  return user.status === "Active";
};
