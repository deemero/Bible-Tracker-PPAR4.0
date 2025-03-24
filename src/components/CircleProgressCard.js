// components/CircleProgressCard.js
"use client";
import { PieChart, Pie, Cell } from "recharts";

export default function CircleProgressCard({ label, value, color }) {
  const data = [
    { name: "Done", value: value },
    { name: "Remaining", value: 100 - value },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow text-center w-full">
      <PieChart width={80} height={80} className="mx-auto mb-2">
        <Pie
          data={data}
          dataKey="value"
          innerRadius={25}
          outerRadius={35}
          startAngle={90}
          endAngle={-270}
        >
          <Cell key="done" fill={color || "#22c55e"} />
          <Cell key="remain" fill="#e5e7eb" />
        </Pie>
      </PieChart>
      <h3 className="text-md font-semibold text-black dark:text-white">{value}%</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
