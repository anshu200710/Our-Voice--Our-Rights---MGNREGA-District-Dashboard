// backend/routes/mgnregaRoutes.js
import express from "express";
import DistrictData from "../models/DistrictData.js";

const router = express.Router();

// Get list of districts for dropdown
router.get("/districts", async (req, res) => {
  try {
    const districts = await DistrictData.distinct("district_name", { state_name: "Uttar Pradesh" });
    res.json(districts.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get data for one district
router.get("/:district", async (req, res) => {
  try {
    const data = await DistrictData.find({ district_name: req.params.district })
      .sort({ fin_year: 1, month: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
