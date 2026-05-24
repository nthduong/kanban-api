import { env } from "~/config/environment";

export const WHITELIST_DOMAINS = [
  // "http://localhost:5173"
  "https://kanbanflow-web.vercel.app",
];

export const BOARD_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};

export const WEBSITE_DOMAINS =
  env.BUILD_MODE === "prod" ? env.WEBSITE_DOMAINS_PRODUCT : env.WEBSITE_DOMAINS_DEVELOPMENT;
