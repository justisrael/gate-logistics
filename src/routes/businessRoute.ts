import { Router } from "express";
import {
  businessIdSchema,
  registerBusinessSchema,
  updateBusinessSchema,
} from "../schemas/businessSchema";
import BusinessController from "../controllers/businessController";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Business management endpoints
 */

/**
 * @swagger
 * /api/v1/business:
 *   post:
 *     summary: Register a new business
 *     description: Allows a user to register a business with a name, logo, category, and type.
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterBusiness"
 *     responses:
 *       201:
 *         description: Business registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validate({ body: registerBusinessSchema }),
  protect,
  BusinessController.registerBusiness
);

/**
 * @swagger
 * /api/v1/business:
 *   get:
 *     summary: Get all businesses belonging to a user
 *     description: Retrieves all businesses associated with the authenticated user.
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Businesses retrieved successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get("/", protect, BusinessController.getUserBusinesses);

/**
 * @swagger
 * /api/v1/business/{businessId}:
 *   put:
 *     summary: Update a business
 *     description: Allows a user to update business details like name, logo, category, or type.
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b1f4e391234ec346b065fb
 *         description: The ID of the business to update (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateBusiness"
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Business not found
 */
router.put(
  "/:businessId",
  validate({ params: businessIdSchema, body: updateBusinessSchema }),
  protect,
  BusinessController.updateBusiness
);

/**
 * @swagger
 * /api/v1/business/{businessId}:
 *   get:
 *     summary: Get business details
 *     description: Retrieves details of a specific business by its ID.
 *     tags: [Business]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         example: 67b1f4e391234ec346b065fb
 *         description: The ID of the business (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Business retrieved successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Business not found
 */
router.get(
  "/:businessId",
  validate({ params: businessIdSchema }),
  protect,
  BusinessController.getBusiness
);

export default router;
