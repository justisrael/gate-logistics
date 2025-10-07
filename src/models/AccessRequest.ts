import mongoose, { Schema, Document } from "mongoose";

export interface IAccessRequest extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessCategory: string;
  country: string;
  city: string;
  needs: string;
  status: "pending" | "approved" | "rejected"; // Status field to track request progress
}

const AccessRequestSchema = new Schema<IAccessRequest>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessName: { type: String, required: true },
    businessCategory: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    needs: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // Default status
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const AccessRequest = mongoose.model<IAccessRequest>(
  "AccessRequest",
  AccessRequestSchema
);
