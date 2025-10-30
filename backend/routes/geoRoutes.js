// backend/routes/geoRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng)
    return res.status(400).json({ error: "Latitude and longitude required" });

  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`;
    const response = await axios.get(url);
    const components = response.data.results[0]?.components || {};
    const district =
      components.county || components.state_district || components.city || "";
    const state = components.state || "";

    res.json({ district, state });
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed", message: err.message });
  }
});

export default router;
