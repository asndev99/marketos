import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

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
                public_id: filename?.split('.')[0], // optional
                resource_type: 'image',
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error || !result) {
                    return reject(new Error(error?.message || 'Upload to Cloudinary failed'));
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

/**
 * Generates pagination parameters for MongoDB queries using offset-based pagination.
 *
 * @param {number} [page=1] - The current page number (1-based).
 * @param {number} [pageSize=10] - The number of documents to return per page.
 * @returns {{ skip: number, limit: number }} An object containing `skip` and `limit` values.
 *
 * @example
 * const { skip, limit } = paginate(2, 5);
 * // skip = 5, limit = 5 (for page 2)
 */
export const paginate = (page: number = 1, pageSize: number = 10) => {
    const skip = (page - 1) * pageSize;
    return {
        skip,
        limit: pageSize,
    };
};
