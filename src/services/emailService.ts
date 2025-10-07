import axios, { AxiosError } from "axios";
import { env } from "../utils/envValidator";

export class EmailService {
  private static zoho_key = env.ZOHO_KEY;
  private static apiUrl = env.ZOHO_URL;

  private static config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${this.zoho_key}`,
    },
  };

  static async alertAdminOfShipment() {
    const payload = {
      from: { address: "noreply@withcoconut.com", name: "Coconut Africa" },
      to: [
        { email_address: { address: 'temitopefromcoconut@gmail.com', name: "Temitope" } },
        { email_address: { address: 'kofoworolafromcoconut@gmail.com', name: "Kofoworola" } }
      ],
      template_key: "shipment-submitted"
    };

    try{

        console.log("alerting admins")
       await axios.post(this.apiUrl, payload, this.config);
    } catch(error: any){
        console.log("failed to alert admins", error?.response?.data || error.message || error.data);
    }
  }
}
