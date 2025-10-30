import React, { useState } from "react";

export default function DistrictSelector({ districts = [], loading, onSelect }) {
  const [q, setQ] = useState("");

  const list = districts.filter((d) =>
    d.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="flex-1">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search district..."
        className="w-full p-2 border rounded mb-2"
      />
      <div className="max-h-40 overflow-auto border rounded">
        {loading && <div className="p-2">Loading districts…</div>}
        {!loading && list.length === 0 && <div className="p-2 text-sm text-slate-500">No districts</div>}
        {!loading &&
          list.map((d) => (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className="w-full text-left p-2 hover:bg-slate-100"
            >
              {d}
            </button>
          ))}
      </div>
    </div>
  );
}
