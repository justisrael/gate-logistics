import { SubscriptionService } from "../services/subcriptionService";

export class SubscriptionController {
  static async createSubscriptionPlan(req: any, res: any): Promise<void> {
    try {
      const subscriptionData = req.body;
      const subscription = await SubscriptionService.createSubscriptionPlan(subscriptionData);
      res.status(201).json({ message: 'Subscription plan created successfully', data: subscription });
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating subscription plan', error: error.message });
    }
  }

  static async getSubscriptions(req: any, res: any): Promise<void> {
    try {
      const subscriptions = await SubscriptionService.listPlans(); // List available plans
      res.status(200).json({ message: 'Plans fetched successfully', data: subscriptions });
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching plans', error: error.message });
    }
  }

  static async getUserSubscription(req: any, res: any): Promise<void> {
    try {
      const userId = req.user.id; // Assume user is authenticated
      const subscription = await SubscriptionService.getSubscriptionByUserId(userId);
      res.status(200).json({ message: 'User subscription fetched successfully', data: subscription });
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching user subscription', error: error.message });
    }
  }

 static  async upgradePlan(req: any, res: any): Promise<void> {
    try {
      const userId = req.user.id; // Assume user is authenticated
      const { nextPlan } = req.body;
      const user = await SubscriptionService.upgradePlan(userId, nextPlan);
      res.status(200).json({ message: 'Plan upgraded successfully', data: user });
    } catch (error: any) {
      res.status(500).json({ message: 'Error upgrading plan', error: error.message });
    }
  }

  static async downgradePlan(req: any, res: any): Promise<void> {
    try {
      const userId = req.user.id; // Assume user is authenticated
      const { nextPlan } = req.body;
      const user = await SubscriptionService.downgradePlan(userId, nextPlan);
      res.status(200).json({ message: 'Plan downgraded successfully', data: user });
    } catch (error: any) {
      res.status(500).json({ message: 'Error downgrading plan', error: error.message });
    }
  }
}