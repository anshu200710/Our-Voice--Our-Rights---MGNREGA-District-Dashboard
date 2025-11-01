import axios from "axios";

const API_BASE = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Get current user's geo location (lat, lon, state, district)
 */
// export const fetchGeoLocation = async () => {
//   try {
//     const position = await new Promise((resolve, reject) =>
//       navigator.geolocation.getCurrentPosition(resolve, reject)
//     );

//     const { latitude, longitude } = position.coords;

//     const res = await axios.get(`${API_BASE}/geo`, {
//       params: { lat: latitude, lon: longitude },
//       timeout: 10000,
//     });

//     console.log("📍 Detected location:", res.data);
//     return res.data; // { state, district, lat, lon }
//   } catch (err) {
//     console.error("❌ Geo fetch failed:", err.message || err);
//     return null;
//   }
// };

export const fetchGeoLocation = async () => {
  try {
    // Try to get coordinates from the browser
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const { latitude, longitude } = position.coords;

    // Call backend with lat/lon
    const res = await axios.get(`${API_BASE}/geo`, {
      params: { lat: latitude, lon: longitude },
      timeout: 10000,
    });

    console.log("📍 Detected location:", res.data);
    return res.data; // { state, district, lat, lon }
  } catch (err) {
    console.warn("⚠️ Geolocation denied or failed:", err.message);
    // fallback to default
    const defaultLat = 25.3176; // Varanasi
    const defaultLon = 82.9739;
    const res = await axios.get(`${API_BASE}/geo`, {
      params: { lat: defaultLat, lon: defaultLon },
    });
    return res.data;
  }
};


/**
 * Fetch MGNREGA data from backend (normalized and cached by backend)
 */
export const fetchMGNREGAData = async (filters = {}) => {
  try {
    console.log("🔍 Fetching MGNREGA with filters:", filters);
    const res = await axios.get(`${API_BASE}/mgnrega`, {
      params: filters,
      timeout: 20000,
    });

    console.log(`✅ MGNREGA API response: ${res.status} (${res.data?.count || 0} records)`);
    return res.data;
  } catch (err) {
    console.error("❌ MGNREGA API error:", err.response?.data || err.message || err);
    return { success: false, count: 0, data: [] };
  }
};
