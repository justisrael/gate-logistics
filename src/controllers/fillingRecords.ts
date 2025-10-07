import FillingRecordsService from "../services/fillingRecords";
import { sendErrorResponse } from "../utils/sendResponse";
import { Request, Response } from "express";


class FillingRecordController{

    static fetchByBusinessId = async (req: Request, res: Response) => {
        try {
          const { businessId } = req.params;
          if (!businessId) {
            return sendErrorResponse({ status: 400, message: "Business ID is required", res });
          }
          const forms = await FillingRecordsService.fetchByBusinessId(businessId);
          return res.status(200).json({ message: "Registration forms fetched successfully", forms });
        } catch (error: any) {
          return sendErrorResponse({
            status: error.message.includes("not found") ? 404 : 500,
            message: error.message || "Error fetching registration forms",
            res,
          });
        }
      };

      static fetchAll = async (req: Request, res: Response) => {
        try {
          const forms = await FillingRecordsService.fetchAll();
          return res.status(200).json({ message: "Registration forms fetched successfully", forms });
        } catch (error: any) {
          return sendErrorResponse({
            status: error.message.includes("not found") ? 404 : 500,
            message: error.message || "Error fetching registration forms",
            res,
          });
        }
      };

      static UpdateRecord = async (req: Request, res: Response) => {
        try {
          const { id } = req.params;
          if (!id) {
            return sendErrorResponse({ status: 400, message: "Form ID is required", res });
          }
          const form = await FillingRecordsService.updateOne(id, req.body);
          return res.status(200).json({ message: "Registration form updated successfully", form });
        } catch (error: any) {
          return sendErrorResponse({
            status: error.message.includes("not found") ? 404 : 400,
            message: error.message || "Error updating registration form",
            res,
          });
        }
      };

    static create = async (req: Request, res: Response) => {
        try {
          const form = await FillingRecordsService.create(req.body);
          return res.status(201).json({ message: "Registration form created successfully", form });
        } catch (error: any) {
          return sendErrorResponse({
            status: error.message.includes("not found") ? 404 : 400,
            message: error.message || "Error creating registration form",
            res,    
          })
        }
    }

}

export default FillingRecordController;