import { Request, Response } from "express";
import s3Service from "../services/s3Service";

class UploadController {
  async uploadFile(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const fileUrl = await s3Service.uploadFile(req.file);
      return res.json({ message: "File uploaded successfully", url: fileUrl });
    } catch (error) {
      return res.status(500).json({ error: "File upload failed" });
    }
  }
}

export default new UploadController();
