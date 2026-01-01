// const express = require("express");
// const { isAuthenticated } = require("../middlewares/isAuthenticated").default;
// const {
//   handlestripePayment,
//   handleFreeSubscription,
//   verifyPayment,
// } = require("../controllers/handleStripePayment").default;

// const stripeRouter = express.Router();

// stripeRouter.post("/checkout", isAuthenticated, handlestripePayment);
// stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
// stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, verifyPayment);

// module.exports = stripeRouter;
import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { handlestripePayment, handleFreeSubscription, verifyPayment } from "../controllers/handleStripePayment";

const stripeRouter = Router();

stripeRouter.post("/checkout", isAuthenticated, handlestripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, verifyPayment);

export default stripeRouter;
