"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
  data: { mes: string; membresias: number }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="bg-[#091620] p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-[#F2F2F2] mb-4">
        Membresías adquiridas
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="mes" stroke="#F2F2F2" />
          <YAxis stroke="#F2F2F2" />
          <Tooltip />
          <Bar dataKey="membresias" fill="#58D68D" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
