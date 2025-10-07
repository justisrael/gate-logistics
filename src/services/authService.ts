import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Business } from "../models/Business";
import { Verification } from "../models/Verification";
import { env } from "../utils/envValidator";
import OtpService from "./otpService";
import mongoose from "mongoose";
import { Wallet } from "../models/Wallet";

class AuthService {
  /**
   * Register a new user and create a business
   */

  static async register(userData: any) {
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      businessName,
      isBusinessRegistered,
      businessType
    } = userData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      const foundWallet = await Wallet.findOne({ email })

      if(foundWallet){
        throw new Error("User already exists");
      }

      const foundUser = await User.findOne({ email })                        
      if(foundUser){   
        await foundUser.deleteOne()       
      }

      const foundBusiness = await Business.findOne({ primaryEmail: email })
      if(foundBusiness){
        await foundBusiness.deleteOne()
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create(
        [
          {
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword,
          },
        ],
        { session }
      );

      // Create business linked to user
      await Business.create(
        [
          {
            userId: user[0]._id,
            businessName,
            isRegistered: isBusinessRegistered,
            primaryEmail: email,
            primary: true,
            country: "",
            businessLogo: "",
            businessCategory: "General",
            businessType,
          },
        ],
        { session }
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Send OTP after successful registration
      const { otp } = await OtpService.sendOtp(email);

      return { message: "Registration successful", otp };
    } catch (error: any) {
      // Rollback transaction if anything fails
      await session.abortTransaction();
      session.endSession();
      throw new Error(error.message || "Registration failed");
    }
  }

  /**
   * Login user and generate JWT token
   */
  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const [wallets, businesses] = await Promise.all([
      Wallet.find({ email }),
      Business.find({ primaryEmail: email }),
    ]);

    const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const { password: _, passcode, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword, businesses, wallets };
  }

  /**
   * Reset password using the token
   */
  static async resetPassword(email: string, password: string) {
    if (!password) throw new Error("Password is required");

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) throw new Error("User not found");

    // Hash and update password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return { message: "Password reset successful" };
  }
  /**
   * Service: Get all users
   */
  static async getAllUsers() {
    // Replace with actual user model import and query
    // const User = require('../models/User');
    return await User.find().select("-password -passcode");
  }
}

export default AuthService;
