// app/order-history/page.tsx

import { authCheck } from "@/features/auths/db/auths";
import { getOrderByUser } from "@/features/orders/db/orders";
import { formatPrice } from "@/lib/formatPrice";
import { getStatusColor, getStatusText } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrderHistoryPage() {
  const user = await authCheck();
  if (!user) {
    redirect("/");
  }
  const orders = await getOrderByUser(user.id);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">ປະຫວັດການສັ່ງຊື້</h1>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-2xl border p-0 border-gray-200 hover:shadow-lg transition">
            <Link
            href={`/my-orders/${order.id}`}
          >
            <div className="flex justify-between items-center mb-3 pt-5 px-5">
              <div>
                <p className="text-lg font-semibold">
                  ເລກທີ່ສັ່ງຊື້: {order.orderNumber}
                </p>
                <p className="text-sm text-gray-500">
                  ວັນທີ: {order.createdAtFormatted}
                </p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="text-right text-lg font-bold text-gray-700 pb-5 pr-5">
              ລວມຍອດ: {formatPrice(order.totalAmount)} ກີບ
            </div>
          </Link>
          </div>
        ))
        ) : (
          <div className="relative w-full text-muted-foreground text-2xl border border-primary rounded-md overflow-hidden flex justify-center items-center">
            <Link href={`/products`} className="p-10">
             <span>ທ່ານຍັງບໍ່ໄດ້ສັ່ງຊື້ ກະລຸນາກັບໄປສັ່ງຊື້ສິນຄ້າກ່ອນ...</span>
            </Link>
          </div>

        )}
      </div>
    </div>
  );
}
