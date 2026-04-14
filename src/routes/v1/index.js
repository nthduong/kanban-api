import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouters } from "~/routes/v1/boardRoutes";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs v1 are ready to use." });
});

Router.use("/board", boardRouters);

export const APIs_V1 = Router;
