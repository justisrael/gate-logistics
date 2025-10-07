import { Verification } from "../models/Verification";
import { User } from "../models/User";
import { sendSMS } from "../utils/sms";
import sendOtp from "../utils/sendOtp";
import { generateOTP } from "../utils/otp";

class OtpService {
  /**
   * Send OTP for Email & Phone Verification
   */
  static async sendOtp(email?: string, phone?: string) {
    if (!email && !phone) {
      throw new Error("Provide at least one contact method (email or phone)");
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let verification = await Verification.findOne({ userId: user._id });
    if (!verification) {
      verification = new Verification({ userId: user._id });
    }

    if (email) {
      verification.emailOTP = otp;
      verification.emailOtpExpiresAt = otpExpiresAt;
    }
    if (phone) {
      verification.phoneOTP = otp;
      verification.phoneOtpExpiresAt = otpExpiresAt;
    }

    await verification.save();

    // // Send OTP via email or SMS
    // const promises = [];
    // if (email) promises.push(sendOtp(email, otp));
    // if (phone) promises.push(sendSMS(phone, otp));

    // await Promise.all(promises);

    return { message: "OTP updated successfully", otp };
  }

  /**
   * Verify OTP
   */
  static async verifyOtp(email?: string, phone?: string, otp?: string) {
    if (!email && !phone) {
      throw new Error("Provide at least one contact method (email or phone)");
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      throw new Error("User not found");
    }

    const verification = await Verification.findOne({ userId: user._id });
    if (!verification) {
      throw new Error("No OTP found");
    }

    const now = new Date();
    if (
      verification.emailOtpExpiresAt &&
      now > verification.emailOtpExpiresAt &&
      verification.phoneOtpExpiresAt &&
      now > verification.phoneOtpExpiresAt
    ) {
      throw new Error("OTP expired");
    }

    let isVerified = false;
    if (email && verification.emailOTP === otp) {
      verification.emailVerified = true;
      verification.emailOTP = undefined;
      isVerified = true;
    }
    if (phone && verification.phoneOTP === otp) {
      verification.phoneVerified = true;
      verification.phoneOTP = undefined;
      isVerified = true;
    }

    if (!isVerified) {
      throw new Error("Invalid OTP");
    }

    await verification.save();
    return { message: "Verification successful" };
  }
}

export default OtpService;
