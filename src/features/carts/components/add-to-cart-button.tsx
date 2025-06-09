'use client';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { addToCartAction } from "../actions/carts";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
  children?: React.ReactNode;
}

const AddToCartButton = ({
  productId,
  stock,
  className,
  children,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("product-id", productId);
      formData.append("count", "1");

      const result = await addToCartAction(formData);
      if (result && result.success) {
      toast.success(result.message)
      }
      else {
        toast.error(result.message)
      }
    });

  }
  return (
    <Button className={className} onClick={handleAddToCart} disabled={stock <= 0 || isPending}>
      <ShoppingCart size={16} />
      <span> {children || "ເພີ່ມລົງກະຕ່າ"} </span>
    </Button>
  );
};

export default AddToCartButton;
