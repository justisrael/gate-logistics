import { Router } from "express";
import { SubscriptionController } from "../controllers/subscriptionController";
import { adminProtect, protect } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { subscriptionSchema, upgradePlanSchema } from "../schemas/subscriptionSchema";

const router = Router();

/**
 * @swagger
 * api/v1/subscriptions/create:
 *   post:
 *     summary: Create a new subscription plan (Admin only)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [free, sme, growth]
 *                 example: sme
 *               price:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: Small business tier
 *               type:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 example: monthly
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription plan created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Error creating subscription plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating subscription plan
 *                 error:
 *                   type: string
 *                   example: Invalid plan name
 */

router.post("/create", adminProtect,   validate({ body: subscriptionSchema }), SubscriptionController.createSubscriptionPlan);

/**
 * @swagger
 * api/v1/subscriptions/plans:
 *   get:
 *     summary: Get all available subscription plans
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plans fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Error fetching plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching plans
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/plans", protect, SubscriptionController.getSubscriptions);

/**
 * @swagger
 * api/v1/subscriptions/upgrade:
 *   post:
 *     summary: Upgrade a user's subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nextPlan:
 *                 type: string
 *                 enum: [sme, growth]
 *                 example: growth
 *     responses:
 *       200:
 *         description: Plan upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan upgraded successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Error upgrading plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error upgrading plan
 *                 error:
 *                   type: string
 *                   example: Invalid plan
 */
router.post("/upgrade", protect, validate({body: upgradePlanSchema}), SubscriptionController.upgradePlan);

/**
 * @swagger
 * api/v1/subscriptions/downgrade:
 *   post:
 *     summary: Downgrade a user's subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nextPlan:
 *                 type: string
 *                 enum: [free, sme]
 *                 example: free
 *     responses:
 *       200:
 *         description: Plan downgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan downgraded successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Error downgrading plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error downgrading plan
 *                 error:
 *                   type: string
 *                   example: Invalid plan
 */
router.post("/downgrade", protect, validate({body: upgradePlanSchema}), SubscriptionController.downgradePlan);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: [free, sme, growth]
 *           example: sme
 *         price:
 *           type: number
 *           example: 30
 *         description:
 *           type: string
 *           example: Small business tier
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 *         type:
 *           type: string
 *           enum: [monthly, yearly]
 *           example: monthly
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *       required:
 *         - name
 *         - price
 *         - description
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: +1234567890
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         hasPasscode:
 *           type: boolean
 *           example: false
 *         password:
 *           type: string
 *           example: hashedpassword
 *         passcode:
 *           type: string
 *           example: 1234
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           example: user
 *         debt:
 *           type: number
 *           example: 0
 *         plan:
 *           type: string
 *           enum: [free, sme, growth]
 *           example: sme
 *         subscriptionId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         subscriptionStatus:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 *         subscriptionStartDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *         subscriptionEndDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-31T12:00:00Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T12:00:00Z
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *         - password
 */