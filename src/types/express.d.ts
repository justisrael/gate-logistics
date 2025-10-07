import { Request } from "express";

export interface UserPayload {
  id: string;
  email: string;
  role?: string;
}

// Extend Express's Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
