import { Storage } from '@google-cloud/storage';
import { env } from "./envValidator"
// Initialize Google Cloud Storage
const storage = new Storage({ 
  projectId: env.FIREBASE_PROJECT_ID,
  keyFilename: './src/utils/coconut.json'

});
const bucket = storage.bucket(env.FIREBASE_BUCKET_NAME);

// Define return type
interface UploadResult {
  url: string;
  id: string;
}

/**
 * Uploads a base64-encoded file to Google Cloud Storage and returns its public URL.
 *
 * @param fileData - The base64 encoded string (can include or exclude the data URI prefix)
 * @param fileName - Desired filename (e.g., "image.png")
 * @param contentType - Optional MIME type (e.g., "image/png")
 * @returns An object containing the public URL and file ID (object path in the bucket)
 */
export async function uploadBase64File(
  fileData: string,
  fileName: string,
  contentType?: string
): Promise<UploadResult> {
  if (!fileData) {
    throw new Error('No fileData (Base64 string) provided.');
  }

  // Remove any data URI prefix
  const base64Image = fileData.split(';base64,').pop() || '';
  let fileBuffer: Buffer;
  try {
    fileBuffer = Buffer.from(base64Image, 'base64');
  } catch (error) {
    console.error('Base64 decoding failed:', error);
    throw new Error('Invalid Base64 string format.');
  }

  // Extract file extension
  const fileExtension = fileName?.split('.').pop() || '';
  const uniqueFileName = `coconut/${Date.now()}_${fileName.trim() || 'untitled'}${
    fileExtension ? '.' + 'pdf' : ''
  }`;

  const file = bucket.file(uniqueFileName);

  return new Promise<UploadResult>((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: contentType || (fileExtension ? `image/${fileExtension}` : 'application/octet-stream'),
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Error during upload stream:', err);
      reject(new Error('Failed to upload file to storage.'));
    });

    stream.on('finish', async () => {
      try {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        resolve({
          url: publicUrl,
          id: file.name,
        });
      } catch (error) {
        console.error('Error making file public:', error);
        reject(new Error('Upload succeeded but failed to make file public.'));
      }
    });

    stream.end(fileBuffer);
  });
}
