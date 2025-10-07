import express from "express";
import { ShippingController } from "../controllers/shippingController";
import { protect } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createAddressSchema } from "../schemas/addressSchema";
import { businessIdSchema } from "../schemas/businessSchema";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Shipping address management endpoints
 */

/**
 * @swagger
 * /api/v1/address:
 *   post:
 *     summary: Create a new address
 *     description: Create a pickup or destination address
 *     tags: [Address]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *                 format: uuid
 *                 description: Reference to the Business model
 *               firstName:
 *                 type: string
 *                 description: First name of the contact person
 *               lastName:
 *                 type: string
 *                 description: Last name of the contact person
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact person
 *               address1:
 *                 type: string
 *                 description: Primary address line
 *               address2:
 *                 type: string
 *                 description: Secondary address line (optional)
 *               country:
 *                 type: string
 *                 description: Country of the address
 *               state:
 *                 type: string
 *                 description: State of the address
 *               city:
 *                 type: string
 *                 description: City of the address
 *               postalCode:
 *                 type: string
 *                 description: Postal code of the address
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *               type:
 *                 type: string
 *                 enum: [pickup, delivery]
 *                 description: Type of address (pickup or delivery)
 *     responses:
 *       200:
 *         description: Address created successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validate({ body: createAddressSchema }),
  protect,
  ShippingController.createAddress
);
/**
 * @swagger
 * /api/v1/address/{businessId}:
 *   get:
 *     summary: Get all addresses for a specific business
 *     description: Retrieve all addresses associated with a specific business by its businessId.
 *     tags: [Address]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business whose addresses are being fetched.
 *     responses:
 *       200:
 *         description: Successfully retrieved business addresses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business addresses retrieved successfully"
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65a8f2e7c4e7c6d0b23a3e19"
 *                       businessId:
 *                         type: string
 *                         example: "609c1f77bcf86cd799439011"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       address1:
 *                         type: string
 *                         example: "123 Business St"
 *                       city:
 *                         type: string
 *                         example: "New York"
 *                       state:
 *                         type: string
 *                         example: "NY"
 *                       postalCode:
 *                         type: string
 *                         example: "10001"
 *                       country:
 *                         type: string
 *                         example: "USA"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+1234567890"
 *                       type:
 *                         type: string
 *                         enum: [pickup, delivery]
 *                         example: "pickup"
 *       400:
 *         description: Invalid businessId provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid businessId format"
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/:businessId",
  protect,
  validate({ params: businessIdSchema }),
  ShippingController.getBusinessAddresses
);

export default router;
