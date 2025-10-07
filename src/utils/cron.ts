import cron from "node-cron";
import https from "https";
import { env } from "../utils/envValidator";

// Create a scheduled job but don't start it yet
const job = cron.schedule(
  "*/10 * * * *", 
  () => {
    https
      .get(env.API_URL, (res) => {
        if (res.statusCode === 200) {
          console.log("Ping OK");
        } else {
          console.log("Ping failed", res.statusCode);
        }
      })
      .on("error", (e) => console.error("Error pinging:", e));
  }, 
  {
    scheduled: false, // Important: prevent auto-start
  }
);

export default job;
