import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Eye } from "lucide-react";
import Link from "next/link";

interface AdminOrderListProps {
  orders: OrderType[];
}

const AdminOrderList = ({ orders }: AdminOrderListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ລະຫັດສັ່ງຊື້ #</TableHead>
            <TableHead>ລູກຄ້າ</TableHead>
            <TableHead>ວັນເວລາ</TableHead>
            <TableHead>ຈຳນວນ</TableHead>
            <TableHead>ຈຳນວນເງິນ</TableHead>
            <TableHead>ສະຖານະ</TableHead>
            <TableHead className="text-right">ອັອບຊັ່ນ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                ບໍ່ພົບອໍເດີໃນລະບົບ
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  {order.customer.name || order.customer.email}
                </TableCell>
                <TableCell>{order.createdAtFormatted}</TableCell>
                <TableCell>{order.totalItems} ອັນ</TableCell>
                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye size={14} />
                      <span>ລາຍລະອຽດ</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrderList;
