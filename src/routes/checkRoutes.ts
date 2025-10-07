import { Router } from "express";
import { protect } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Checks
 *   description: Run application checks endpoints
 */

/**
 * @swagger
 * /api/v1/check/auth-status:
 *   get:
 *     summary: Validate the authentication token
 *     tags: [Checks]
 *     security:
 *       - BearerAuth: []
 *     description: Checks if the provided authentication token is valid.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token-here>
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: user123
 *       401:
 *         description: No token provided
 *       403:
 *         description: Invalid or expired token
 */

router.get("/auth-status", protect, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

/**
 * @swagger
 * /api/v1/check/health:
 *   get:
 *     summary: Check if the service is live
 *     tags: [Checks]
 *     description: This endpoint checks if the backend service is up and running.
 *     responses:
 *       200:
 *         description: Service is live
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Service is live
 */

router.get("/health", (req, res) => {
  res.status(200).send("Service is live");
});


export default router;
