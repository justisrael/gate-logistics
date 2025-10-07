import express from "express";
import OtpController from "../controllers/otpController";
import { sendOTPSchema, verifyOTPSchema } from "../schemas/otpSchema";
import { validate } from "../middlewares/validate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: OTP verification endpoints
 */

/**
 * @swagger
 * /api/v1/otp/send-otp:
 *   post:
 *     summary: Send OTP for phone and email verification
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/send-otp",
  validate({ body: sendOTPSchema }),
  OtpController.sendOTP
);

/**
 * @swagger
 * /api/v1/otp/verify-otp:
 *   post:
 *     summary: Verify OTP for authentication
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               bvn:
 *                 type: string
 *                 example: "12345678901"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or expired OTP
 *       500:
 *         description: Internal server error
 */
router.post(
  "/verify-otp",
  validate({ body: verifyOTPSchema }),
  OtpController.verifyOTP
);

export default router;
