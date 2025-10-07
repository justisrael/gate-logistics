import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(3, "First name is too short"),
  lastName: z.string().min(3, "Last name is too short"),
  businessName: z.string().min(3, "Business name is too short"),
  isBusinessRegistered: z.boolean().refine((val) => val !== undefined, {
    message: "Specify if business is registered",
  }),
  businessType: z.enum(["Merchants", "Agents", "Corporates"]),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+\d{1,4}[1-9]\d{8,14}$/, {
    message: "Invalid phone number format. Example: +2348134899881",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});
