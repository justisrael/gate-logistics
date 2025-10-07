import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import authRoutes from "./routes/authRoutes";
import otpRoutes from "./routes/otpRoutes";
import businessRoutes from "./routes/businessRoute";
import passcodeRoutes from "./routes/passcodeRoute";
import accessRequestRoutes from "./routes/accessRequestRoutes";
import shippingRoutes from "./routes/shippingroutes";
import shipmentRoutes from "./routes/shipmentRoutes";
import addressRoutes from "./routes/addressRoutes";
import uploadRoute from "./routes/uploadRoute";
import adminRoute from "./routes/adminRoutes"
import walletRoute from "./routes/walletRoute";
import webhookRoute from "./routes/webhookRoutes";
import checkRoutes from "./routes/checkRoutes";
import subscriptionRoute from "./routes/subscriptionRoute";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./config/swaggerConfig";
import { limiter } from "./helpers/utils";
import fillingRoute from "./routes/fillingRoute"
import job from "./utils/cron";

const app = express();
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);

job.start();   

app.get("/", (req, res) => {
  res.send("Welcome to coconuts API");
});           

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/passcode", passcodeRoutes);
app.use("/api/v1/access-requests", accessRequestRoutes);
app.use("/api/v1/shipping", shippingRoutes);
app.use("/api/v1/shipment", shipmentRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/wallets", walletRoute);
app.use("/api/v1/filling", fillingRoute)
app.use("/api/v1/subscriptions", subscriptionRoute)
app.use("/api/v1/webhook/bani", express.json({
    verify: (req: any, res, buf) => {  
      req.rawBody = buf;
    },
  }), webhookRoute);
app.use("/api/v1/check", checkRoutes);

// Setup Swagger API Docs
app.use(errorHandler);
setupSwagger(app);

connectDB();
// connectRedis();

export default app;
