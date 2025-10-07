import { model, Schema } from "mongoose";

// Define possible roles as a type
type Role = 'admin' | 'superAdmin';

export interface AdminDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string[]; // Array of roles
  isActive: boolean;
}

const adminSchema = new Schema<AdminDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: [String], default: ['admin'], required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Admin = model<AdminDocument>("Admin", adminSchema);

export default Admin;