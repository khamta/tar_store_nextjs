"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardContentProps {
  data: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

const DashboardContent = ({ data }: DashboardContentProps) => {
  const formatPrice = (value: number) => {
  return `${value.toLocaleString()} ກີບ`; // หรือ `${value.toLocaleString()} บาท`
};
  return (
    <Card>
      <CardHeader>
        <CardTitle>ຂາຍປະຈຳອາທິດສຳຫຼັບ 1 ເດືອນ</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis width={120} tickFormatter={formatPrice} />
              <Legend />
              <Tooltip formatter={(value) => formatPrice(Number(value))} />

              <Bar
                dataKey="revenue"
                fill="#4F46E5"
                name="ລາຍຮັບ (Revenue)"
                barSize={50}
              />

              <Bar
                dataKey="cost"
                fill="#E53E3E"
                name="ຕົ້ນທຶນ (Cost)"
                barSize={50}
              />

              <Bar
                dataKey="profit"
                fill="#22C55E"
                name="ກຳໄລ (Profit)"
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
