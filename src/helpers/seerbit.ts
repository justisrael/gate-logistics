import axios from "axios";
import { env } from "../utils/envValidator";

export class SeerbitHelper {
  private baseUrl = env.SEERBIT_API_URL;
  private apiKey = env.SEERBIT_PUBLIC_KEY;
  private merchantId = env.SEERBIT_MERCHANT_ID ?? "";

  async chargeCard(walletId: string, amount: number) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments/charge`,
        {
          amount,
          currency: "NGN",
          walletId,
          merchantId: this.merchantId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Seerbit payment error");
    }
  }

  async validateTransaction(transactionReference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/query/${transactionReference}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Seerbit validation error"
      );
    }
  }
}
