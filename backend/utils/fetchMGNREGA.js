import axios from "axios";
import DistrictData from "../models/DistrictData.js";
import { normalizeState, normalizeDistrict } from "./normalize.js";

const API_URL = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY = process.env.DATA_GOV_API_KEY || "579b464db66ec23bdd000001228af32c5e13417751c484e9fbd6a924";
const defaultFinYear = process.env.MGNREGA_FIN_YEAR || "2024-2025";

async function getRecords(params) {
  const res = await axios.get(API_URL, { params, timeout: 15000 });
  return { status: res.status, data: res.data };
}

export const fetchAndStoreMGNREGAData = async (
  state = "UTTAR PRADESH",
  district = "",
  finYear = defaultFinYear
) => {
  try {
    if (!API_KEY) throw new Error("Missing DATA_GOV_API_KEY environment variable");

    let normalizedState = normalizeState(state);
    let normalizedDistrict = normalizeDistrict(district);

    // 🚨 Fallback for Delhi (no MGNREGA data available)
    if (normalizedState === "NCT OF DELHI") {
      console.log("⚠️ Delhi detected — using fallback: HARYANA / SONIPAT");
      normalizedState = "HARYANA";
      normalizedDistrict = "SONIPAT";
    }

    console.log(`🔄 Fetching MGNREGA data for state='${normalizedState}' district='${normalizedDistrict}' fin_year='${finYear}'`);

    const params = {
      "api-key": API_KEY,
      format: "json",
      limit: 500,
      "filters[fin_year]": finYear,
      "filters[state_name]": normalizedState,
    };
    if (normalizedDistrict) params["filters[district_name]"] = normalizedDistrict;

    const { data } = await getRecords(params);
    const records = data?.records || [];

    if (!records.length) {
      console.log(`⚠️ No records found for ${normalizedState} / ${normalizedDistrict}.`);
      return [];
    }

    for (const record of records) {
      await DistrictData.findOneAndUpdate(
        { district_code: record.district_code, fin_year: record.fin_year },
        record,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Stored ${records.length} records for ${normalizedState} / ${normalizedDistrict}`);
    return records;
  } catch (err) {
    console.error("❌ Error fetching MGNREGA data:", err.response?.data || err.message);
    return [];
  }
};
