// backend/utils/fetchMGNREGA.js
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import DistrictData from "../models/DistrictData.js";
dotenv.config();

const RESOURCE_ID = "9f2cbbac-16c8-4c33-9b8a-6dca1f0324b5";

export const fetchAndStoreMGNREGAData = async (state = "Uttar Pradesh", year = "2024-2025") => {
  try {
    console.log(`📡 Fetching data for ${state} (${year})...`);

    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=1000&filters[state_name]=${encodeURIComponent(
      state
    )}&filters[fin_year]=${year}`;

    const { data } = await axios.get(url);

    if (data?.records?.length > 0) {
      for (const record of data.records) {
        await DistrictData.findOneAndUpdate(
          {
            state_name: record.state_name,
            district_name: record.district_name,
            fin_year: record.fin_year,
            month: record.month,
          },
          {
            $set: {
              no_of_households_worked: record.no_of_households_worked || 0,
              persondays_generated: record.persondays_generated || 0,
              wages_paid: record.wages_paid || 0,
              last_updated: new Date(),
            },
          },
          { upsert: true, new: true }
        );
      }
      console.log(`✅ ${data.records.length} records updated.`);
    } else {
      console.log("⚠️ No records found from API.");
    }
  } catch (error) {
    console.error("❌ Error fetching MGNREGA data:", error.message);
  }
};

// 👇 Simpler direct run check
if (process.argv[1].includes("fetchMGNREGA.js")) {
  (async () => {
    await connectDB();
    await fetchAndStoreMGNREGAData("Uttar Pradesh", "2024-2025");
    mongoose.connection.close();
  })();
}
