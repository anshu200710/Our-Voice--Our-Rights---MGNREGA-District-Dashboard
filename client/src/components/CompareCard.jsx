import React from "react";

export default function CompareCard({ compare }) {
  if (!compare) return <div className="text-sm text-slate-500">No comparison data</div>;
  const { avgPersonDays, diff } = compare;
  const sign = diff > 0 ? "+" : "";
  const color = diff > 0 ? "text-green-700" : diff < 0 ? "text-red-700" : "text-slate-700";

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-slate-500">State average person-days (last 12 months)</div>
      <div className="text-xl font-semibold mt-1">{avgPersonDays.toLocaleString()}</div>
      <div className={`mt-2 ${color}`}>Latest month: {sign}{Math.round(diff)}% vs average</div>
    </div>
  );
}
