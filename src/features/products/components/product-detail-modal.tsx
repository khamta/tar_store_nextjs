import Modal from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/types/product";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/formatPrice";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const ProductDetailModal = ({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) => {

  const [activeTab, setActiveTab] = useState("overview");

  if (!product) return null;

  const formattedDate = dayjs(product.createdAt).fromNow();

  const stockColor = (() => {
    switch (true) {
      case product.stock <= 0:
        return "text-red-600";
      case product.stock <= product.lowStock:
        return "text-amber-500";
      default:
        return "text-green-600";
    }
  })();

  const stockStatus = (() => {
    switch (true) {
      case product.stock <= 0:
        return "ຖືກລົບແລ້ວ";
      case product.stock <= product.lowStock:
        return "ໃກ້ໝົດແລ້ວ";
      default:
        return "ມີໃນສະຕັອກ";
    }
  })();

  const discount =
    product.basePrice > product.price
      ? (
          ((product.basePrice - product.price) / product.basePrice) *
          100
        ).toFixed(2)
      : "0";

  const profitPerUnit = product.cost > 0 ? product.price - product.cost : 0;
  const profitMargin =
    product.cost > 0
      ? ((profitPerUnit / product.cost) * 100).toFixed(2)
      : "N/A";

  const handleTabActive = async (value: string) => {
    setActiveTab(value);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product.title}
      description={`SKU: ${product.sku}`}
      className="md:max-w-3xl"
    >
      <div>
        <Tabs value={activeTab} onValueChange={handleTabActive}>
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview">ພາບລວມ</TabsTrigger>
            <TabsTrigger value="details">ລາຍລະອຽດ</TabsTrigger>
            <TabsTrigger value="images">
              ຮູບພາບ ({product.images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                  {/* Main Image */}
                  <div className="relative aspect-square border rounded-md overflow-hidden group">
                    <Image
                      alt={product.title}
                      src={
                        product.mainImage?.url ||
                        "/images/no-product-image.webp"
                      }
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Tag size={12} />
                        <span>{product.category.name}</span>
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold line-clamp-2 mb-1">
                      {product.title}
                    </h2>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock size={12} />
                      <span>ເພີ່ມເມື່ອ {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span className={`text-sm font-medium ${stockColor}`}>
                          {stockStatus}
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {product.stock} ລາຍການ
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span>{formatPrice(product.price)}</span>

                        {product.basePrice > product.price && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(product.basePrice)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {discount}% off
                            </Badge>
                          </div>
                        )}
                      </div>

                      {product.cost > 0 && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>ຕົ້ນທຶນ: {formatPrice(product.cost)}</span>
                          <span>•</span>
                          <span>
                            ກຳໄລ: {formatPrice(profitPerUnit)} ({profitMargin}
                            %)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-2">ສະຖິຕິການຂາຍ</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <ShoppingBag size={20} className="text-primary mb-1" />
                      <span className="font-bold">{product.sold}</span>
                      <span className="text-xs text-muted-foreground">ຂາຍ</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <DollarSign size={20} className="text-emerald-500 mb-1" />
                      <span className="font-bold">
                        {formatPrice(product.sold * product.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ລາຍຮັບ
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <FileText size={20} className="text-emerald-500 mb-1" />
                      <span className="font-bold">
                        {product.cost > 0
                          ? formatPrice(
                              product.sold * (product.price - product.cost)
                            )
                          : "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ກຳໄລ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="break-all">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">ລາຍລະອຽດສິນຄ້າ</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">ຂໍ້ມູນສະເພາະ</h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <h2 className="text-muted-foreground">SKU</h2>
                        <p className="font-medium">{product.sku}</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ໝວດໝູ່</h2>
                        <p className="font-medium">{product.category.name}</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ສະຖານະ</h2>
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ສະຕັອກ</h2>
                        <p className={`font-medium ${stockColor}`}>
                          {product.stock}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ລາຄາປົກກະຕິ</h2>
                        <p className="font-medium">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ລາຄາຂາຍ</h2>
                        <p className="font-medium">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ສ່ວນຫລຸດ</h2>
                        <p className="font-medium">{discount}%</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">ວັນທີ່ເພີ່ມ</h2>
                        <p className="font-medium">
                          {dayjs(product.createdAt).format("ll")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      ລາຍລະອຽດການຂາຍ
                    </h4>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ທັງໝົດ</TableHead>
                          <TableHead>ລາຍຮັບ</TableHead>
                          <TableHead>ຕົ້ນທຶນ</TableHead>
                          <TableHead>ກຳໄລ</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow>
                          <TableCell>{product.sold} ລາຍການ</TableCell>
                          <TableCell>
                            {formatPrice(product.sold * product.price)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(product.sold * product.cost)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(
                              product.sold * (product.price - product.cost)
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="images">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold mb-3">
                    All images ({product.images.length} photos)
                  </h3>

                  {product.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square border rounded-md overflow-hidden cursor-pointer group"
                        >
                          <Image
                            alt={`Product image ${index + 1}`}
                            src={image.url}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {image.isMain && (
                            <Badge className="absolute top-1 left-1 text-[10px] z-10">
                              Main
                            </Badge>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 bg-muted/50 rounded-md">
                      <ImageIcon
                        size={40}
                        className="text-muted-foreground mb-2 opacity-40"
                      />
                      <p className="text-sm text-muted-foreground">
                        There are no images for this product.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
