import multer from "multer";
import { StatusCodes } from "http-status-codes";

import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from "~/utils/validators";
import ApiError from "~/utils/ApiError";

const customFileFilter = (req, file, callback) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage), null);
  }
  return callback(null, true);
};

const upload = multer({
  limits: { fieldSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = { upload };
