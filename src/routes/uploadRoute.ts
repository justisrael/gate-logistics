import express from "express";
import multer from "multer";
import uploadController from "../controllers/uploadController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload a file to AWS S3
 *     description: Uploads a file to an S3 bucket and returns the file URL.
 *     tags:
 *       - Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: File upload failed
 */
router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
