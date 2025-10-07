import { z } from "zod";

// Schema for registering a business
export const registerBusinessSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  businessLogo: z.string().url("Logo must be a valid URL"),
  isRegistered: z.boolean(),
  businessCategory: z.string().min(2, "Category must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  businessType: z.string().min(2, "Type must be at least 2 characters"),
  primaryEmail: z.string().email().min(1, "You must provide valid email"),
});

// Schema for updating a business (partial fields allowed)
export const updateBusinessSchema = registerBusinessSchema.partial();

// Schema for validating `businessId` parameter
export const businessIdSchema = z.object({
  businessId: z.string().length(24, "Invalid business ID"), // MongoDB ObjectId validation
});
