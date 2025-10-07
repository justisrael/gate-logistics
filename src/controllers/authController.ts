import { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService";

class AuthController {
  /**
   * Controller: Register user
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.register(req.body);
      res.status(201).json({ success: true, ...response });
    } catch (error: any) {
      console.log(error.message || error.response?.data || error.data || error.response?.data?.message)
      next(error); // Forward the error to the error handler
    }
  }

  /**
   * Controller: Login user
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const response = await AuthService.login(email, password);
      res.json({ success: true, ...response });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }


  /**
   * Controller: Reset password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const response = await AuthService.resetPassword(email, password);
      res.status(200).json({ success: true, ...response });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

    /**
     * Controller: Get all users
     */
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
      try {
        const users = await AuthService.getAllUsers();
        res.status(200).json({ success: true, users });
      } catch (error: any) {
        next(error);
      }
    }
}

export default AuthController;
