import { Request, Response, NextFunction } from "express";
import BusinessService from "../services/businessService";

class BusinessController {
  static async registerBusiness(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const newBusiness = await BusinessService.registerBusiness(
        userId,
        req.body
      );
      return res.status(201).json({
        message: "Business registered successfully",
        business: newBusiness,
      });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

  static async updateBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { businessId } = req.params;
      const updatedBusiness = await BusinessService.updateBusiness(
        businessId,
        req.body
      );
      return res.status(200).json({
        message: "Business updated successfully",
        business: updatedBusiness,
      });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

  static async getBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { businessId } = req.params;
      const business = await BusinessService.getBusiness(businessId);
      return res.status(200).json({ business });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }

  static async getUserBusinesses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const businesses = await BusinessService.getUserBusinesses(userId);
      return res.status(200).json({ businesses });
    } catch (error: any) {
      next(error); // Forward the error to the error handler
    }
  }
}

export default BusinessController;
