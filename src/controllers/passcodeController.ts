import { Request, Response, NextFunction } from "express";
import PasscodeService from "../services/passcodeService";

class PasscodeController {
  /**
   * Set Passcode
   */
  static async setPasscode(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // Assuming `req.user` contains authenticated user data
      const { passcode } = req.body;

      if (!userId) throw new Error("Unauthorized");

      const response = await PasscodeService.setPasscode(userId, passcode);
      res.status(200).json({ success: true, ...response });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

  /**
   * Verify Passcode
   */
  static async verifyPasscode(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      const userId = req.user?.id;
      const { passcode } = req.body;

      if (!userId) throw new Error("Unauthorized");

      const response = await PasscodeService.verifyPasscode(userId, passcode);
      res.status(200).json({ success: true, ...response });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }
}

export default PasscodeController;
