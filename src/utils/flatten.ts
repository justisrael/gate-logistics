import { ShipmentRequestPayload } from "../schemas/shipmentSchema"; 
import { Types } from "mongoose";


export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
    let result: Record<string, any> = {};
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
  
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(result, flattenObject(obj[key], newKey));
        } else {
          result[newKey] = obj[key];
        }
      }
    }
  
    return result;
  }

  // types/shipping.ts
export interface ShipmentRequest {
    pcfData: ShipmentRequestPayload; // Replace with actual schema if known
    businessId: Types.ObjectId;
    amount: number[];
    txId: string;
    indexFigure: number;
  }
  
  export interface ShipmentResponse {
    // Define based on API response, e.g.:
    shipment?: {
      id: number;
      status: string;
      [key: string]: any;
    };
  }