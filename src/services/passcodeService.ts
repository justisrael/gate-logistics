import bcrypt from "bcryptjs";
import { User } from "../models/User";

class PasscodeService {
  /**
   * Set a 6-digit passcode for a user
   */
  static async setPasscode(userId: string, passcode: string) {
    if (!/^\d{6}$/.test(passcode)) {
      throw new Error("Passcode must be exactly 6 digits");
    }

    const hashedPasscode = await bcrypt.hash(passcode, 10);
    await User.findByIdAndUpdate(userId, {
      passcode: hashedPasscode,
      hasPasscode: true,
    });

    return { message: "Passcode set successfully" };
  }

  /**
   * Verify a user's passcode
   */
  static async verifyPasscode(userId: string, passcode: string) {
    const user = await User.findById(userId);
    if (!user || !user.passcode) {
      throw new Error("Passcode not set");
    }

    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      throw new Error("Invalid passcode");
    }

    return { message: "Passcode verified successfully" };
  }
}

export default PasscodeService;
