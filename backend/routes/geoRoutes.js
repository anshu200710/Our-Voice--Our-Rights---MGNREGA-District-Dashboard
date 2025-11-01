// backend/routes/geoRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/geo?lat=xx&lon=yy
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ message: "Latitude and longitude required" });

  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon,
        format: "json",
        addressdetails: 1,
      },
    });

    const address = geoRes.data.address || {};

    // Prefer explicit state fields
    const state =
      (address.state || address.region || address['state_district'] || address.county || "")
        .toString()
        .trim();

    // district could be county / state_district / city_district / suburb etc.
    const district =
      address.county ||
      address.state_district ||
      address.city_district ||
      address.suburb ||
      address.town ||
      address.city ||
      "";

    // If state is missing but district includes known union territory/city token, try to infer
    // e.g., 'East Delhi' -> state 'Delhi'
    let finalState = state;
    if (!finalState && district) {
      if (/delhi/i.test(district)) finalState = "Delhi";
      // add other heuristics if needed
    }

    // If still missing state, return 400 so frontend can fallback safely
    if (!finalState) {
      return res.status(422).json({ message: "Could not reliably determine state from location" });
    }

    res.json({
      state: finalState.toUpperCase(),
      district: (district || "").toUpperCase(),
      lat,
      lon,
    });
  } catch (err) {
    console.error("Geo lookup failed:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to get location" });
  }
});

export default router;
