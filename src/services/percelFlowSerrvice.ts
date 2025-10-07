import axios, { AxiosError } from "axios";
import {
  flattenObject,
  ShipmentRequest,
  ShipmentResponse,
} from "../utils/flatten";

class PercelFlowSerrvice {
  static async createParcelFlowShipment(
    data: ShipmentRequest
  ): Promise<ShipmentResponse> {
    const shipUrl = process.env.SHIP_BASE_URL;
    const shipAccessToken = process.env.SHIP_ACCESS_TOKEN;

    if (!shipUrl || !shipAccessToken) {
      throw new Error("Missing SHIP_BASE_URL or SHIP_ACCESS_TOKEN");
    }

    try {
      const res = await axios.post<ShipmentResponse>(
        `${shipUrl}engine/v1/apis/shipments/create-shipment`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Token": shipAccessToken,
          },
        }
      );

      // Log flattened response
      console.log("shipment created");

      return res.data;
    } catch (error) {
      // Type-safe error handling
      const err = error as AxiosError<{ message?: string }>;
      console.log(
        "shipment failed",
        
      );
      throw new Error(err.response?.data?.message || err.message);
    }
  }
}

export default PercelFlowSerrvice;
