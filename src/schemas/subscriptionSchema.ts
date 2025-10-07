import { z } from "zod";


export const subscriptionSchema = z.object({
    name: z.enum(["free", "sme", "growth"], {
        errorMap: () => ({ message: "Invalid plan name" }),
    }),
    price: z.number().positive("Price must be a positive number").min(1, "Price is required"),
    description: z.string().min(3, "Description must be at least 3 characters long")
  });

  export const upgradePlanSchema = z.object({
    nextPlan: z.enum(["free", "sme", "growth"], { 
        errorMap: () => ({ message: "Invalid plan name" }),
    }),
  });

