import { NextFunction, Request, Response } from "express";
import AccessRequestService from "../services/accessRequestService";

class AccessRequestController {
  static async createAccessRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const newRequest = await AccessRequestService.createAccessRequest(
        req.body
      );
      return res.status(201).json({
        message: "Access request submitted successfully",
        accessRequest: newRequest,
      });
    } catch (error: any) {
      next(error);
      // return res.status(400).json({ message: error.message });
    }
  }

  static async getAllAccessRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userRole = req.user?.role;
      if (userRole !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }

      const accessRequests = await AccessRequestService.getAllAccessRequests();
      return res.status(200).json({ accessRequests });
    } catch (error: any) {
      next(error);
      // return res.status(500).json({ message: "Server error", error });
    }
  }
}

export default AccessRequestController;
