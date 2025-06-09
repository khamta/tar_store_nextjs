"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import { forgotPasswordAction } from "../actions/auths";
import { useForm } from "@/hooks/use-form";

const ForgotPasswordForm = () => {
  const { formAction, isPending } = useForm(
    forgotPasswordAction,
    "/auth/signin",
  );

  return (
    <Form action={formAction}>
      <CardContent>
        <InputForm label="ອີເມລ໌" id="email" type="email" required />
      </CardContent>
      <CardFooter className="pt-6">
        <SubmitBtn
          name="ສົ່ງລິ້ງເພື່ອຣີເຊັດລະຫັດຜ່ານ"
          className="w-full"
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};

export default ForgotPasswordForm;
