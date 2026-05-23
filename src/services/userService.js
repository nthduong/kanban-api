import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import { userModel } from "~/models/userModel";
import { pickUser } from "~/utils/formatters";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOneByEmail(reqBody.email);

    if (exitsUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Already exits email!");
    }

    const nameFromEmail = reqBody.email.split("@")[0];

    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 10),

      username: nameFromEmail,
      displayName: nameFromEmail,

      verifyToken: uuidv4(),
    };

    const createUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createUser.insertedId);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
