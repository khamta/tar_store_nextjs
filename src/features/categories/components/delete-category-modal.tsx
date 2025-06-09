import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { CategoryType } from "@/types/category";
import { Trash2 } from "lucide-react";
import Form from "next/form";
import { deleteCategoryAction } from "../actions/categories";
import { useEffect } from "react";
interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
}
const DeleteCategoryModal = ({
  open,
  onOpenChange,
  category,
}: DeleteCategoryModalProps) => {
 const { state, formAction, isPending } = useForm(deleteCategoryAction)

 useEffect(() => {
  if (state.success) onOpenChange(false)
 }, [state, onOpenChange])
  return (
    <Modal
      open={open}
      title="ລົບໝວດໝູ່"
      description="ເຈົ້າແນ່ໃຈ ຫລື ບໍ່ວ່າຈະລົບໝວດໝູ່ນີ້"
      onOpenChange={onOpenChange}
    >
      <Form action={formAction}>
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button type="button" variant={'outline'} onClick={() => onOpenChange(false)} disabled={isPending}>
            ຍົກເລີກ
          </Button>
          <SubmitBtn name="Delete" icon={Trash2} className="bg-destructive hover:bg-destructive/80" pending={isPending} />
        </div>
      </Form>
    </Modal>
  );
};
export default DeleteCategoryModal;
