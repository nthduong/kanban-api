import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json({ message: "APIs create list boards" });
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "loi");
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};
