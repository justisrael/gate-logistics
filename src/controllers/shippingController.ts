import { Request, Response, NextFunction } from "express";
import {
  Address,
  Parcel,
  ShippingRateRequest,
  MappedShipment,
} from "../types/shippingTypes";
import { ShippingService } from "../services/shippingService";
import {
  flattenObject,
  ShipmentRequest,
  ShipmentResponse,
} from "../utils/flatten";
import axios, { AxiosError } from "axios";
import PercelFlowSerrvice from "../services/percelFlowSerrvice";
import { env } from "../utils/envValidator";
import { WalletService } from "../services/walletService";
import { EmailService } from "../services/emailService";

export class ShippingController {
  static async createShipment(req: Request, res: Response) {
    try {
      const shipment = await ShippingService.createShipment(req.body);
      res.status(201).json({ success: true, data: shipment });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // static async updateShipmentStatus(req:Request, res:Response){
  //   try {
  //     const {id} = req.params;
  //     const {status, url} = req.body
  //     const updateStatus = await ShippingService.updateShipmentStatus(status, url, id)
  //   } catch (error) {

  //   }
  // }

  static async updateShipmentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, waybillUrl } = req.body;

      // Validate input
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Shipment ID is required" });
      }

      const updateRecord = await ShippingService.updateShipmentStatus({
        status,
        waybillUrl,
        id,
        res,
      });

      if (!updateRecord) {
        res.status(404).json({ success: false, message: "Shipment not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Shipment updated successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the shipment",
      });
    }
  }

  static async createShipmentData(req: Request, res: Response) {
    try {
      const data = req.body;
      const parcelFlowShippment =
        await ShippingService.createParcelFlowShipment(data);
      await EmailService.alertAdminOfShipment();

      res.status(200).json({ status: true, data: parcelFlowShippment });
    } catch (error: any) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  static async processQCShipment(req: Request, res: Response) {
    try {
      const data: MappedShipment = req.body;

      const { indexFigure, ...rest } = data;

      // console.log(data)

      const shipmentRecord = {
        businessId: data.businessId,
        txId: data.txId,
        sender: data.sender,
        receiver: data.receiver,
        shipmentId: "NIL",
        waybillUrl: "NIL",
        trackingNumber: "NIL",
        packages: data.packages,
        amount: data.amount,
        cost: (indexFigure),
        status: "submitted" as
          | "submitted"
          | "pending"
          | "in_transit"
          | "delivered"
          | "canceled",
      };

      await ShippingService.createShipment(shipmentRecord);



      const walletService = new WalletService();

      const transferResponse = await walletService.baniTransferToBank(
        indexFigure.toString(),
        "bank",
        "NGN",
        "company",
        "9860932136",
        "NG",
        "QCEXPRESS/ COCONUT AFRICA",
        "100039",
        indexFigure.toString(),
        "NGN",
        {},
        env.SHIPPING_WALLET_ID
      );
      // await EmailService.alertAdminOfShipment();


      console.log("transferResponse", transferResponse);
      

      const QCShipment = await ShippingService.createQCShipment(
        data,
        rest.txId
      );
      res.status(200).json({ status: true, data: QCShipment });
    } catch (error: any) {
      // console.log(error.message);
      console.log("controller catch running");
      await EmailService.alertAdminOfShipment();


      res.status(400).json({ status: false, message: error.message });
    }
  }

  static async getAllShipments(_req: Request, res: Response) {
    const shipments = await ShippingService.getAllShipments();
    res.json({ success: true, data: shipments });
  }


  static async getShipmentsByBusinessId(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const shipments = await ShippingService.getShipmentsByBusinessId(
        businessId
      );
      return res.status(200).json({ success: true, data: shipments });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getShipmentById(req: Request, res: Response) {
    const { id } = req.params;
    const shipment = await ShippingService.getShipmentById(id);
    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }
    res.json({ success: true, data: shipment });
  }

  static async createAddress(req: Request, res: Response, next: NextFunction) {
    const address: Address = req.body;

    try {
      const result = await ShippingService.createAddress(address);
      return res.status(201).json({
        message: "Address created successfully",
        address: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBusinessAddresses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { businessId } = req.params;
    try {
      const addresses = await ShippingService.getBusinessAddresses(businessId);
      res.json({
        message: "Business addresses retrieved successfully",
        addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createParcel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const parcel: Parcel = req.body;

    try {
      const result = await ShippingService.createParcel(parcel);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getShippingRates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const request: ShippingRateRequest = req.body;

    try {
      const rates = await ShippingService.getShippingRates(request);
      res.json(rates);
    } catch (error) {
      next(error);
    }
  }
}

