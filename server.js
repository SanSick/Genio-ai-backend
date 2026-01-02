import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import 'dotenv/config'; // automatically loads .env

import User from "./models/User.js";
import usersRouter from "./routes/usersRouter.js";
import openAIRouter from "./routes/openAIRouter.js";
import stripeRouter from "./routes/stripeRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./utils/connectDB.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8090;

//Corn for the trail period : run every single day
// schedule("0 0 * * * *", async () => {
//     // console.log("Running trial check every sec...");
//     try {
//         //get the current date
//         const today = new Date();
//         const updatedUser = await User.updateMany({
//             trialActive: true,
//             trialExpires: {$lt: today}, //* $lt = lessthan
//         },{
//             trialActive: false,
//             subscriptionPlan: "Free",
//             monthlyRequestCount: 200,
//         });
//         console.log(updatedUser);
//     } catch (error) {
//         console.log(error);
//     }
// });

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();

    const result = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 200,
      }
    );

    console.log("Trial expired users updated:", result.modifiedCount);
  } catch (error) {
    console.error("Trial cron error:", error);
  }
});

//Corn for the Free Plan : run at the end of every month
cron.schedule("0 0 1 * * ", async () => {
  // console.log("Running trial check every sec...");
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today }, //* $lt = lessthan
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Corn for the Basic Plan : run at the end of every month
cron.schedule("0 0 1 * * ", async () => {
  // console.log("Running trial check every sec...");
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today }, //* $lt = lessthan
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Corn for the Premiun Plan : run at the end of every month
cron.schedule("0 0 1 * * ", async () => {
  // console.log("Running trial check every sec...");
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premiun",
        nextBillingDate: { $lt: today }, //* $lt = lessthan
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//-----middlewares-----//
const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(json()); //^pass incoming json data
app.use(urlencoded({ extended: true }));
app.use(cookieParser()); //^ to pass the cookie automatically

//-------- Routes -------//
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//---- Error Handler Middleware -------//
app.use(errorHandler);

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
