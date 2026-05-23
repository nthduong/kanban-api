import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouter } from "~/routes/v1/boardRoute";
import { columnRouter } from "~/routes/v1/columnRoute";
import { cardRouter } from "~/routes/v1/cardRoutes";
import { userRouter } from "~/routes/v1/userRouter";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs v1 are ready to use." });
});

Router.use("/boards", boardRouter);
Router.use("/columns", columnRouter);
Router.use("/cards", cardRouter);
Router.use("/users", userRouter);

export const APIs_V1 = Router;
