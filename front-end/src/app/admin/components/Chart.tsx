"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: { mes: string; membresias: number }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="p-6 rounded-lg shadow-md bg-fondo">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Membresías adquiridas
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="mes" stroke="#black" />
          <YAxis stroke="#black" />
          <Tooltip />
          <Bar dataKey="membresias" fill="#80c342" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
