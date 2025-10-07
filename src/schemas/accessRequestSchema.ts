import { z } from "zod";

export const requestPrivateAccess = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(5, "Phone number is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessCategory: z.string().min(1, "Business category is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  needs: z.string().min(1, "Needs field is required"),
});

export type RequestPrivateAccess = z.infer<typeof requestPrivateAccess>;