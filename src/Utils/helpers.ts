import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.cloud_name as string,
  api_key: process.env.api_key as string,
  api_secret: process.env.api_secret as string,
});

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  filename?: string,
  folder?: string
): Promise<{ url: string; uploadedAt: Date }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename?.split(".")[0], // optional
        resource_type: "image",
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(new Error(error?.message || "Upload to Cloudinary failed"));
        }

        resolve({
          url: result.secure_url,
          uploadedAt: new Date(result.created_at),
        });
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};
