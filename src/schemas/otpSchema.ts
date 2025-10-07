import { z } from "zod";

// Send OTP Schema
export const sendOTPSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Provide at least one contact method (email or phone)",
  });

// Verify OTP Schema
export const verifyOTPSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    bvn: z.string().length(11, "BVN must be 11 digits").optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Provide at least one contact method (email or phone)",
  });
