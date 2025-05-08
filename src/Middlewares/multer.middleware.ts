import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../Utils/Error";

// Extend Express Request to support `files` as Record<string, Express.Multer.File[]>
interface MulterRequest extends Request {
  files?: Record<string, Express.Multer.File[]> | Express.Multer.File[];
}

const storage = multer.memoryStorage();
const fileLimit = 5 * 1024 * 1024; // 5 MB
const fields = [
  { name: "coverPhoto", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "productImage", maxCount: 4 },
];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
const allowedFileTypes = {
  coverPhoto: allowedMimeTypes,
  logo: allowedMimeTypes,
  productImage: allowedMimeTypes,
};

const handleMulterError = (err: unknown): string | undefined => {
  if (err && err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return "Unable to upload image. Make sure that only allowed key name is used and only one file is uploaded at a time.";
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return "Unable to upload image. Max file size limit is 10MB.";
    }
  } else if (err instanceof Error) {
    return err.message;
  }
};

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  type AllowedFieldNames = keyof typeof allowedFileTypes;
  //   const fieldTypes = allowedFileTypes[file.fieldname as AllowedFieldNames];
  if (!(file?.fieldname in allowedFileTypes)) {
    return cb(new Error(`File field '${file.fieldname}' is not allowed.`));
  }
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
  }
};

export default function handleMultipartData(types: string[]) {
  return (req: MulterRequest, res: Response, next: NextFunction) => {
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: fileLimit },
    }).fields(fields);

    upload(req, res, (err) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No file selected.");
        req.files = undefined;
      }

      //   if (typeof type === "string" && !Object.keys(req.files || {}).includes(type)) {
      //     return next(new BadRequestError(`${type} is required`));
      //   }
      for (const type of types) {
        if (
          typeof type === "string" &&
          !Object.keys(req.files || {}).includes(type)
        ) {
          return next(new Error(`${type} is required.`)); // Use your CustomErrorService here
        }
      }

      const error = handleMulterError(err);
      if (error) {
        return next(new BadRequestError(error));
      }
      next();
    });
  };
}
module.exports = handleMultipartData;
