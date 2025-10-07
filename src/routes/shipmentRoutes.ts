// src/routes/shippingRoutes.ts
import express from "express";
import { ShippingController } from "../controllers/shippingController";
import {
  createShipmentSchema,
  getShipmentBybusinessIdSchema,
  getShipmentByIdSchema,
  ShipmentRequestSchema
} from "../schemas/shipmentSchema";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth";

const router = express.Router();
 
/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment management endpoints
 */

router.patch(
  "/:id",
  // protect,
  ShippingController.updateShipmentStatus
);
/**
 * @swagger
 * /api/v1/shipment:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - sender
 *               - receiver
 *               - shipmentId
 *               - trackingNumber
 *               - waybillUrl
 *               - packages
 *             properties:
 *               businessId:
 *                 type: string
 *                 example: "6600317e4bc181fdbe12c6c4"
 *               sender:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   address_1:
 *                     type: string
 *                     example: "123 Main St"
 *                   address_2:
 *                     type: string
 *                     example: "Apt 4B"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   postcode:
 *                     type: string
 *                     example: "10001"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone_no:
 *                     type: string
 *                     example: "+1-555-123-4567"
 *               receiver:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Jane Smith"
 *                   address_1:
 *                     type: string
 *                     example: "456 Elm St"
 *                   address_2:
 *                     type: string
 *                     example: "Suite 12"
 *                   city:
 *                     type: string
 *                     example: "San Francisco"
 *                   state:
 *                     type: string
 *                     example: "CA"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   postcode:
 *                     type: string
 *                     example: "94101"
 *                   email:
 *                     type: string
 *                     example: "jane@example.com"
 *                   phone_no:
 *                     type: string
 *                     example: "+1-555-987-6543"
 *               shipmentId:
 *                 type: string
 *                 example: "SHIP-202503201"
 *               trackingNumber:
 *                 type: string
 *                 example: "TRK202503201"
 *               waybillUrl:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/waybill.pdf"
 *               packages:
 *                 type: object
 *                 example:
 *                   weight: "5kg"
 *                   dimensions: "10x10x10"
 *                   fragile: true
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Bad request or validation error
 */
router.post(
  "/",
  protect,
  validate({ body: createShipmentSchema }),
  ShippingController.createShipment
);

/**
 * @swagger
 * /api/v1/shipment/version1:
 *   post:
 *     summary: Create a new shipment (Version 1)
 *     tags: [Shipment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receiver
 *               - booking
 *               - package
 *             properties:
 *               sender:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address_1
 *                   - city
 *                   - state
 *                   - country
 *                   - postcode
 *                   - email
 *                   - phone_no
 *                 properties:
 *                   name: { type: string, example: "John Doe" }
 *                   address_1: { type: string, example: "123 Main St" }
 *                   address_2: { type: string, example: "Apt 4B" }
 *                   city: { type: string, example: "New York" }
 *                   state: { type: string, example: "NY" }
 *                   country: { type: string, example: "USA" }
 *                   postcode: { type: string, example: "10001" }
 *                   email: { type: string, format: email, example: "john@example.com" }
 *                   phone_no: { type: string, example: "+1-555-123-4567" }
 *               receiver:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address_1
 *                   - city
 *                   - state
 *                   - country
 *                   - postcode
 *                   - email
 *                   - phone_no
 *                 properties:
 *                   name: { type: string, example: "Jane Smith" }
 *                   address_1: { type: string, example: "456 Elm St" }
 *                   address_2: { type: string, example: "Suite 12" }
 *                   city: { type: string, example: "San Francisco" }
 *                   state: { type: string, example: "CA" }
 *                   country: { type: string, example: "USA" }
 *                   postcode: { type: string, example: "94101" }
 *                   email: { type: string, format: email, example: "jane@example.com" }
 *                   phone_no: { type: string, example: "+1-555-987-6543" }
 *               booking:
 *                 type: object
 *                 required:
 *                   - shipment_type
 *                   - shipping_date
 *                   - processing_station_id
 *                   - currency
 *                   - insurance
 *                   - pickup
 *                 properties:
 *                   shipment_type: { type: string, example: "express" }
 *                   shipping_date: { type: string, format: date, example: "2025-05-01" }
 *                   carrier_id: { type: string, example: "carrier123" }
 *                   processing_station_id: { type: string, example: "stationA" }
 *                   currency: { type: string, example: "USD" }
 *                   insurance:
 *                     type: object
 *                     properties:
 *                       request_insurance: { type: string, example: "yes" }
 *                       insurance_type: { type: string, example: "standard" }
 *                       insurance_fee: { type: number, example: 25.5 }
 *                   pickup:
 *                     type: object
 *                     properties:
 *                       request_pickup: { type: string, example: "yes" }
 *                       pickup_type_id: { type: string, example: "pickup123" }
 *                       pickup_fee: { type: number, example: 10 }
 *                   fees:
 *                     type: object
 *                     properties:
 *                       standard_fee: { type: string, example: "15.00" }
 *                       services_fee: { type: number, example: 5 }
 *                       extras_fee: { type: number, example: 2.5 }
 *                       shipping_fee: { type: string, example: "25.00" }
 *               package:
 *                 type: object
 *                 required:
 *                   - package_type
 *                   - package_image_url
 *                   - packages
 *                 properties:
 *                   package_type: { type: string, example: "box" }
 *                   package_image_url: { type: string, format: url, example: "https://example.com/image.jpg" }
 *                   packages:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - number_of_items
 *                         - package_value
 *                         - package_weight
 *                         - package_length
 *                         - package_width
 *                         - package_height
 *                         - description
 *                         - package_items
 *                       properties:
 *                         number_of_items: { type: number, example: 2 }
 *                         package_value: { type: number, example: 500 }
 *                         package_weight: { type: number, example: 10 }
 *                         package_length: { type: string, example: "40" }
 *                         package_width: { type: string, example: "30" }
 *                         package_height: { type: string, example: "20" }
 *                         description: { type: string, example: "Electronics" }
 *                         package_items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             required:
 *                               - category
 *                               - name
 *                               - description
 *                               - weight
 *                               - quantity
 *                               - value
 *                               - value_currency
 *                               - hs_code
 *                               - image_url
 *                             properties:
 *                               category: { type: string, example: "Gadgets" }
 *                               name: { type: string, example: "Phone" }
 *                               description: { type: string, example: "Smartphone" }
 *                               weight: { type: string, example: "0.5" }
 *                               quantity: { type: string, example: "2" }
 *                               value: { type: string, example: "250" }
 *                               value_currency: { type: string, example: "USD" }
 *                               hs_code: { type: string, example: "85171200" }
 *                               image_url: { type: string, format: url, example: "https://example.com/item.jpg" }
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Bad request or validation error
 */


router.post(
  "/partner1",
  protect,
  validate({ body: ShipmentRequestSchema }),
  ShippingController.createShipmentData
); 



/**
 * @swagger
 * /api/v1/shipment/{businessId}:
 *   get:
 *     summary: Get all shipments for a specific business
 *     tags: [Shipment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the business
 *     responses:
 *       200:
 *         description: List of shipments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shipment'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:businessId",
  protect,
  validate({ params: getShipmentBybusinessIdSchema }),
  ShippingController.getShipmentsByBusinessId
);

/**
 * @swagger
 * /api/v1/shipment:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipments
 */
router.get("/", ShippingController.getAllShipments);   
  
/**
 * @swagger
 * /api/v1/shipment/{shipmentId}:
 *   get:   
 *     summary: Get a shipment by ID
 *     tags: [Shipment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shipment ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Shipment details
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:id",
  protect,
  validate({ params: getShipmentByIdSchema }),
  ShippingController.getShipmentById
);

export default router;
