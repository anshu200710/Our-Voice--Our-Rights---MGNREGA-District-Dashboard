import React, { useState } from "react";
import Home from "./pages/Home";
import DistrictPage from "./pages/DistrictPage";

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Our Voice, Our Rights — MGNREGA</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {!selectedDistrict ? (
          <Home onSelectDistrict={(d) => setSelectedDistrict(d)} />
        ) : (
          <DistrictPage
            district={selectedDistrict}
            onBack={() => setSelectedDistrict(null)}
          />
        )}
      </main>

      <footer className="bg-white border-t mt-8 p-4 text-center text-xs text-slate-600">
        Data: Government of India | Demo app
      </footer>
    </div>
  );
}
