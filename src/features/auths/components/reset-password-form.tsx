"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import { resetPasswordAction } from "../actions/auths";
import { useForm } from "@/hooks/use-form";
import ErrorMessage from "@/components/shared/error-message";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { errors, formAction, isPending, clearErrors } = useForm(
    resetPasswordAction,
    "/auth/signin",
  );

  return (
    <Form action={formAction} onChange={clearErrors}>
      <input type="hidden" name="token" value={token} />
      <CardContent className="flex flex-col gap-4">
        <div>
      <InputForm label="ລະຫັດຜ່ານໃໝ່" id="password" type="password" required={true} />
      {errors['password'] && <ErrorMessage error={errors['password'][0]} />}

    </div>

    <div>
      <InputForm label="ຢືນຢັນລະຫັດຜ່ານ" id="confirm-password" type="password" required={true} />
    </div>

        
      </CardContent>

      <CardFooter className="pt-6">
        <SubmitBtn
          name="ປ່ຽນລະຫັດຜ່ານ"
          className="w-full"
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};

export default ResetPasswordForm;
