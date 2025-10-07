import { Request, Response, NextFunction } from "express";
import AdminService from "../services/adminService";
import { sendErrorResponse } from "../utils/sendResponse";
import adminTokenModel from "../models/AdminToken";
import bcrypt from "bcryptjs";


class AdminController{
    // register admin
    static async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
          const { name, email, password, role } = req.body;
    
          // Validate input
          if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
          }

    
          const newAdmin = await AdminService.register({
            name,
            email,
            password,
            role,
          });
    
          const response = {
            _id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role,
            isActive: newAdmin.isActive,
          };
    
          return res.status(201).json({message: 'Admin registered successfully', response});
        } catch (error) {
          next(error);
        }
      }    

    // login admin
    static async loginAdmin(req: Request, res: Response, next: NextFunction){
        const {email, password} = req.body;

        try {
            const admin = await AdminService.login(email, password);
            return res.status(200).json({message: 'Admin logged in successfully', admin});
        }catch(error){
            next(error);
        }

    }

  static async generateAdminCode(req: Request, res: Response){
    try {
        const data = await AdminService.generateAdminCode();
        return res.status(200).json({success: true, data});
    }catch(error){
        console.log("Error generating admin code", error);
        return sendErrorResponse({ status: 500, message: 'Error generating admin code', res });
    }
  }

  static async verifyAdminCode(req: Request, res: Response){
    try {
      const {tokenId, code} = req.body;
      const verifyToken = await adminTokenModel.findById(tokenId);
      if(!verifyToken){
        return sendErrorResponse({ status: 400, message: 'Invalid admin code', res });
      }

        const admin = await AdminService.verifyAdminCode(code, tokenId);
        return res.status(200).json({message: 'Admin code verified successfully', admin});

    }catch(error){
        console.log("Error verifying admin code", error);
        return sendErrorResponse({ status: 500, message: 'Error verifying admin code', res });
  }
}
  static async fetchAdmin(req: Request, res: Response){
    try {
        const adminData = await AdminService.fetchAdminData();
        return res.status(200).json({message: 'Admin code verified successfully', adminData});

    }catch(error){
        console.log("Error verifying admin code", error);
        return sendErrorResponse({ status: 500, message: 'Error verifying admin code', res });
  }
}

  // static async verifyAdminCode(req, res) {
  //   try {
  //     const { tokenId, code } = req.body;
  //     if (!tokenId || !code) {
  //       return sendErrorResponse({ status: 400, message: 'Token ID and code are required', res });
  //     }

  //     const result = await AdminService.verifyAdminCode(code, tokenId);
  //     return res.status(200).json({
  //       status: true,
  //       message: result.message,
  //       data: result.data,
  //     });
  //   } catch (error) {
  //     console.error('Error verifying admin code:', error.message);
  //     const status = error.message.includes('not found') ? 404 : 400;
  //     return sendErrorResponse({ status, message: error.message, res });
  //   }
  // }


}

export default AdminController;