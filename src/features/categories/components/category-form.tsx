"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@/hooks/use-form";
import { Plus } from "lucide-react";
import Form from "next/form";
import { categoryAction } from "../actions/categories";
import ErrorMessage from "@/components/shared/error-message";

const CategoryForm = () => {
  const { errors, formAction, isPending, clearErrors } =
    useForm(categoryAction);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Plus size={18} />
          <span>ເພີ່ມໝວດໝູ່ໃຫມ່</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          ສ້າງໝວດໝູ່ໃຫມ່ສຳລັບສິນຄ້າຂອງທ່ານ
        </CardDescription>
      </CardHeader>
      <Form action={formAction} onChange={clearErrors} className="space-y-4">
        <CardContent>
          <div className="space-y-2">
            <InputForm
              label="ໝວດໝູ່"
              id="category-name"
              placeholder="ປ້ອນໝວດໝູ່....."
              required
            />
            {/* error message */}
            {errors.name && <ErrorMessage error={errors.name[0]} />}
          </div>
        </CardContent>

        <CardFooter>
          <SubmitBtn pending={isPending} name="ເພີ່ມໃໝ່" icon={Plus} className="w-full" />
        </CardFooter>
      </Form>
    </Card>
  );
};

export default CategoryForm;
