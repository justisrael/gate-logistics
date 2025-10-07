import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileStream = fs.createReadStream(file.path);
    const fileKey = `uploads/${Date.now()}-${path.basename(file.originalname)}`;

    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("File upload failed");
    }
  }
}

export default new S3Service();
