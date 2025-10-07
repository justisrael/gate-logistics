import { Schema, model, Document, Types } from "mongoose";

export interface AddressDocument extends Document {
  //   userId: Types.ObjectId; // Reference to User model
  businessId: Types.ObjectId; // Reference to Business model
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  type: "pickup" | "delivery";
}

const AddressSchema = new Schema<AddressDocument>(
  {
    // userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User collection
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    }, // Reference to Business collection
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address1: { type: String, required: true },
    address2: { type: String, default: "" },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    type: { type: String, enum: ["pickup", "delivery"], required: true },
  },
  { timestamps: true }
);

export const AddressModel = model<AddressDocument>("Address", AddressSchema);
