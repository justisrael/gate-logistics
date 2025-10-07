import Admin, { AdminDocument } from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/sendResponse";
import { generateAdminCode } from "../utils/otp";
import adminTokenModel from "../models/AdminToken";

interface RegisterAdminDto {
  name: string;
  email: string;
  password: string;
  role?: string[];
}
class AdminService {
  
  static async register({
    name,
    email,
    password,
    role,
  }: RegisterAdminDto): Promise<AdminDocument> {
    // Validate input
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Validate roles
    

    // Check for existing admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: role, // Default to ['admin'] if no roles provided
      isActive: true,
    });

    return admin;
  }

  
  static async login(email: string, password: string): Promise<any> {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { id: admin._id },
      process.env.ADMIN_JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const data = {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    };
    return { message: "Login Successful", data };
  }

  static async generateAdminCode() {
    try {
      const code = generateAdminCode() as string;
      const hashedCode = await bcrypt.hash(code, 10);
      await adminTokenModel.deleteMany();
      const newToken = await adminTokenModel.create({ token: hashedCode });

      return {
        message: "Code generated successfully",
        code,
        tokenId: newToken._id,
      };
    } catch (error) {
      return { message: "Error generating code", error };
    }
  }

  static async fetchAdminData(){
    try {
      const admin = await Admin.find().select("-password");
      return { message: "Admin data fetched successfully", admin };
    } catch (error) {
      return { message: "Error fetching admin data", error }; 
    }
  }

  static async verifyAdminCode(code: string, tokenId: string) {
    try {
      const verifyToken = await adminTokenModel.findById(tokenId);
      if (!verifyToken) throw new Error("Invalid token");
      const isMatch = await bcrypt.compare(code, verifyToken.token);
      if (!isMatch) {
        throw new Error("Invalid code");
      }
      return { message: "Code verified successfully" };
    } catch (error) {}
  }
}

export default AdminService;
