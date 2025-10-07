import express from "express";
import AccessRequestController from "../controllers/accessRequestController";
import { protect, authorize } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AccessRequest
 *   description: API for managing access requests
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AccessRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - businessName
 *         - businessCategory
 *         - country
 *         - city
 *         - needs
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         businessName:
 *           type: string
 *         businessCategory:
 *           type: string
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         needs:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/access-requests:
 *   post:
 *     summary: Submit a new access request
 *     tags: [AccessRequest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessRequest'
 *     responses:
 *       201:
 *         description: Access request created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", AccessRequestController.createAccessRequest);

/**
 * @swagger
 * /api/v1/access-requests:
 *   get:
 *     summary: Get all access requests (Admin only)
 *     tags: [AccessRequest]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of access requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  protect,
  authorize("admin"),
  AccessRequestController.getAllAccessRequests
);

export default router;
