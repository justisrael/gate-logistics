import { z } from "zod";
import {  Types } from "mongoose";



// src/types/shippingTypes.ts
export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Package {
  parcel: Parcel;
  items: string[];
}

export interface ShippingRateRequest {
  from: Address;
  to: Address;
  package: Package;
}


export type MappedShipment = {
  indexFigure: number;
  type: "EXPORT" | "IMPORT";
  insurance: boolean;
  shipmentData: ShipmentData;
  bookingData: BookingData;
  international: InternationalData;

  sender: AddressQC;
  receiver: AddressQC;
  packages: PackageQC;

  businessId: Types.ObjectId;
  txId: string;
  amount: number[];

  
};

type ShipmentData = {
  plannedShippingDateAndTime: string; // ISO string
  pickup: boolean;
  declaredValue: number;
  sender: Party;
  receiver: Party;
  packages: PackageItemQ[];
  description: string;
};

type Party = {
  postalAddress: AddressQ;
  contactInformation: Contact;
};

type AddressQ = {
  postalCode: string;
  cityName: string;
  countryCode: string;
  addressLine1: string;
  addressLine2?: string;
  countyName?: string;
};

type Contact = {
  phone: string;
  companyName: string;
  fullName: string;
  email: string;
};

type PackageItemQ = {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
};

type BookingData = {
  category: string;
  shipment_type: string;
  value: number;
};

type InternationalData = {
  exportDeclaration: ExportDeclaration;
};

type ExportDeclaration = {
  exportReason: string;
  exportReasonType: string;
  shipmentType: "personal" | "commercial";
  placeOfIncoterm: string;
  invoice: Invoice;
  lineItems: ExportLineItem[];
};

type Invoice = {
  number: string;
  date: string; // "YYYY-MM-DD"
  totalNetWeight: number;
  totalGrossWeight: number;
};

type ExportLineItem = {
  number: number;
  quantity: {
    unitOfMeasurement: string;
    value: number;
  };
  price: number;
  description: string;
  weight: {
    netValue: number;
    grossValue: number;
  };
  commodityCodes: CommodityCode[];
  exportReasonType: string;
  manufacturerCountry: string;
};

type CommodityCode = {
  typeCode: string;
  value: string;
};

const PackageItemSchema = z.object({
  category: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.string(), // Change to z.number() if applicable
  quantity: z.string(),
  value: z.string(),
  value_currency: z.string(),
  hs_code: z.string(),
  image_url: z.string().url(),
});

const PackageDetailSchema = z.object({
  number_of_items: z.number(),
  package_value: z.number(),
  package_weight: z.number(),
  package_length: z.string(), // Change to z.number() if needed
  package_width: z.string(),
  package_height: z.string(),
  description: z.string(),
  package_items: z.array(PackageItemSchema),
});

const PackageObjSchema = z.object({
  package_type: z.string(),
  package_image_url: z.string().url(),
  packages: z.array(PackageDetailSchema),
});


const AddressSchema = z.object({
  name: z.string(),
  address_1: z.string(),
  address_2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postcode: z.string(),
  email: z.string().email(),
  phone_no: z.string(),
});

export type AddressQC = z.infer<typeof AddressSchema>;
export type PackageQC = z.infer<typeof PackageObjSchema>;