import { Request } from "express";
import { Transaction } from "../models/Transaction";
import { env } from "../utils/envValidator";
import { Wallet } from "../models/Wallet";
import axios from "axios";
import crypto from "crypto";
import { flattenObject } from "../utils/flatten";
import { User } from "../models/User";

export class WebhookService {
  // private secretHash: string;
  private sharedKey: string;

  constructor() {
    // this.secretHash = env.FLW_SECRET_HASH!;
    this.sharedKey = env.BANI_SHARED_KEY
  }

  /**
   * Verify Flutterwave Webhook Signature
   */
  // verifySignature(req: Request): boolean {
  //   const signature = req.headers["verif-hash"];
  //   return signature === this.secretHash;
  // }


  //Bani Webhook Signature Verification
  verifySignature(req: any): boolean {
    try{

      const merchant_private_key = this.sharedKey;
      const signature = req.headers["bani-shared-key"];
      if (signature != merchant_private_key) {
        return false;
      } else {
        return true;
      }
    } catch(e){
      console.log(e)
      return false
    }
  }

  /**
   * Process Flutterwave Webhook Event
   */
  // async processWebhook(eventData: any) {
  //   if (!eventData || !eventData.event) {
  //     throw new Error("Invalid webhook event data");
  //   }

  //   console.log("Received Flutterwave Webhook:", eventData);

  //   if (eventData.event === "charge.completed") {
  //     const transactionId = eventData.data.id;
  //     const {
  //       id: txId,
  //       status,
  //       amount,
  //       currency,
  //       processor_response: paymentGatewayResponse,
  //     } = eventData.data;
  //     const { meta_data: meta } = eventData;

  //     const wallet = await Wallet.findOne({ txRef: eventData?.data?.tx_ref });
  //     if (!wallet) throw new Error("Wallet not found");
  //     const { _id: walletId, txRef } = wallet;

  //     await Transaction.create({
  //       txId,
  //       walletId: walletId,
  //       txRef: txRef,
  //       amount,
  //       currency,
  //       type: "funding",
  //       status,
  //       meta,
  //       paymentGatewayResponse,
  //     });
  //     if (status == "successful") {
  //       wallet.balance += amount;
  //       wallet.save();

  //       if (
  //         !eventData ||
  //         !eventData.data ||
  //         !eventData.data.customer ||
  //         !eventData.data.customer.email ||
  //         !eventData.data.customer.name ||
  //         !eventData.meta_data ||
  //         !eventData.meta_data.originatorname ||
  //         !eventData.data.amount ||
  //         !eventData.data.id
  //       ) {
  //         throw new Error("Missing required event data properties");
  //       }

  //       const transactionSummary = {
  //         email: eventData.data.customer.email,
  //         name: eventData.data.customer.name.split(" ")[0], // Extract first name
  //         narration: eventData.meta_data.originatorName,
  //         amount: eventData.data.amount,
  //         transactionId: eventData.data.id,
  //       };

  //       await axios.post(
  //         "https://withcoconut.com/api/emails/funding",
  //         transactionSummary
  //       );
  //     }
  //     console.log(`Transaction ${transactionId} marked as successful.`);
  //   }
  // }

  /**
   * Process Bani Webhook Event
   */
  async processWebhook(eventData: any) {
    if (!eventData || !eventData.event) {
      throw new Error("Invalid webhook event data");
    }


    if (eventData.event === "payin_bank_transfer") {
      const transactionId = eventData.data.pay_ref;
      const {
        pay_ref: txId,
        pay_status,
        pay_amount,
        holder_currency,

      } = eventData.data;

      const wallet = await Wallet.findOne({ txRef: eventData?.data?.pay_ext_ref });
      if (!wallet) throw new Error("Wallet not found");
      const { _id: walletId, txRef } = wallet;

      // fetch user 
      const user = await User.findOne({ email: wallet.email });
      if (!user) throw new Error("User not found");
    

      if (pay_status == "activated") {
      
        wallet.balance += pay_amount;
        await Transaction.create({
          txId,
          walletId: walletId,
          txRef: txRef,
          amount: pay_amount,
          currency: holder_currency,
          type: "funding",
          status: "successful",
          meta: {},
          paymentGatewayResponse: "Success",
        });
        // update user debt data 
        

       await wallet.save();

        try{

          if (
            !eventData ||
            !eventData.data ||
            !eventData.data.holder_first_name ||
            !eventData.data.pay_amount ||
            !eventData.data.pay_ref ||
            !txId
          ) {
            throw new Error("Missing required event data properties");
          }
  
          const transactionSummary = {
            email: wallet.email,
            name: eventData.data.holder_first_name, // Extract first name
            narration: eventData.data.narration,
            amount: eventData.data.pay_amount,
            transactionId: txId,
          };
  
          await axios.post(
            "https://withcoconut.com/api/emails/funding",
            transactionSummary
          );
        } catch(error: any){
          console.error("Error sending email:", error.message);
        }

      }
      console.log(`Transaction ${transactionId} marked as successful.`);
    }

    console.log(eventData);
  }
}
