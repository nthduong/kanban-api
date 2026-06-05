import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";

import { userModel } from "~/models/userModel";
import { pickUser } from "~/utils/formatters";
import ApiError from "~/utils/ApiError";
import { WEBSITE_DOMAINS } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";

const createNew = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOneByEmail(reqBody.email);

    if (exitsUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Already exits email!");
    }

    const nameFromEmail = reqBody.email.split("@")[0];

    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 10),

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

const verifyAccount = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOneByEmail(reqBody.email);

    if (!exitsUser) throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (exitsUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Your account is already active!");
    if (exitsUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid! ");

    const updateData = {
      isActive: true,
      verifyToken: null,
    };

    const updateUser = await userModel.update(exitsUser._id, updateData);

    return pickUser(updateUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    const exitsUser = await userModel.findOneByEmail(reqBody.email);

    if (!exitsUser) throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (!exitsUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Your account is not active!");
    if (!bcryptjs.compareSync(reqBody.password, exitsUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Your Email or Password is incorrect!");
    }

    const userInfo = { _id: exitsUser._id, email: exitsUser.email };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE,
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE,
    );

    return { accessToken, refreshToken, ...pickUser(exitsUser) };
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE);

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE,
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};

const update = async (userId, reqBody) => {
  try {
    const exitsUser = await userModel.findOneById(userId);

    if (!exitsUser) throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (!exitsUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Your account is not active!");

    let updatedUser = {};

    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, exitsUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Your Current Password is incorrect!");
      }

      updatedUser = await userModel.update(exitsUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 10),
      });
    } else {
      updatedUser = await userModel.update(exitsUser._id, reqBody);
    }

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
};
