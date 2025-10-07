import { Request, Response, NextFunction } from "express";
import { WebhookService } from "../services/webhookService";
import { flattenObject } from "../utils/flatten";

export class WebhookController {
  private static webhookService = new WebhookService();

  /**
   * Handle Flutterwave Webhook
   */
  static async handleWebhook(req: any, res: Response, next: NextFunction) {
    console.log("webhook from bani", (req.headers['bani-shared-key']));
    try {
      // Verify Flutterwave signature
      if (!WebhookController.webhookService.verifySignature(req)) {
        return res.status(401).json({ error: "Unauthorized webhook request" });
      }

      // Process webhook event
      await WebhookController.webhookService.processWebhook(req.body);
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      res.sendStatus(500);

    }
  }
}
