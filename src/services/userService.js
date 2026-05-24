import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import { userModel } from "~/models/userModel";
import { pickUser } from "~/utils/formatters";
import ApiError from "~/utils/ApiError";
import { WEBSITE_DOMAINS } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";

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

    const verificationLink = `${WEBSITE_DOMAINS}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject = "Kanban Flow: please verify your email before using our services!";
    const htmlContent = `
    <h3>Here is your verification link:</h3>
    <h3>${verificationLink}</h3>
    `;

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
