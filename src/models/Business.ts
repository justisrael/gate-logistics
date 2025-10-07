import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User model
  businessName: string;
  businessLogo: string;
  isRegistered: boolean;
  primary: boolean;
  businessCategory: string;
  country: string;
  businessType: "Merchants" | "Corporates" | "Agents"; // Enum for business size
  primaryEmail: string;
  // wallets: mongoose.Schema.Types.ObjectId[];
}

const BusinessSchema = new Schema<IBusiness>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "gate-user", required: true }, 
    businessName: { type: String, required: true, },
    businessLogo: { type: String, required: false },
    isRegistered: { type: Boolean, required: true },
    primary: { type: Boolean, required: true, default: false },
    businessCategory: { type: String, required: true },
    country: { type: String, required: false },
    businessType: {
      type: String,
      enum: ["Merchants", "Corporates", "Agents"],
      default: "Merchants",
      required: true,
    },
    primaryEmail: { type: String, required: false },
    // wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }],
  },
  {
    timestamps: true,
  }
);

export const Business = mongoose.model<IBusiness>("Gate-Business", BusinessSchema);
