// backend/models/DistrictData.js
import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    state_name: String,
    district_name: String,
    fin_year: String,
    month: String,
    no_of_households_worked: Number,
    persondays_generated: Number,
    wages_paid: Number,
    last_updated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("DistrictData", districtSchema);
