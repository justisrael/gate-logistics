import express from "express";
import PasscodeController from "../controllers/passcodeController";
import { protect } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { passcodeSchema } from "../schemas/passCodeSchema";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Passcode
 *   description: User passcode management
 */

/**
 * @swagger
 * /api/v1/passcode/set:
 *   post:
 *     summary: Set a 6-digit passcode
 *     description: Allows an authenticated user to set a 6-digit passcode for additional security.
 *     tags: [Passcode]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passcode
 *             properties:
 *               passcode:
 *                 type: string
 *                 example: "123456"
 *                 description: "A 6-digit numeric passcode"
 *     responses:
 *       200:
 *         description: Passcode set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passcode set successfully"
 *       400:
 *         description: Invalid request (e.g., missing or invalid passcode)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.post(
  "/set",
  protect,
  validate({ body: passcodeSchema }),
  PasscodeController.setPasscode
);

/**
 * @swagger
 * /api/v1/passcode/verify:
 *   post:
 *     summary: Verify a 6-digit passcode
 *     description: Allows an authenticated user to verify their passcode.
 *     tags: [Passcode]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passcode
 *             properties:
 *               passcode:
 *                 type: string
 *                 example: "123456"
 *                 description: "The 6-digit numeric passcode to verify"
 *     responses:
 *       200:
 *         description: Passcode verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passcode verified successfully"
 *       400:
 *         description: Invalid passcode or request
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.post(
  "/verify",
  protect,
  validate({ body: passcodeSchema }),
  PasscodeController.verifyPasscode
);

export default router;
