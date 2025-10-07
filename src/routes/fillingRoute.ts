import { Router } from "express";
import FillingRecordController from "../controllers/fillingRecords";
import { RegistrationFormSchema, UpdateRegistrationDtoSchema } from "../schemas/fillingRequestSchema";
import { validate } from "../middlewares/validate";
import { protect } from "../middlewares/auth";

const router = Router()

router.post(
  "/create",
  validate({ body: RegistrationFormSchema }),
  protect,
  FillingRecordController.create   
);

/**
 * @swagger
 *  /api/v1/filling/create:
 *     post:
 *       summary: Create a new filling registration
 *       description: Register a new business with its details, director, and witness
 *       tags: [Registrations]
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - businessId
 *                 - details
 *                 - txId
 *                 - status
 *                 - document
 *               properties:
 *                 businessId:
 *                   type: string
 *                   description: The unique identifier for the business
 *                 details:
 *                   type: object
 *                   required:
 *                     - businessNames
 *                     - director
 *                     - witness
 *                   properties:
 *                     businessNames:
 *                       type: object
 *                       required:
 *                         - type
 *                         - name1
 *                         - phone
 *                         - email
 *                         - businessNature
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: The type of business entity
 *                         name1:
 *                           type: string
 *                           description: The primary business name
 *                         name2:
 *                           type: string
 *                           description: The secondary business name (optional)
 *                         name3:
 *                           type: string
 *                           description: The tertiary business name (optional)
 *                         phone:
 *                           type: string
 *                           description: The business phone number
 *                         email:
 *                           type: string
 *                           description: The business email
 *                         businessNature:
 *                           type: string
 *                           description: The nature of the business
 *                     director:
 *                       type: object
 *                       required:
 *                         - firstName
 *                         - lastName
 *                         - dateOfBirth
 *                         - gender
 *                         - nationality
 *                         - phone
 *                         - email
 *                         - occupation
 *                         - address
 *                         - nin
 *                         - identification
 *                         - passport
 *                         - signature
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           description: The director's first name
 *                         lastName:
 *                           type: string
 *                           description: The director's last name
 *                         otherName:
 *                           type: string
 *                           description: The director's other name (optional)
 *                         dateOfBirth:
 *                           type: string
 *                           format: date-time
 *                           description: The director's date of birth
 *                         gender:
 *                           type: string
 *                           enum: ["male", "female", "other"]
 *                           description: The director's gender
 *                         nationality:
 *                           type: string
 *                           description: The director's nationality
 *                         phone:
 *                           type: string
 *                           description: The director's phone number
 *                         email:
 *                           type: string
 *                           description: The director's email
 *                         occupation:
 *                           type: string
 *                           description: The director's occupation
 *                         address:
 *                           type: string
 *                           description: The director's address
 *                         nin:
 *                           type: string
 *                           description: The director's National Identification Number
 *                         identification:
 *                           type: string
 *                           description: The director's identification document
 *                         passport:
 *                           type: string
 *                           description: The director's passport number or file
 *                         signature:
 *                           type: string
 *                           description: The director's signature file
 *                     witness:
 *                       type: object
 *                       required:
 *                         - firstName
 *                         - lastName
 *                         - dateOfBirth
 *                         - gender
 *                         - nationality
 *                         - phone
 *                         - email
 *                         - occupation
 *                         - address
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           description: The witness's first name
 *                         lastName:
 *                           type: string
 *                           description: The witness's last name
 *                         otherName:
 *                           type: string
 *                           description: The witness's other name (optional)
 *                         dateOfBirth:
 *                           type: string
 *                           format: date-time
 *                           description: The witness's date of birth
 *                         gender:
 *                           type: string
 *                           enum: ["male", "female", "other"]
 *                           description: The witness's gender
 *                         nationality:
 *                           type: string
 *                           description: The witness's nationality
 *                         phone:
 *                           type: string
 *                           description: The witness's phone number
 *                         email:
 *                           type: string
 *                           description: The witness's email
 *                         occupation:
 *                           type: string
 *                           description: The witness's occupation
 *                         address:
 *                           type: string
 *                           description: The witness's address
 *                         witnessSignature:
 *                           type: string
 *                           description: The witness's signature file (optional)
 *                 txId:
 *                   type: string
 *                   description: The transaction ID
 *                 status:
 *                   type: string
 *                   enum: ["pending", "approved", "rejected"]
 *                   description: The registration status
 *                 document:
 *                   type: string
 *                   description: The registration document file
 *               example:
 *                 businessId: "12345"
 *                 details:
 *                   businessNames:
 *                     type: "LLC"
 *                     name1: "Acme Corp"
 *                     name2: "Acme LLC"
 *                     phone: "+2348012345678"
 *                     email: "contact@acme.com"
 *                     businessNature: "Technology"
 *                   director:
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     dateOfBirth: "1990-01-01T00:00:00Z"
 *                     gender: "male"
 *                     nationality: "Nigerian"
 *                     phone: "+2348012345678"
 *                     email: "john.doe@example.com"
 *                     occupation: "Engineer"
 *                     address: "123 Main St, Lagos"
 *                     nin: "123456789"
 *                     identification: "ID123"
 *                     passport: "passport.jpg"
 *                     signature: "signature.jpg"
 *                   witness:
 *                     firstName: "Jane"
 *                     lastName: "Smith"
 *                     dateOfBirth: "1992-02-02T00:00:00Z"
 *                     gender: "female"
 *                     nationality: "Nigerian"
 *                     phone: "+2349012345678"
 *                     email: "jane.smith@example.com"
 *                     occupation: "Lawyer"
 *                     address: "456 High St, Lagos"
 *                 txId: "tx123"
 *                 status: "pending"
 *                 document: "document.pdf"
 *       responses:
 *         '201':
 *           description: Registration created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                   data:
 *                     $ref: '#/paths/~1api~1v1~1registrations~1post~1requestBody~1content~1application~1json~1schema'
 *                 example:
 *                   success: true
 *                   message: "Registration created successfully"
 *                   data:
 *                     businessId: "12345"
 *                     details:
 *                       businessNames:
 *                         type: "LLC"
 *                         name1: "Acme Corp"
 *                         name2: "Acme LLC"
 *                         phone: "+2348012345678"
 *                         email: "contact@acme.com"
 *                         businessNature: "Technology"
 *                       director:
 *                         firstName: "John"
 *                         lastName: "Doe"
 *                         dateOfBirth: "1990-01-01T00:00:00Z"
 *                         gender: "male"
 *                         nationality: "Nigerian"
 *                         phone: "+2348012345678"
 *                         email: "john.doe@example.com"
 *                         occupation: "Engineer"
 *                         address: "123 Main St, Lagos"
 *                         nin: "123456789"
 *                         identification: "ID123"
 *                         passport: "passport.jpg"
 *                         signature: "signature.jpg"
 *                       witness:
 *                         firstName: "Jane"
 *                         lastName: "Smith"
 *                         dateOfBirth: "1992-02-02T00:00:00Z"
 *                         gender: "female"
 *                         nationality: "Nigerian"
 *                         phone: "+2349012345678"
 *                         email: "jane.smith@example.com"
 *                         occupation: "Lawyer"
 *                         address: "456 High St, Lagos"
 *                     txId: "tx123"
 *                     status: "pending"
 *                     document: "document.pdf"
 *                     createdAt: "2025-05-27T14:22:00Z"
 *                     updatedAt: "2025-05-27T14:22:00Z"
 *         '400':
 *           description: Bad request (validation error)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                 example:
 *                   success: false
 *                   message: "Validation error: Type is required, Email is required"
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                 example:
 *                   success: false
 *                   message: "Unauthorized"
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *                 example:
 *                   success: false
 *                   message: "Internal server error"
 * 
 * 
 * 
 * */

     router.get("/:businessId", protect, FillingRecordController.fetchByBusinessId)

    /**
     * @swagger
     * /api/v1/filling/{businessId}:
     *   get:
     *     summary: Fetch registration forms by business ID
     *     tags: [Registrations]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: businessId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the business
     *     responses:
     *       200:
     *         description: Registration forms fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Registration forms fetched successfully
     *                 forms:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/RegistrationForm'
     *       404:
     *         description: No registration forms found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *       500:
     *         description: Server error
     */
  
    router.get("/", protect, FillingRecordController.fetchAll)
      /**
   * @swagger
   * /api/v1/filling:                               
   *   get:
   *     summary: Fetch all filling registration forms
   *     tags: [Registrations]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:  
   *         description: Registration forms fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Registration forms fetched successfully
   *                 forms:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/RegistrationForm'
   *       404:
   *         description: No registration forms found
   *       500:
   *         description: Server error
   */

     router.patch("/:id", protect, validate({body: UpdateRegistrationDtoSchema}), FillingRecordController.UpdateRecord)
        /**
   * @swagger
   * /api/v1/filling/{id}:
   *   patch:
   *     summary: Update a filling registration form by ID
   *     tags: [Registrations]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the registration form
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRegistrationDto'
   *     responses:
   *       200:
   *         description: Registration form updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Registration form updated successfully
   *                 form:
   *                   $ref: '#/components/schemas/RegistrationForm'
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Registration form not found
   *       500:
   *         description: Server error
   */

        /**
        * @swagger
        * components:
        *   schemas:
        *     BusinessNames:
        *       type: object
        *       required:
        *         - type
        *         - name1
        *         - phone
        *         - Klas
        *         - businessNature
        *       properties:
        *         type:
        *           type: string
        *         name1:
        *           type: string
        *         name2:
        *           type: string
        *         name3:
        *           type: string
        *         phone:
        *           type: string
        *         email:
        *           type: string
        *         businessNature:
        *           type: string
        *     Director:
        *       type: object
        *       required:
        *         - firstName
        *         - lastName
        *         - dateOfBirth
        *         - gender
        *         - nationality
        *         - phone
        *         - email
        *         - occupation
        *         - address
        *         - nin
        *         - identification
        *         - passport
        *         - signature
        *       properties:
        *         firstName:
        *           type: string
        *         lastName:
        *           type: string
        *         otherName:
        *           type: string
        *         dateOfBirth:
        *           type: string
        *           format: date-time
        *         gender:
        *           type: string
        *           enum: ["male", "female", "other"]
        *         nationality:
        *           type: string
        *         phone:
        *           type: string
        *         email:
        *           type: string
        *         occupation:
        *           type: string
        *         address:
        *           type: string
        *         nin:
        *           type: string
        *         identification:
        *           type: string
        *         passport:
        *           type: string
        *         signature:
        *           type: string
        *     Witness:
        *       type: object
        *       required:
        *         - firstName
        *         - lastName
        *         - dateOfBirth
        *         - gender
        *         - nationality
        *         - phone
        *         - email
        *         - occupation
        *         - address
        *       properties:
        *         firstName:
        *           type: string
        *         lastName:
        *           type: string
        *         otherName:
        *           type: string
        *         dateOfBirth:
        *           type: string
        *           format: date-time
        *         gender:
        *           type: string
        *           enum: ["male", "female", "other"]
        *         nationality:
        *           type: string
        *         phone:
        *           type: string
        *         email:
        *           type: string
        *         occupation:
        *           type: string
        *         address:
        *           type: string
        *         witnessSignature:
        *           type: string
        *     RegistrationForm:
        *       type: object
        *       required:
        *         - businessId
        *         - details
        *         - txId
        *         - status
        *         - document
        *       properties:
        *         businessId:
        *           type: string
        *         details:
        *           type: object
        *           properties:
        *             businessNames:
        *               $ref: '#/components/schemas/BusinessNames'
        *             director:
        *               $ref: '#/components/schemas/Director'
        *             witness:
        *               $ref: '#/components/schemas/Witness'
        *         txId:
        *           type: string
        *         status:
        *           type: string
        *           enum: ["pending", "approved", "rejected"]
        *         document:
        *           type: string
        *         createdAt:
        *           type: string
        *           format: date-time
        *         updatedAt:
        *           type: string
        *           format: date-time
        *     CreateRegistrationDto:
        *       type: object
        *       required:
        *         - businessId
        *         - details
        *         - txId
        *         - document
        *       properties:
        *         businessId:
        *           type: string
        *         details:
        *           type: object
        *           required:
        *             - businessNames
        *             - director
        *             - witness
        *           properties:
        *             businessNames:
        *               $ref: '#/components/schemas/BusinessNames'
        *             director:
        *               $ref: '#/components/schemas/Director'
        *             witness:
        *               $ref: '#/components/schemas/Witness'
        *         txId:
        *           type: string
        *         status:
        *           type: string
        *           enum: ["pending", "approved", "rejected"]
        *         document:
        *           type: string
        *     UpdateRegistrationDto:
        *       type: object
        *       properties:
        *         details:
        *           type: object
        *           properties:
        *             businessNames:
        *               type: object
        *               properties:
        *                 type:
        *                   type: string
        *                 name1:
        *                   type: string
        *                 name2:
        *                   type: string
        *                 name3:
        *                   type: string
        *                 phone:
        *                   type: string
        *                 email:
        *                   type: string
        *                 businessNature:
        *                   type: string
        *             director:
        *               type: object
        *               properties:
        *                 firstName:
        *                   type: string
        *                 lastName:
        *                   type: string
        *                 otherName:
        *                   type: string
        *                 dateOfBirth:
        *                   type: string
        *                   format: date-time
        *                 gender:
        *                   type: string
        *                   enum: ["male", "female", "other"]
        *                 nationality:
        *                   type: string
        *                 phone:
        *                   type: string
        *                 email:
        *                   type: string
        *                 occupation:
        *                   type: string
        *                 address:
        *                   type: string
        *                 nin:
        *                   type: string
        *                 identification:
        *                   type: string
        *                 passport:
        *                   type: string
        *                 signature:
        *                   type: string
        *             witness:
        *               type: object
        *               properties:
        *                 firstName:
        *                   type: string
        *                 lastName:
        *                   type: string
        *                 otherName:
        *                   type: string
        *                 dateOfBirth:
        *                   type: string
        *                   format: date-time
        *                 gender:
        *                   type: string
        *                   enum: ["male", "female", "other"]
        *                 nationality:
        *                   type: string
        *                 phone:
        *                   type: string
        *                 email:
        *                   type: string
        *                 occupation:
        *                   type: string
        *                 address:
        *                   type: string
        *                 witnessSignature:
        *                   type: string
        *         status:
        *           type: string
        *           enum: ["pending", "approved", "rejected"]
        *         document:
        *           type: string
        *   securitySchemes:
        *     BearerAuth:
        *       type: http
        *       scheme: bearer
        *       bearerFormat: JWT
        */      

export default router;