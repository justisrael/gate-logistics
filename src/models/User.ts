import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  hasPasscode: boolean;
  password: string;
  passcode: string;
  role: "admin" | "user";
  plan: "free" | "paid";
  billingPeriod: Date;
  
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasPasscode: { type: Boolean, required: true, default: false },
    passcode: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    plan: { type: String, enum: ["free", "paid"], default: "free" },
    billingPeriod: {
      type: Date,
      required: true,
      default: () => new Date(), // today's date
    },
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model<IUser>("gate-user", UserSchema);
