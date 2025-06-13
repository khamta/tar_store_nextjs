"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/features/carts/components/add-to-cart-button";
import ProductDetailModal from "@/features/products/components/product-detail-modal";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const discount =
    product.basePrice > product.price
      ? ((product.basePrice - product.price) / product.basePrice) * 100
      : 0;

  const handleDetailClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDetailModal(true);
  };
  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md">
        <div
          className="cursor-pointer"
          onClick={() => handleDetailClick(product)}
        >
          <div className="relative pt-[100%] overflow-hidden bg-muted-foreground">
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 z-2 px-2 py-1">
                -{Math.round(discount)}%
              </Badge>
            )}

            <div className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105">
              <Image
                alt={product.title}
                src={product.mainImage?.url || "/images/no-product-image.png"}
                fill
                className="object-cover"
              />
            </div>
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <Badge variant={"destructive"} className="text-sm px-3 py-1">
                  ສິນຄ້າໝົດ
                </Badge>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium line-clamp-2 min-h-[18px] group-hover:text-primary transition-colors duration-200">
                {product.title}
              </h3>
            </Link>
            <div className="flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="font-medium text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.basePrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>
              {product.stock > 0 ? (
                <Badge
                  variant={"outline"}
                  className={cn(
                    "transition-colors duration-200",
                    product.stock <= product.lowStock
                      ? "text-red-500 border-red-500"
                      : "text-green-500 border-green-500"
                  )}
                >
                  {product.stock <= product.lowStock
                    ? "ຍັງເຫຼືອນ້ອຍ"
                    : "ພ້ອມສົ່ງ"}
                </Badge>
              ) : (
                <Badge
                  variant={"outline"}
                  className="text-destructive border-destructive"
                >
                  ສິນຄ້າໝົດ
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 gap-2">
          <AddToCartButton
            productId={product.id}
            stock={product.stock}
            className="w-full gap-1"
          />
        </CardFooter>
      </Card>
      <ProductDetailModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductCard;
