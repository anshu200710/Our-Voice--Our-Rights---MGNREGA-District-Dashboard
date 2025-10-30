// backend/cron/scheduler.js
import cron from "node-cron";
import { fetchAndStoreMGNREGAData } from "../utils/fetchMGNREGA.js";

// Run every 24 hours (at 2 AM)
cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Running scheduled MGNREGA data update...");
  await fetchAndStoreMGNREGAData("Uttar Pradesh", "2024-2025");
});
