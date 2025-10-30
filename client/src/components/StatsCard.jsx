import React from "react";

export default function StatsCard({ title, value }) {
  const display = value === undefined || value === null ? "—" : Number(value).toLocaleString();
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{display}</div>
    </div>
  );
}
