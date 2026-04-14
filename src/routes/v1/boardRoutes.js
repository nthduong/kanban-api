import express from "express";
import { StatusCodes } from "http-status-codes";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "APIs get list boards" });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: "APIs create list boards" });
  });

export const boardRouters = Router;
