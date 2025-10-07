import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import fs from "fs";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coconut API",
      version: "1.0.0",
      description: "API documentation for the Coconut application",
    },
    components: {
      schemas: {
        RegisterUser: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "phone"],
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            businessName: { type: "string", example: "Doe Enterprises" },
            isBusinessRegistered: { type: "boolean", example: true },
            phone: { type: "string", example: "+1234567890" },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecureP@ss123",
            },
          },
        },
        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecureP@ss123",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "NewStrongP@ss123",
            },
          },
        },
        RegisterBusiness: {
          type: "object",
          required: [
            "businessName",
            "businessLogo",
            "isRegistered",
            "businessCategory",
            "country",
            "businessType",
            "primaryEmail",
          ],
          properties: {
            businessName: {
              type: "string",
              minLength: 2,
              example: "Tech Corp",
            },
            businessLogo: {
              type: "string",
              format: "url",
              example: "https://example.com/logo.png",
            },
            isRegistered: {
              type: "boolean",
              example: true,
            },
            businessCategory: {
              type: "string",
              minLength: 2,
              example: "Technology",
            },
            country: {
              type: "string",
              minLength: 2,
              example: "Ghana",
            },
            businessType: {
              type: "string",
              enum: ["Merchants", "Corporates", "Agents"],
              example: "Merchants",
            },
            primaryEmail: {
              type: "string",
              format: "email",
              example: "contact@techcorp.com",
            },
          },
        },
        UpdateBusiness: {
          type: "object",
          properties: {
            businessName: {
              type: "string",
              minLength: 2,
              example: "Updated Tech Corp",
            },
            businessLogo: {
              type: "string",
              format: "url",
              example: "https://example.com/new-logo.png",
            },
            isRegistered: {
              type: "boolean",
              example: true,
            },
            businessCategory: {
              type: "string",
              minLength: 2,
              example: "Updated Technology",
            },
            country: {
              type: "string",
              minLength: 2,
              example: "Nigeria",
            },
            businessType: {
              type: "string",
              enum: ["small", "medium", "large"],
              example: "medium",
            },
            primaryEmail: {
              type: "string",
              format: "email",
              example: "updated@techcorp.com",
            },
          },
        },
        BusinessIdParam: {
          type: "object",
          properties: {
            businessId: {
              type: "string",
              minLength: 24,
              maxLength: 24,
              example: "60f5b49f1c4ae94b9c4e7c12",
            },
          },
        },
        AccessRequest: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "phone",
            "businessName",
            "businessCategory",
            "country",
            "city",
            "needs",
          ],
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            phone: { type: "string", example: "+1234567890" },
            businessName: { type: "string", example: "Doe Enterprises" },
            businessCategory: { type: "string", example: "Tech" },
            country: { type: "string", example: "USA" },
            city: { type: "string", example: "New York" },
            needs: { type: "string", example: "Looking for private access" },
          },
        },
        Address: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "John Doe",
            },
            street: {
              type: "string",
              example: "123 Main St",
            },
            city: {
              type: "string",
              example: "New York",
            },
            state: {
              type: "string",
              example: "NY",
            },
            postalCode: {
              type: "string",
              example: "10001",
            },
            country: {
              type: "string",
              example: "USA",
            },
          },
          required: [
            "name",
            "street",
            "city",
            "state",
            "postalCode",
            "country",
          ],
        },
        Parcel: {
          type: "object",
          properties: {
            length: {
              type: "number",
              example: 10,
            },
            width: {
              type: "number",
              example: 5,
            },
            height: {
              type: "number",
              example: 8,
            },
            weight: {
              type: "number",
              example: 2,
            },
          },
          required: ["length", "width", "height", "weight"],
        },
        Package: {
          type: "object",
          properties: {
            parcel: {
              $ref: "#/components/schemas/Parcel",
            },
            items: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["item1", "item2"],
            },
          },
          required: ["parcel", "items"],
        },
        ShippingRateRequest: {
          type: "object",
          properties: {
            from: {
              $ref: "#/components/schemas/Address",
            },
            to: {
              $ref: "#/components/schemas/Address",
            },
            package: {
              $ref: "#/components/schemas/Package",
            },
          },
          required: ["from", "to", "package"],
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Adjust path if needed
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Save Swagger JSON to a file for reference
  fs.writeFileSync("./openapi.json", JSON.stringify(swaggerDocs, null, 2));
};
