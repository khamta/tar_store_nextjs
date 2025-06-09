import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Form from "next/form";
import { cancelOrderStatusAction } from "../actions/orders";
import { useForm } from "@/hooks/use-form";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const CancelOrderModal = ({
  open,
  onOpenChange,
  orderId,
}: CancelOrderModalProps) => {
  const { formAction, isPending } = useForm(cancelOrderStatusAction);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="ຍົກເລີກການສັ່ງຊື້"
      description="ທ່ານຕ້ອງການທີ່ຈະຍົກເລີກການສັ່ງຊື້ນີ້ຫຼືບໍ່?"
    >
      <Form action={formAction}>
        <input type="hidden" name="order-id" value={orderId} />

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            ຍົກເລີກ
          </Button>
          <SubmitBtn
            name="ຍົກເລີກການສັ່ງຊື້"
            icon={Ban}
            className="bg-destructive hover:bg-destructive/80"
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default CancelOrderModal;
