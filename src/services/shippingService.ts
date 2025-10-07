// src/services/ShippingService.ts
import axios, { AxiosError } from "axios";
import {
  Address,
  Parcel,
  ShippingRateRequest,
  MappedShipment,
} from "../types/shippingTypes";
import { env } from "../utils/envValidator";
import { uploadBase64File } from "../utils/firebase";
import { AddressModel } from "../models/Address";
import { Shipment, ShipmentDocument } from "../models/Shipment";
import {
  flattenObject,
  ShipmentRequest,
  ShipmentResponse,
} from "../utils/flatten";
import { Response } from "express";
import { EmailService } from "./emailService";

interface UpdateShipmentParams {
  status?: string;
  waybillUrl?: string;
  id: string;
  res: Response;
}

export class ShippingService {
  static async createShipment(data: Partial<ShipmentDocument>) {
    const shipment = await Shipment.create(data);
    return shipment;
  }

  static async updateShipmentStatus({
    status,
    waybillUrl,
    id,
    res,
  }: UpdateShipmentParams): Promise<ShipmentDocument | null> {
    try {
      // Validate shipment exists
      const shipment = await Shipment.findById(id);
      if (!shipment) {
        res.status(400).json({ message: "Shipment not found" });
      }

      // Build update object dynamically
      const updateFields: { [key: string]: string } = {};
      if (status) {
        updateFields.status = status;
      }
      if (waybillUrl) {
        updateFields.waybillUrl = waybillUrl;
      }

      // Skip update if no fields provided
      if (Object.keys(updateFields).length === 0) {
        throw new Error("At least one field (status or waybillUrl) must be provided");
      }

      // Update only provided fields
      const updateRecord = await Shipment.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );

      return updateRecord;
    } catch (error) {
      throw ShippingService.handleError(error, "updating shipment");

    }
  }


  static async getAllShipments() {
    return Shipment.find().populate(["sender", "receiver"]);
  }

  static async getShipmentsByBusinessId(businessId: string) {
    return Shipment.find({ businessId }).populate(["sender", "receiver"]);
  }

  static async getShipmentById(id: string) {
    return Shipment.findById(id).populate(["sender", "receiver"]);
  }
  


  /**
   * Create a new address using the Terminal Shipping API.
   * @param address - The address data to create.
   * @returns The created address data.
   */
  static async createAddress(address: Address): Promise<any> {
    try {
      const newAddress = new AddressModel(address);
      await newAddress.save();
      return newAddress;
    } catch (error) {
      throw ShippingService.handleError(error, "creating address");
    }
  }

  /**
   * Create a new address using the Terminal Shipping API.
   * @param userId - The user to get all the address.
   * @returns All the addresses owned by the user.
   */
  static async getBusinessAddresses(businessId: string) {
    return AddressModel.find({ businessId });
  }

  /**
   * Create a new parcel using the Terminal Shipping API.
   * @param parcel - The parcel data to create.
   * @returns The created parcel data.
   */
  static async createParcel(parcel: Parcel): Promise<any> {
    try {
      const response = await axios.post(
        `${env.TERMINAL_SHIPPING_API_URL}/parcels`,
        parcel,
        {
          headers: {
            Authorization: `Bearer ${env.TERMINAL_SHIPPING_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ShippingService.handleError(error, "creating parcel");
    }
  }

  /**
   * Get shipping rates using the Terminal Shipping API.
   * @param request - The shipping rate request data.
   * @returns The shipping rates.
   */
  static async getShippingRates(request: ShippingRateRequest): Promise<any> {
    try {
      const response = await axios.post(
        `${env.TERMINAL_SHIPPING_API_URL}/rates`,
        request,
        {
          headers: {
            Authorization: `Bearer ${env.TERMINAL_SHIPPING_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw ShippingService.handleError(error, "retrieving shipping  rates");
    }
  }

  static async createQCShipment(data: MappedShipment, txId: string) {
    const qcBaseUrl = env.QC_BASE_URL;
    const shipPath = env.QC_BOOKING_PATH;
    const token = env.QC_TOKEN;
    const clientId = env.QC_CLIENT_ID;

    try {
      const { indexFigure ,sender, receiver, packages, ...rest } = data;

      console.log(
        "attempting to process shipment with QC",
        console.log(String(rest))
      );
      const shippingResponse = await axios.post(
        `${qcBaseUrl}${shipPath}`,
        rest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ClientID: clientId,
          },
        }
      );


      console.log(JSON.stringify(rest));

      if (!shippingResponse?.data?.data?.shipmentMeta.documents[0].content) {
        await EmailService.alertAdminOfShipment();

        throw new Error("Waybill not found");
      }

      const waybillLink = await uploadBase64File(
        shippingResponse?.data?.data?.shipmentMeta.documents[0].content,
        (receiver.name.trim()).replace(/[./]/g, ''),
        "application/pdf"
      );
      console.log("WAYBILL LINK", waybillLink);

      const trackingId =
        shippingResponse?.data?.data?.shipmentMeta.trackingId || "NIL";

      const bookingId =
        shippingResponse?.data?.data?.bookingId || "NIL";

      const shipmentRecord = await Shipment.findOneAndUpdate(
        { txId },
        {
          $set: {
            trackingNumber: trackingId,
            shipmentId: bookingId,
            waybillUrl: waybillLink.url,
          },
        },
        { new: true }
      );
      console.log("SHIPPING RECORD", shipmentRecord);

      return {
        shipment_tracking_number: trackingId,
        shipment_number: trackingId,
        pdf_document: waybillLink.url,
      };
    } catch (error: any) {
      console.log((error.response?.data));
      throw ShippingService.handleError(error, "creating shipment v2");
    }
  }

  static async createParcelFlowShipment(data: ShipmentRequest): Promise<any> {
    const shipUrl = env.PC_SHIP_BASE_URL;
    const shipAccessToken = env.PC_SHIP_ACCESS_TOKEN;

    try {
      // const res = await axios.post<any>(
      //   `${shipUrl}engine/v1/apis/shipments/create-shipment`,
      //   data.pcfData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Access-Token": shipAccessToken,
      //     },
      //   }
      // );

      const res:any = {}

      // console.log("PARCELFLOW RESPONSE", flattenObject(res.data));
      // console.log("PARCELFLOW RESPONSE", flattenObject(res.data));

      if (!res?.data?.binary_document) {

        const shipmentRecord = {
          businessId: data.businessId,
          txId: data.txId,
          sender: data.pcfData.sender,
          receiver: data.pcfData.receiver,
          shipmentId: "NIL",
          waybillUrl: "NIL",
          trackingNumber: "NIL",
          packages: data.pcfData.package,
          amount: data.amount,
          cost: data.indexFigure
        };


        await ShippingService.createShipment(shipmentRecord);

        await EmailService.alertAdminOfShipment();

        return {
          message: "Shipment submitted",
          success: true,
        };
      }

      const wayBillUrl = await uploadBase64File(
        res?.data?.binary_document,
        data.pcfData.receiver.name.trim(),
        "application/pdf"
      );
      const success =
        res?.data?.message === "Shipment has been created"

      const shipmentRecord = {
        businessId: data.businessId,
        txId: data.txId,
        sender: data.pcfData.sender,
        receiver: data.pcfData.receiver,
        shipmentId: success ? res?.data?.shipment_number : "NIL",
        waybillUrl: success ? wayBillUrl.url : "NIL",
        trackingNumber: success ? res?.data?.shipment_tracking_number : "NIL",
        packages: data.pcfData.package,
        amount: data.amount,
        cost: data.indexFigure
      };

      await ShippingService.createShipment(shipmentRecord);

      // Log flattened response
      return { ...res.data, pdf_document: wayBillUrl };
    } catch (error) {
      // Type-safe error handling
      const err = error as AxiosError<{ message?: string }>;
      console.log(
        "shipment failed",
        (err.response?.data || { error: err.message })
      );
      throw ShippingService.handleError(err, "creating shipment v1");
    }
  }

  /**
   * Handle API errors and return a formatted error object.
   * @param error - The caught error.
   * @param action - The action being performed.
   * @returns A formatted error object.
   */
  private static handleError(error: any, action: string): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        `Error ${action}: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    }
    return new Error(`Unexpected error ${action}: ${error.message}`);
  }
}
