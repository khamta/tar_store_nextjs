"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor, getStatusText } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import { Ban, Check, Truck } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "../actions/orders";
import { toast } from "sonner";

interface AdminOrderDetailProps {
  order: OrderType;
}

const AdminOrderDetail = ({ order }: AdminOrderDetailProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status,
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );

  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("order-id", order.id);
      formData.append("status", selectedStatus);

      if (trackingNumber) {
        formData.append("tracking-number", trackingNumber);
      }

      const result = await updateOrderStatusAction(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <CardTitle className="text-xl">ລາຍລະອຽດການສັ່ງຊື້</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ສິນຄ້າ</TableHead>
                  <TableHead className="text-right">ລາຄາ</TableHead>
                  <TableHead className="text-center">ຈຳນວນ</TableHead>
                  <TableHead className="text-right">ລວມ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 border rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            alt={item.productTitle}
                            src={
                              item.productImage ||
                              "/images/no-product-image.webp"
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{item.productTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.totalPirce)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ຂໍ້ມູນຂອງລູກຄ້າ</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm">ຊື່</Label>
                <div className="font-medium">
                  {order.customer.name || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">ອີເມລ໌</Label>
                <div className="font-medium">{order.customer.email}</div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">ເບີໂທ</Label>
                <div className="font-medium">
                  {order.phone || "Not provided"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ຂໍ້ມູນການຂົນສົ່ງ</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm">ທີ່ຢູ່</Label>
                <div className="font-medium">
                  {order.address || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  ເລກພັດສະດຸ
                </Label>
                <div className="font-medium">
                  {order.trackingNumber || "Not provided"}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">ໝາຍເຫດ</Label>
                <div className="font-medium">{order.note || "None"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">ສະຫຼຸບການສັ່ງຊື້</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ລວມຍອດ:</span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">ຄ່າສົ່ງ:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>ລວມທັງໝົດ:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ປ່ຽນແປງສະຖານະການສັ່ງຊື້</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="status">ສະຖານະ</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as OrderStatus)
                  }
                  disabled={order.status === "Cancelled"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Pending">ລໍຖ້າຊຳລະເງິນ</SelectItem>
                    <SelectItem value="Paid">ຊຳລະເງິນແລ້ວ</SelectItem>
                    <SelectItem value="Shipped">ຈັດສົ່ງແລ້ວ</SelectItem>
                    <SelectItem value="Delivered">ໄດ້ຮັບເຄື່ອງແລ້ວ</SelectItem>
                    <SelectItem value="Cancelled">ຍົກເລີກແລ້ວ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedStatus === "Shipped" ||
                selectedStatus === "Delivered") && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tracking">ເລກພັດສະດຸ</Label>
                  <Input
                    id="tracking"
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(event) => setTrackingNumber(event.target.value)}
                  />
                </div>
              )}
            </div>

            {order.paymentImage && (
              <div className="space-y-2">
                <Label>ຫຼັກຖານການຊຳລະເງິນ</Label>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                  <Image
                    alt="Payment proof"
                    src={order.paymentImage}
                    fill
                    className="object-contain"
                  />
                </div>
                {order.paymentAt && (
                  <p className="text-sm text-muted-foreground">
                    ຊຳລະເມື່ອ: {order.paymentAtFormatted}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={handleUpdateStatus}
              disabled={
                isPending ||
                selectedStatus === order.status ||
                (["Shipped", "Delivered"].includes(selectedStatus) &&
                  !trackingNumber)
              }
            >
              <>
                {selectedStatus === "Shipped" && <Truck size={16} />}
                {selectedStatus === "Delivered" && <Check size={16} />}
                {selectedStatus === "Cancelled" && <Ban size={16} />}
              </>
              <span>ປ່ຽນແປງສະຖານະ</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
