// src/routes/shippingRoutes.ts
import express from "express";
import { ShippingController } from "../controllers/shippingController";
import {
  createShipmentSchema,
  getShipmentByIdSchema,
} from "../schemas/shipmentSchema";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth"; 

const router = express.Router();

router.post('/shipping-data', protect, ShippingController.createShipmentData); 
/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping management endpoints
 */

router.post("/shipping-data-v2", 
  protect, 
  ShippingController.processQCShipment
);


/**
 * @swagger
 * /api/v1/shipping/parcels:
 *   post:
 *     summary: Create a new parcel
 *     description: Create a parcel for all your items
 *     tags: [Shipping]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parcel'
 *     responses:
 *       200:
 *         description: Parcel created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/parcels", ShippingController.createParcel);

/**
 * @swagger
 * /api/v1/shipping/shipping-rates:
 *   post:
 *     summary: Get shipping rates
 *     description: Get shipping rate
 *     tags: [Shipping]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingRateRequest'
 *     responses:
 *       200:
 *         description: Shipping rates fetched successfully
 *       500:
 *         description: Internal server error
 */
router.post("/shipping-rates", ShippingController.getShippingRates);

export default router;
