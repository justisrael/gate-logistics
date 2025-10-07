import { Request, Response, NextFunction } from "express";
import OtpService from "../services/otpService";
import { User } from "../models/User";
import { Business } from "../models/Business";
import { WalletService } from "../services/walletService";
import { env } from "../utils/envValidator";
import jwt from "jsonwebtoken";

class OtpController {
  /**
   * Send OTP
   */

  private static walletService = new WalletService();

  static async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone } = req.body;
      const response = await OtpService.sendOtp(email, phone);
      res.status(200).json(response);
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, otp, bvn } = req.body;
      const response = await OtpService.verifyOtp(email, phone, otp);
      let wallet = null;
      let user = null;
      let business = null;

      let token = null;
      if (bvn) {
        user = await User.findOne({ email });
        business = await Business.findOne({ primaryEmail: email });

        if (!user) throw new Error("No user found");

        token = jwt.sign(
          { id: user._id, role: user.role },
          env.JWT_SECRET!,
          {
            expiresIn: "1h",
          }
        );
        if (!user || !business) {
          return res
            .status(404)
            .json({ message: "User or Business not found" });
        }

        const { firstName, lastName, phone: phoneNumber } = user;
        const { _id: businessId } = business;

        wallet = await OtpController.walletService.createWallet(
          businessId,
          email,
          phoneNumber,
          firstName,
          lastName,
          bvn,
          firstName + " " + lastName,
          true
        );
      }
      if (wallet) {
        res
          .status(200)
          .json({ ...response, extra: { wallets: [wallet], user, businesses: [business], token } });
      } else {
        res.status(200).json(response);
      }
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }
}

export default OtpController;

