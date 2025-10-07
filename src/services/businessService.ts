import { Business } from "../models/Business";

class BusinessService {
  // Register a new business
  static async registerBusiness(userId: string, businessData: any) {
    const { businessName } = businessData;

    // Check if business already exists
    const existingBusiness = await Business.findOne({ businessName });
    if (existingBusiness) {
      throw new Error("Business already exists");
    }

    const newBusiness = new Business({ userId, ...businessData });
    await newBusiness.save();
    return newBusiness;
  }

  // Update business details
  static async updateBusiness(businessId: string, updateData: any) {
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      throw new Error("Business not found");
    }

    return updatedBusiness;
  }

  // Get a business by ID
  static async getBusiness(businessId: string) {
    const business = await Business.findById(businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    return business;
  }

  // Get all businesses belonging to a user
  static async getUserBusinesses(userId: string) {
    return await Business.find({ userId });
  }
}

export default BusinessService;
