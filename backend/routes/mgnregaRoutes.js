import express from "express";
import { fetchAndStoreMGNREGAData } from "../utils/fetchMGNREGA.js";
import DistrictData from "../models/DistrictData.js";
import { normalizeState, normalizeDistrict } from "../utils/normalize.js";

const router = express.Router();

/**
 * @route GET /api/mgnrega
 * @desc Fetch MGNREGA data for given state & district
 * @query state, district
 */
router.get("/", async (req, res) => {
  try {
    const { state, district } = req.query;
    console.log("📍 Received request for:", { state, district });

    // Normalize inputs
    const normalizedState = normalizeState(state);
    const normalizedDistrict = normalizeDistrict(district);
    console.log("🧩 Normalized to:", { normalizedState, normalizedDistrict });

    // Fetch + store new data
    await fetchAndStoreMGNREGAData(normalizedState, normalizedDistrict);

    // Find from DB
    const records = await DistrictData.find({
      state_name: normalizedState,
      ...(normalizedDistrict ? { district_name: normalizedDistrict } : {}),
    });

    // If no data and state is Delhi → show message
    if (!records.length && normalizedState === "NCT OF DELHI") {
      return res.status(200).json({
        count: 0,
        message:
          "No MGNREGA data available for Delhi districts — MGNREGA applies only to rural areas.",
        records: [],
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
