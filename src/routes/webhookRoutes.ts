import { Router } from "express";
import { WebhookController } from "../controllers/webhookController";

const router = Router();

router.post("/", WebhookController.handleWebhook);
// router.post("/flutterwave", WebhookController.handleWebhook); Depreciated

export default router;
