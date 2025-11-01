import express from "express";
import { fetchAndStoreMGNREGAData } from "../utils/fetchMGNREGA.js";
import DistrictData from "../models/DistrictData.js";
import { normalizeState, normalizeDistrict } from "../utils/normalize.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let { state, district } = req.query;

    if (!state) {
      state = "UTTAR PRADESH";
      district = "VARANASI";
      console.log("🌍 Defaulting to:", { state, district });
    }

    console.log("📍 Request for:", { state, district });

    const normalizedState = normalizeState(state);
    const normalizedDistrict = normalizeDistrict(district);

    // Check DB first
    let records = await DistrictData.find({
      state_name: normalizedState,
      ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
    });

    if (!records.length) {
      console.log("🌀 No cached data, fetching from API...");
      await fetchAndStoreMGNREGAData(normalizedState, normalizedDistrict);
      records = await DistrictData.find({
        state_name: normalizedState,
        ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
      });
    }

    res.status(200).json({
      count: records.length,
      records,
    });
  } catch (err) {
    console.error("❌ Error in /api/mgnrega:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
