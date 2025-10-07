import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  businessId: mongoose.Types.ObjectId;
  txRef: string;
  balance: number;
  currency: string;
  narration: string;
  flwRef: string;
  orderRef: string;
  accountNumber: number;
  accountStatus: string;
  bankName: string;
  primary: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const WalletSchema = new Schema<IWallet>({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  balance: { type: Number, default: 0 },
  currency: { type: String, required: true },
  narration: { type: String, required: true },
  txRef: { type: String, required: true },
  flwRef: { type: String, required: true },
  orderRef: { type: String, required: true },
  accountNumber: { type: Number, required: true },
  accountStatus: { type: String, required: true },
  bankName: { type: String, required: true },
  primary: { type: Boolean, required: true, default: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

export const Wallet = mongoose.model<IWallet>("Gate-Wallet", WalletSchema);
