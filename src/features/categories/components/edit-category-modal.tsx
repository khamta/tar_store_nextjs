import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { useForm } from "@/hooks/use-form";
import { CategoryType } from "@/types/category";
import { Edit } from "lucide-react";
import Form from "next/form";
import { categoryAction } from "../actions/categories";
import ErrorMessage from "@/components/shared/error-message";
import { useEffect } from "react";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
}
const EditCategoryModal = ({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) => {
  const {state, errors, formAction, isPending, clearErrors } =
    useForm(categoryAction);
    useEffect(() => {
      if (state.success) {
        onOpenChange(false)
      }
    }, [state, onOpenChange])
    useEffect(() => {
      if (open) {
        clearErrors()
      }
    }, [open, clearErrors])
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="ແກ້ໄຂໝວດໝູ່"
      description="ແກ້ໄຂຂໍ້ມູນສິນຄ້າຂອງທ່ານ"
    >
      <Form action={formAction} onChange={clearErrors} className="space-y-4">
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="space-y-2">
          <InputForm
            label="ໝວດໝູ່"
            id="category-name"
            placeholder="ປ້ອນໝວດໝູ່....."
            required
            defaultValue={category?.name}
          />
          {/* error message */}
          {errors.name && <ErrorMessage error={errors.name[0]} />}
        </div>

        <SubmitBtn name="ແກ້ໄຂ" icon={Edit} className="w-full" pending={isPending} />
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
