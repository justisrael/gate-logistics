import { z } from "zod";

export const passcodeSchema = z.object({
  passcode: z
    .string()
    .length(6, "Passcode must be exactly 6 digits")
    .regex(/^\d{6}$/, "Passcode must contain only numbers"),
});
