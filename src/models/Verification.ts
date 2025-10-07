import mongoose, { Schema, Document } from "mongoose";

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId;
  emailOTP?: string;
  phoneOTP?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneOtpExpiresAt?: Date;
  emailOtpExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const VerificationSchema = new Schema<IVerification>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emailOTP: { type: String },
  phoneOTP: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  phoneOtpExpiresAt: { type: Date, default: null },
  emailOtpExpiresAt: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

export const Verification = mongoose.model<IVerification>(
  "Verification",
  VerificationSchema
);
