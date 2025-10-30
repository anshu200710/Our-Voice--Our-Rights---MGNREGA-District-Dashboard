import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/*
 expected data format: array of records:
 [{
   month: "October",
   fin_year: "2024-2025",
   persondays_generated: 9123445,
   ...
 }]
*/
export default function TrendChart({ data = [] }) {
  const chartData = data.map((d, i) => ({
    name: d.month ? `${d.month}` : `#${i + 1}`,
    personDays: Number(d.persondays_generated || 0),
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(val) => Number(val).toLocaleString()} />
          <Line type="monotone" dataKey="personDays" stroke="#0ea5a4" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
