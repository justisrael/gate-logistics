import { number } from "joi";
import { Schema, model, Document, Types } from "mongoose";

// Embedded AddressInfo schema
const AddressInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    address_1: { type: String, required: true },
    address_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postcode: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone_no: { type: String, required: true },
  },
  { _id: false } // prevent creating _id for nested schema
);

// Shipment Document Interface
export interface ShipmentDocument extends Document {
  businessId: Types.ObjectId;
  sender: AddressInfo;
  receiver: AddressInfo;
  shipmentId: string;
  status: "pending" | "in_transit" | "delivered" | "canceled" | "submitted";
  trackingNumber: string;
  waybillUrl: string;
  txId: string;
  amount: number[];
  packages: Record<string, any>;
  cost: number;
}

interface AddressInfo {
  name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  email: string;
  phone_no: string;
}

// Shipment Schema
const ShipmentSchema = new Schema<ShipmentDocument>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    shipmentId: { type: String, required: true, unique: false },
    sender: {
      type: AddressInfoSchema,
      required: true,
    },
    receiver: {
      type: AddressInfoSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_transit", "delivered", "canceled", "submitted"],
      default: "pending",
    },
    trackingNumber: { type: String, required: true, unique: false },
    waybillUrl: { type: String, required: true, unique: false },
    packages: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    txId: {type: String, required: true},
    amount: {
      type: [Number],
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const Shipment = model<ShipmentDocument>("gate-shipment", ShipmentSchema);
