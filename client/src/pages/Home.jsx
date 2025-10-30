import React, { useEffect, useState } from "react";
import api from "../api";
import DistrictSelector from "../components/DistrictSelector";

export default function Home({ onSelectDistrict }) {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoDetectLoading, setAutoDetectLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/mgnrega/districts")
      .then((res) => setDistricts(res.data || []))
      .catch((err) => setError("Unable to load districts"))
      .finally(() => setLoading(false));
  }, []);

  const handleUseMyLocation = () => {
    setAutoDetectLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setAutoDetectLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api
          .get(`/api/geo/reverse?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`)
          .then((res) => {
            const district = res.data.district || res.data.state || "";
            if (!district) setError("Could not detect district");
            else onSelectDistrict(district);
          })
          .catch(() => setError("Reverse geocoding failed"))
          .finally(() => setAutoDetectLoading(false));
      },
      (err) => {
        setError("Location permission denied or unavailable");
        setAutoDetectLoading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div>
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Find your District</h2>

        <div className="flex gap-2">
          <DistrictSelector
            districts={districts}
            loading={loading}
            onSelect={onSelectDistrict}
          />
          <button
            onClick={handleUseMyLocation}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={autoDetectLoading}
          >
            {autoDetectLoading ? "Detecting..." : "Use my location"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </section>

      <section className="mt-4">
        <h3 className="text-md font-semibold mb-2">How this helps</h3>
        <div className="bg-white p-4 rounded shadow text-sm">
          <p>See how many households got work, person-days, wages paid, and 12-month trend. Simple visuals and local language can be added later.</p>
        </div>
      </section>
    </div>
  );
}
