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

  if (env.BUILD_MODE === "prod") {
    app.listen(process.env.PORT, () => {
      console.log(`Production: Backend server is running successfully at Port ${process.env.PORT}/`);
    });
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local DEV: Backend server is running successfully at ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`);
    });
  }
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
