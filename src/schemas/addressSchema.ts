import { z } from "zod";

// Address Schema
export const createAddressSchema = z.object({
  businessId: z.string().length(24, "Invalid business ID"), // MongoDB ObjectId validation
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  address1: z.string().min(5, "Address must be at least 5 characters"),
  address2: z.string().optional(),
  country: z.string().min(2, "Country must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z
    .string()
    .min(4, "Postal code must be at least 4 characters")
    .max(10, "Postal code cannot exceed 10 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"), // Supports international format
  type: z.enum(["pickup", "delivery"], {
    errorMap: () => ({ message: "Type must be either 'pickup' or 'delivery'" }),
  }),
});

// Schema for validating `addressId` parameter (for updates/deletes)
export const addressIdSchema = z.object({
  addressId: z.string().length(24, "Invalid address ID"),
});

// Schema for validating `addressId` parameter (for updates/deletes)
export const businessIdSchema = z.object({
  bussinesId: z.string().length(24, "Invalid address ID"),
});

// Schema for updating an address (partial fields allowed)
export const updateAddressSchema = createAddressSchema.partial();
