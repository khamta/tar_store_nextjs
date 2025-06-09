"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { clearCartAction } from "../actions/carts";
import { toast } from "sonner";
import { useOptimistic, useTransition } from "react";

interface CartSummaryProps {
  cart: CartType;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  // eslint-disable-next-line
  const [isPending, startTransition] = useTransition();

  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, action: "clear") => {
      if (action === "clear") {
        return {
          ...state,
          items: [],
          cartTotal: 0,
          itemCount: 0,
        };
      }

      return state;
    }
  );

  const handleClearCart = async () => {
    startTransition(() => {
      updateOpCart("clear");
    });

    const result = await clearCartAction();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-medium mb-4">ສະຫຼຸບການສັ່ງຊື້</h2>

      <div className="flex justify-between">
        <span>ຍອດລວມ</span>
        <span> {formatPrice(cart.cartTotal)} ກີບ</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>ຄ່າສົ່ງ</span>
        <span> ຟຣີ</span>
      </div>
      <Separator />
      <div className="flex justify-between font-medium text-lg">
        <span>ລວມທັງໝົດ</span>
        <span> {formatPrice(cart.cartTotal)} ກີບ</span>
      </div>

      <div className="pt-4 space-y-2">
        <Button size="lg" className="w-full" asChild>
          <Link href="/checkout">
            <ShoppingBag size={18} />
            <span>ສັ່ງຊື້</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          disabled={opCart.items.length === 0}
          onClick={handleClearCart}
        >
          ລ້າງຂໍ້ມູນໃນກະຕ່າ
        </Button>
      </div>
    </Card>
  );
};

export default CartSummary;
