import React, { useEffect, useState } from "react";
import api from "../api";
import StatsCard from "../components/StatsCard";
import TrendChart from "../components/TrendChart";
import CompareCard from "../components/CompareCard";

export default function DistrictPage({ district, onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/api/mgnrega/${encodeURIComponent(district)}`)
      .then((res) => {
        const data = res.data || [];
        // sort by year+month if needed (assuming month names may not sort correctly)
        // Here we assume API returns records in chronological order; we'll take last 12
        setRecords(data.slice(-12));
        setLatest(data.slice(-1)[0] || null);
      })
      .catch(() => setError("Failed to load district data"))
      .finally(() => setLoading(false));
  }, [district]);

  // comparison: simple example against average of returned months
  const computeComparison = () => {
    if (!records.length) return null;
    const avgPersonDays =
      records.reduce((s, r) => s + Number(r.persondays_generated || 0), 0) /
      records.length;
    const latestPd = Number(latest?.persondays_generated || 0);
    const diff = avgPersonDays ? ((latestPd - avgPersonDays) / avgPersonDays) * 100 : 0;
    return { avgPersonDays: Math.round(avgPersonDays), diff: Math.round(diff) };
  };

  const compare = computeComparison();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button className="text-blue-600 underline" onClick={onBack}>
          ← Back
        </button>
        <h2 className="text-xl font-bold">{district}</h2>
        <div />
      </div>

      {loading && <div>Loading data…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && latest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Households worked" value={latest.no_of_households_worked} />
          <StatsCard title="Person-days" value={latest.persondays_generated} />
          <StatsCard title="Wages paid (₹)" value={latest.wages_paid} />
        </div>
      )}

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Last 12 months</h3>
        <TrendChart data={records} />
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Comparison</h3>
        <CompareCard compare={compare} />
      </div>
    </div>
  );
}
