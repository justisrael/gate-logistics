import { createClient } from "redis";
import { env } from "../utils/envValidator";

const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on("error", (err) => console.error("Redis Error:", err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis Connected");
};

export { redisClient, connectRedis };
