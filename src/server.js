/* eslint-disable no-console */
import express from "express";
import cors from "cors";
import { CONNECT_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { corsOptions } from "./config/cors";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
  const app = express();

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`I am running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });
};

(async () => {
  try {
    await CONNECT_DB();
    console.log("Connected to Mongodb Cloud Atlas");
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
