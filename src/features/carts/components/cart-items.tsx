"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { removeFromCartAction, updateCartItemAction } from "../actions/carts";
import { toast } from "sonner";

interface CartItemsProps {
  cart: CartType;
}

interface CartOptimistic {
  type: "update" | "remove";
  itemId: string;
  newCount?: number;
}

const CartItems = ({ cart }: CartItemsProps) => {
  // eslint-disable-next-line
  const [isPending, startTransition] = useTransition();

  //   ເຮັດໃຫ້ໜ້າ ui ເຮັດວຽກກ່ອນທີ່ເຊີບເວີ່ຈະຕອບກັບ ຕົວຢ່າງການເພີ່ມສິນຄ້າລົງກະຕ່າທີ່ເພີ່ມລົງໄປໃນຖານຂໍ້ມູນເລີຍ
  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, { type, itemId, newCount }: CartOptimistic) => {
      if (type === "update" && newCount !== undefined) {
        const updatedItems = state.items.map((item) => {
          if (item.id === itemId) {
            const newPrice = newCount * item.product.price;
            return {
              ...item,
              count: newCount,
              price: newPrice,
            };
          }
          return item;
        });

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price,
          0
        );
        const newItemCount = updatedItems.reduce(
          (sum, item) => sum + item.count,
          0
        );
        return {
          ...state,
          items: updatedItems,
          cartTotal: newTotal,
          itemCount: newItemCount,
        };
      }

      if (type === "remove") {
        const updatedItems = state.items.filter((item) => item.id !== itemId);
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price,
          0
        );
        const newItemCount = updatedItems.reduce(
          (sum, item) => sum + item.count,
          0
        );
        return {
          ...state,
          items: updatedItems,
          cartTotal: newTotal,
          itemCount: newItemCount,
        };
      }
      return state;
    }
  );

  const handleUpdateQty = (itemId: string, newCount: number) => {
    startTransition(async () => {
      updateOpCart({
        type: "update",
        itemId,
        newCount,
      });

      const formData = new FormData();
      formData.append("cart-item-id", itemId);
      formData.append("new-count", newCount.toString());
      const result = await updateCartItemAction(formData);
      if (result && result.message) {
        toast.error(result.message);
      }
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    startTransition(async () => {
      updateOpCart({
        type: "remove",
        itemId,
      });

      const result = await removeFromCartAction(itemId);
      if (result && result.message) {
        toast.error(result.message);
      }
    });
  };
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">ລາຍການສິນຄ້າໃນກະຕ່າ</h2>

      {opCart.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative size-24 border border-primary rounded-md overflow-hidden">
            <Link href={`/products/${item.product.id}`}>
              <Image
                alt={item.product.title}
                src={
                  item.product.mainImage?.url || "/images/no-product-image.png"
                }
                fill
                className="object-cover rounded-md"
              />
            </Link>
          </div>

          {/* product detail */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <Link
                className="text-lg font-medium hover:text-primary transition-colors"
                href={`/products/${item.product.id}`}
              >
                {" "}
                {item.product.title}{" "}
              </Link>
              <p className="font-semibold"> {formatPrice(item.price)} ກີບ</p>
            </div>
            <div className="text-sm text-muted-foreground">
              ປະເພດ: {item.product.category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              ລາຄາຕໍ່ອັນ: {formatPrice(item.product.price)} ກີບ
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleUpdateQty(item.id, item.count - 1)}
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count <= 1}
                >
                  <Minus size={14} />
                </Button>
                <span className="mx-2 text-sm font-semibold">{item.count}</span>
                <Button
                  onClick={() => handleUpdateQty(item.id, item.count + 1)}
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count >= item.product.stock}
                >
                  <Plus size={14} />
                </Button>
              </div>
              <Button
                onClick={() => handleRemoveItem(item.id)}
                variant={"ghost"}
                size={"icon"}
                className="text-destructive/90 hover:text-destructive"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CartItems;
