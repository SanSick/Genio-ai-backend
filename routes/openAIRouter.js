// const express = require("express");

// const { isAuthenticated } = require("../middlewares/isAuthenticated").default;
// const { openAIController } = require("../controllers/openAIController").default;
// const { checkApiRequestLimit } = require("../middlewares/checkApiRequestLimit").default;

// const openAIRouter = express.Router();

// openAIRouter.post(
//   "/generate-content",
//   isAuthenticated,
//   checkApiRequestLimit,
//   openAIController
// );

// module.exports = openAIRouter;

import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { openAIController } from "../controllers/openAIController";
import { checkApiRequestLimit } from "../middlewares/checkApiRequestLimit";

const openAIRouter = Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

export default openAIRouter;
