"use client";

import ErrorMessage from "@/components/shared/error-message";
import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { UserType } from "@/types/user";
import { ShoppingBag } from "lucide-react";
import Form from "next/form";
import { checkoutAction } from "../actions/orders";

interface CheckoutFormProps {
  user: UserType;
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const hasUserData = !!(user.address && user.tel);

  const { errors, formAction, isPending, clearErrors } =
    useForm(checkoutAction);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ຂໍ້ມູນການຈັດສົ່ງ</CardTitle>
      </CardHeader>

      <Form action={formAction} onChange={clearErrors}>
        <CardContent className="flex flex-col gap-4">
          {hasUserData && (
            <div className="flex items-center space-x-2 mb-4 border p-3 rounded-md bg-muted/50">
              <Switch
                id="use-profile-data"
                name="use-profile-data"
                defaultChecked
              />
              <Label htmlFor="use-profile-data">
                ໃຊ້ຂໍ້ມູນຈາກໂປຣໄຟລ໌
              </Label>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <InputForm
              label="ເບີໂທລະສັບ"
              id="phone"
              placeholder="20 xxx xxx xx"
              defaultValue={user.tel || ""}
              required
            />
            {/* Error message */}
            {errors.phone && <ErrorMessage error={errors.phone[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">
              ທີ່ຢູ່ຈັດສົ່ງ <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={user.address || ""}
              placeholder="ກະລຸນາບອກທີ່ຢູ່ຈັດສົ່ງເຊັ່ນ ບ້ານ, ເມືອງ, ແຂວງ, ບໍລິສັດຂົນສົ່ງ, ສາຂາຂົນສົ່ງ"
              className="min-h-24"
            />
            {/* Error message */}
            {errors.address && <ErrorMessage error={errors.address[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">ໝາຍເຫດເພີ່ມເຕີມ</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="ໝາຍເຫດເພີ່ມເຕີມ (ຖ້າມີ)"
              className="min-h-20"
            />
            {/* Error message */}
            {errors.note && <ErrorMessage error={errors.note[0]} />}
          </div>

          <div className="pt-4">
            <SubmitBtn
              name="ດຳເນີນການສັ່ງຊື້"
              icon={ShoppingBag}
              className="w-full"
              pending={isPending}
            />
          </div>
        </CardContent>
      </Form>
    </Card>
  );
};

export default CheckoutForm;
