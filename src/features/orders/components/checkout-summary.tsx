import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import Image from "next/image";

interface CheckoutSummaryProps {
  cart: CartType;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  const shippingFee = 20000;

  const totalAmount = cart.cartTotal + shippingFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">ສະຫຼຸບລາຍການສັ່ງຊື້</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {cart.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative size-12 border rounded-md overflow-hidden">
                <Image
                  alt={item.product.title}
                  src={
                    item.product.mainImage?.url ||
                    "/images/no-product-image.webp"
                  }
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-sm">
                <div className="font-medium line-clamp-1">
                  {item.product.title}
                </div>
                <div className="text-muted-foreground">
                  {item.count} x {formatPrice(item.product.price)}
                </div>
              </div>

              <div className="font-medium">{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span>ລວມຍອດ</span>
            <span>{formatPrice(cart.cartTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>ຄ່າສົ່ງ</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>ລວມທັງໝົດ</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
