import { z } from "zod";

const AddressInfoSchema = z.object({
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

export const createShipmentSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  sender: AddressInfoSchema,
  receiver: AddressInfoSchema,
  shipmentId: z.string().min(1, "Shipment ID is required"),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  waybillUrl: z.string().min(1, "Waybill URL must be a valid URL"),
  packages: z.record(z.any()), 
  txId: z.string().min(1, "Transaction ID is required"),
  amount: z.number().min(1, "Amount is required"),
});

export const getShipmentByIdSchema = z.object({
  id: z.string().min(1, "Shipment ID is required"),
});

export const getShipmentBybusinessIdSchema = z.object({
  businessId: z.string().min(1, "Shipment ID is required"),
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

const InsuranceSchema = z.object({
  request_insurance: z.string(),
  insurance_type: z.string(),
  insurance_fee: z.number(),
});

const PickupSchema = z.object({
  request_pickup: z.string(),
  pickup_type_id: z.string(),
  pickup_fee: z.number(),
});

const FeesSchema = z.object({
  standard_fee: z.string(), // Change to z.number() if needed
  services_fee: z.number(),
  extras_fee: z.number(),
  shipping_fee: z.string(), // Change to z.number() if needed
});

const BookingSchema = z.object({
  shipment_type: z.string(),
  shipping_date: z.string(), // Consider refining with regex or Zod date coercion
  carrier_id: z.string().optional(),
  processing_station_id: z.string(),
  currency: z.string(),
  insurance: InsuranceSchema,
  pickup: PickupSchema,
  fees: FeesSchema.optional(),
});

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

export const ShipmentRequestSchema = z.object({
  sender: AddressSchema, 
  receiver: AddressSchema,
  booking: BookingSchema,
  package: PackageObjSchema,
});

export type ShipmentRequestPayload = z.infer<typeof ShipmentRequestSchema>;
