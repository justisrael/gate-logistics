import { Request, Response, NextFunction } from "express";
import { WalletService } from "../services/walletService";
import { Wallet } from "../models/Wallet";
import { sendErrorResponse } from "../utils/sendResponse";
import { Transaction } from "../models/Transaction";

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();

    // Bind all methods to ensure `this` is correctly referenced
    this.createWallet = this.createWallet.bind(this);
    this.getAllBanks = this.getAllBanks.bind(this);
    this.getTransactionsByWalletId = this.getTransactionsByWalletId.bind(this);
    this.getBusinessWallets = this.getBusinessWallets.bind(this);
    this.getWalletBalance = this.getWalletBalance.bind(this);
    this.processPayment = this.processPayment.bind(this);
    this.transferToBank = this.transferToBank.bind(this);  
    this.baniTransferToBank = this.baniTransferToBank.bind(this);
    this.updateBvn = this.updateBvn.bind(this);
  }

  async createWallet(req: Request, res: Response) {
    try {
      const {
        businessId,
        email,
        phoneNumber,
        firstName,
        lastName,
        bvn,
        narration,
      } = req.body;

      if (
        !businessId ||
        !email ||
        !phoneNumber ||
        !firstName ||
        !lastName ||
        !bvn ||
        !narration
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const wallet = await this.walletService.createWallet(
        businessId,
        email,
        phoneNumber,
        firstName,
        lastName,
        bvn,
        narration
      );
      return res
        .status(201)
        .json({ message: "Wallet created successfully", data: wallet });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get all banks
   */
  async getAllBanks(req: Request, res: Response, next: NextFunction) {
    try {
      const { countryCode } = req.query;
      const banks = await this.walletService.getAllBanks(countryCode as string);
      return res.status(200).json(banks);
    } catch (error) {
      next(error); 
    }
  }

  async getBusinessWallets(req: Request, res: Response, next: NextFunction) {
    try {
      const { businessId } = req.params;
      const wallets = await this.walletService.getBusinessWallets(businessId);
      res.status(200).json({ success: true, wallets });
    } catch (error) {
      next(error);
    }
  }

  async getWalletBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const balance = await this.walletService.getWalletBalance(walletId);
      res.status(200).json({ success: true, balance });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all transaction for a wallet
   */
  async getTransactionsByWalletId(req: Request, res: Response) {
    try {
      const { walletId } = req.params;

      const transactions = await this.walletService.getTransactionsByWalletId(
        walletId
      );

      res.status(200).json({
        message: "Transactions fetched successfully",
        data: transactions,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to fetch transactions",
        error: error.message,
      });
    }
  }

  /**
   * Verify Flutterwave Transaction
   */
  async verifyTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
      }

      const transactionDetails = await this.walletService.verifyTransaction(
        transactionId
      );

      if (!transactionDetails) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.status(200).json(transactionDetails);
    } catch (error: any) {
      console.error("Transaction Verification Error:", error.message);
      res.status(500).json({ error: "Failed to verify transaction" });
    }
  }

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletId, amount, meta, service } = req.body;
      const response = await this.walletService.processPayment(
        walletId,
        amount,
        meta,
        service
      );
      res.status(200).json({ success: true, response });
    } catch (error:any) {
      console.log(error?.message);
      console.log(error?.response?.data);
      next(error);
    }
  }

  
  /**
   * Transfer funds to bank
   */
  async transferToBank(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        recipientAccountBank,
        recipientAccountNumber,
        amount,
        narration,
      } = req.body;

      if (
        !recipientAccountBank ||
        !recipientAccountNumber ||
        !amount ||
        !narration
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const transferResponse = await this.walletService.transferToBank(
        recipientAccountBank,
        recipientAccountNumber,
        amount,
        narration
      );
      res.status(200).json({ success: true, data: transferResponse });
    } catch (error) {
      next(error); 
    }
  }

  async baniTransferToBank(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        receiverAmount,
        transferMethod,
        receiverCurrency,
        transferReceiverType,
        receiverAccountNumber,
        receiverCountryCode,
        receiverAccountName,
        receiverSortCode,
        senderAmount,
        senderCurrency,
        businessId,
        walletId,
        meta,
      } = req.body;


      const transferResponse = await this.walletService.baniTransferToBank(
        receiverAmount,
        transferMethod,
        receiverCurrency,
        transferReceiverType,
        receiverAccountNumber,
        receiverCountryCode,
        receiverAccountName,
        receiverSortCode,
        senderAmount,
        senderCurrency,
        businessId,
        meta,
        walletId
        );
      res.status(200).json({ success: true, data: transferResponse });
    } catch (error) {
      next(error); 
    }
  }

  async fetchWalletsData(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1; // Default to page 1
      const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
      const skip = (page - 1) * limit;
  
      const wallets = await Wallet.find().skip(skip).limit(limit);
      if (!wallets || wallets.length === 0) {
        sendErrorResponse({ res, message: 'No wallets found', status: 404 });
        return;
      }
  
      res.status(200).json({
        success: true,
        wallets,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((await Wallet.countDocuments()) / limit),
          limit,
          totalItems: await Wallet.countDocuments(),
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async fetchAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;   
      const limit = parseInt(req.query.limit as string) || 10; 
      const skip = (page - 1) * limit;
  
      const transactions = await Transaction.find().skip(skip).limit(limit);
      if (!transactions || transactions.length === 0) {
        sendErrorResponse({ res, message: 'No transactions found', status: 404 });
        return;
      }
  
      res.status(200).json({
        success: true,
        transactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((await Transaction.countDocuments()) / limit),
          limit,
          totalItems: await Transaction.countDocuments(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
       
  /**        
   * Update BVN for a wallet
   */
  async updateBvn(req: Request, res: Response) {
    try {
      const { walletId, bvn } = req.body;

      if (!walletId || !bvn) {
        return res
          .status(400)
          .json({ message: "walletId and bvn are required" });
      }

      const updatedWallet = await this.walletService.updateBvn(walletId, bvn);
      return res
        .status(200)
        .json({ message: "BVN updated successfully", data: updatedWallet });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
