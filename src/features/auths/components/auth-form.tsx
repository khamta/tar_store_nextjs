"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import AuthFooter from "./auth-footer";
import { useForm } from "@/hooks/use-form";
import { authAction } from "../actions/auths";
import ErrorMessage from "@/components/shared/error-message";
import { useState } from "react";

interface AuthFormProps {
  type: "signup" | "signin";
}

const AuthForm = ({ type }: AuthFormProps) => {
const [form, setForm] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

  const renderInput = (
    label: string,
    id: string,
    type = "text",
    required = false
  ) => (
    <div>
      <InputForm
      label={label}
      id={id}
      type={type}
      required={required}
      onChange={(e) => setForm({ ...form, [id]: e.target.value })}
      value={form[id as keyof typeof form] || ""}
      />
      {errors[id] && <ErrorMessage error={errors[id][0]} />}
    </div>
  );

  const { errors, formAction, isPending, clearErrors } = useForm(
    authAction,
    "/"
  );

  return (
    <Form action={formAction} onChange={clearErrors}>
      <CardContent className="flex flex-col gap-4">
        {type === "signup" && renderInput("ຊື່ຜູ້ໃຊ້", "name", "text", )}
        {renderInput("ອີເມວ", "email", "email", true)}
        {renderInput("ລະຫັດຜ່ານ", "password", "password", true)}
        {type === "signup" &&
          renderInput("ລະຫັດຜ່ານອີກຄັ້ງ", "confirmPassword", "password", true)}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <AuthFooter type={type} />
        <SubmitBtn
          pending={isPending}
          className="w-full"
          name={type === "signup" ? "ສະໝັກສະມາຊິກ" : "ເຂົ້າສູ່ລະບົບ"}
        />
      </CardFooter>
    </Form>
  );
};

export default AuthForm;
