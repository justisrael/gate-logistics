import { Router } from "express";
import { validate } from "../middlewares/validate";
import { loginAdminSchema, registerAdminSchema } from "../schemas/adminSchema";
import AdminController from "../controllers/adminController";


const router = Router()



router.post("/create", validate({ body: registerAdminSchema }), AdminController.registerAdmin)
router.post("/login", validate({ body: loginAdminSchema }), AdminController.loginAdmin)
router.post("/generate/code", AdminController.generateAdminCode)
router.post("/verify/code", AdminController.verifyAdminCode)
router.get("/fetch-admin", AdminController.fetchAdmin)


/**
 * @swagger
 * components:
 *   schemas:
 *     AdminRegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the admin
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the admin
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: Password for the admin account
 *           example: Password123!
 *         role:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles assigned to the admin
 *           example: ["super_admin", "moderator"]
 *     AdminRegisterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Indicates if the registration was successful
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: Admin registered successfully
 *         data:
 *           type: object
 *           properties:
 *             adminId:
 *               type: string
 *               description: Unique identifier for the admin
 *               example: "admin_123"
 *             email:
 *               type: string
 *               description: Email address of the admin
 *               example: john.doe@example.com
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of the admin
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: Password for the admin account
 *           example: Password123!
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Indicates if the login was successful
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: Login successful
 *         data:
 *           type: object
 *           properties:
 *             access_token:
 *               type: string
 *               description: JWT token for authentication
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     Admin:
 *       type: object
 *       properties:
 *         adminId:
 *           type: string
 *           description: Unique identifier for the admin
 *           example: "admin_123"
 *         name:
 *           type: string
 *           description: Full name of the admin
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the admin
 *           example: john.doe@example.com
 *         role:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles assigned to the admin
 *           example: ["super_admin", "moderator"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the admin was created
 *           example: "2025-05-19T15:37:00Z"
 *     AdminListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: Admins retrieved successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Admin'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           description: HTTP status code
 *         message:
 *           type: string
 *           description: Error message
 *
 * /api/v1/admin/create:
 *   post:
 *     summary: Register a new admin
 *     description: Creates a new admin account with the specified details.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegisterRequest'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminRegisterResponse'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 400
 *                 message: Invalid input
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 409
 *                 message: Email already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 500
 *                 message: Internal server error
 *
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticates an admin and returns a JWT token.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 400
 *                 message: Invalid input
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 401
 *                 message: Invalid email or password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 500
 *                 message: Internal server error
 *
 * /api/v1/admin/fetch-admin:
 *   get:   
 *     summary: Fetch list of admins   
 *     description: Retrieves a list of all admin accounts.  
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 401
 *                 message: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 statusCode: 500
 *                 message: Internal server error
 */

export default router 