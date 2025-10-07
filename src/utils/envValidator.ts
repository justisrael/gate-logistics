import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("8000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  ADMIN_JWT_SECRET: z.string().min(1, "ADMIN_JWT_SECRET is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  // Twilio Credentials
  TWILIO_SID: z.string().min(1, "TWILIO_SID is required"),
  TWILIO_AUTH_TOKEN: z.string().min(1, "TWILIO_AUTH_TOKEN is required"),
  TWILIO_PHONE_NUMBER: z.string().min(1, "TWILIO_PHONE_NUMBER is required"),

  // Email (Nodemailer) Credentials
  EMAIL_USER: z.string().min(1, "EMAIL_USER is required"),
  EMAIL_PASS: z.string().min(1, "EMAIL_PASS is required"),

  // AWS Configuration
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),

  TERMINAL_SHIPPING_API_KEY: z
    .string()
    .min(1, "TERMINAL_SHIPPING_API_KEY is required"),
  TERMINAL_SHIPPING_API_URL: z
    .string()
    .min(1, "TERMINAL_SHIPPING_API_URL is required"),

  // Seerbit
  SEERBIT_API_URL: z.string().min(1, "SEERBIT_API_URL is required"),
  SEERBIT_PUBLIC_KEY: z.string().min(1, "SEERBIT_PUBLIC_KEY is required"),
  SEERBIT_SECRET_KEY: z.string().min(1, "SEERBIT_SECRET_KEY is required"),
  SEERBIT_MERCHANT_ID: z.string().min(1, "SEERBIT_MERCHANT_ID is required"),

  // Flutterwave
  FLUTTERWAVE_BASE_URL: z.string().min(1, "FLUTTERWAVE_BASE_URL is required"),
  FLUTTERWAVE_SECRET_KEY: z
    .string()
    .min(1, "FLUTTERWAVE_SECRET_KEY is required"),

  // Wallets ids
  BANKING_WALLET_ID: z.string().min(1, "BANKING_WALLET_ID is required"),
  SHIPPING_WALLET_ID: z.string().min(1, "BANKING_WALLET_ID is required"),
  FILLING_WALLET_ID: z.string().min(1, "BANKING_WALLET_ID is required"),
  PACKAGING_WALLET_ID: z.string().min(1, "BANKING_WALLET_ID is required"),

  //Bani
  BANI_BASE_URL: z.string().min(1, "BANI_BASE_URL is required"),
  BANI_TOKEN: z.string().min(1, "BANI_TOKEN is required"),
  BANI_MONI_SIGNATURE: z.string().min(1, "BANI_MONI_SIGNATURE is required"),
  BANI_SHARED_KEY: z.string().min(1, "BANI_MONI_SIGNATURE is required"),

  //QC
  QC_BASE_URL: z.string().min(1, "QC_BASE_URL is required"),
  QC_BOOKING_PATH: z.string().min(1, "QC_BOOKING_PATH is required"),
  QC_TOKEN: z.string().min(1, "QC_TOKEN is required"),
  QC_CLIENT_ID: z.string().min(1, "QC_CLIENT_ID is required"),

  //PARCEL FLOW
  PC_SHIP_BASE_URL: z.string().min(1, "PC_SHIP_BASE_URL is required"),
  PC_SHIP_ACCESS_TOKEN: z.string().min(1, "PC_SHIP_ACCESS_TOKEN is required"),

  //FIREBASE
  FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
  FIREBASE_BUCKET_NAME: z.string().min(1, "FIREBASE_BUCKET_NAME is required"),

  // render url
  API_URL: z.string().min(1, "API_URL is required"),

  //ZOHO
  ZOHO_KEY: z.string().min(1, "ZOHO_KEY is required"),
  ZOHO_URL: z.string().min(1, "ZOHO_URL is required"),

});
export const env = envSchema.parse(process.env);
