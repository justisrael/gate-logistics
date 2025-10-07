import SubscriptionModel from "../models/Subscription";
import mongoose from "mongoose";
import { User } from "../models/User";

export class SubscriptionService {
  constructor() {
    // Initialize any dependencies or configurations here
  }

  /**
   * Create a new subscription plan (admin-only)
   * @param data - Subscription plan data
   * @returns Promise resolving to the created plan
   */
  static async createSubscriptionPlan(data: any): Promise<any> {
    const { name, price, description, type } = data;
    const validPlans = ["free", "sme", "growth"];
    if (!validPlans.includes(name.toLowerCase())) {
      throw new Error("Invalid plan name");
    }
    return await SubscriptionModel.create({ name, price, description, type });
  }

  /**
   * Upgrade a user's plan
   * @param userId - ID of the user
   * @param nextPlan - Name of the new plan (e.g., "sme", "growth")
   * @returns Promise resolving to the updated user
   */
  static async upgradePlan(userId: string, nextPlan: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
      }

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      const lowerNextPlan = nextPlan.toLowerCase();

      const subscription = await SubscriptionModel.findOne({ name: lowerNextPlan }).session(session);
      if (!subscription) {
        throw new Error("Plan not found");
      }

      const startDate = new Date(); 
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            plan: lowerNextPlan,
            subscriptionId: subscription._id,
            subscriptionStatus: "active",
            subscriptionStartDate: startDate,
            subscriptionEndDate: endDate,
          },
        },
        { session }
      );

      await session.commitTransaction();
      return await User.findById(userId).session(session);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Downgrade a user's plan
   * @param userId - ID of the user
   * @param nextPlan - Name of the new plan (e.g., "free", "sme")
   * @returns Promise resolving to the updated user
   */
  static async downgradePlan(userId: string, nextPlan: string): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
      }

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      const validPlans = ["free", "sme", "growth"];
      if (!validPlans.includes(nextPlan.toLowerCase())) {
        throw new Error("Invalid plan");
      }

      const subscription = await SubscriptionModel.findOne({ name: nextPlan.toLowerCase() }).session(session);
      if (!subscription) {
        throw new Error("Plan not found");
      }

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            plan: nextPlan.toLowerCase(),
            subscriptionId: subscription._id,
          },
        },
        { session }
      );

      await session.commitTransaction();
      // return await User.findById(userId).session(session);
      return {message: "Plan downgraded successfully"}  
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get subscription details by user ID
   * @param userId - ID of the user
   * @returns Promise resolving to the user's subscription details
   */
  static async getSubscriptionByUserId(userId: string): Promise<any> {
    return await User.findById(userId).populate("subscriptionId");
  }

  /**
   * List all available plans
   * @returns Promise resolving to the list of plans
   */
  static async listPlans(): Promise<any[]> {
    return await SubscriptionModel.find({ status: "active" });
  }
}