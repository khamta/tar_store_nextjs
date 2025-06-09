import AuthForm from "@/features/auths/components/auth-form";
import AuthHeader from "@/features/auths/components/auth-header";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ສະຫມັກສະມາຊິກ",
  description:
    "ຮ້ານຄ້າອອນໄລນ໌ ສໍາລັບຄົນລາວ ສິນຄ້າແບບເທັນໂນໂລຢີ ພ້ອມບໍລິການ ສົ່ງສິນຄ້າໃນເວລາ 24 ຊົ່ວໂມງ",
};
const SignupPage = () => {
    const type = "signup";
  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  );
};

export default SignupPage;
