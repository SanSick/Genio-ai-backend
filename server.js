const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const usersRouter = require("./routes/usersRouter");
const openAIRouter = require("./routes/openAIRouter");
const { errorHandler } = require("./middlewares/errorMiddleware");
const stripeRouter = require("./routes/stripeRouter");
require("./utils/connectDB")();

const app = express();
const PORT = process.env.PORT || 8090;

//Corn for the trail period : run every single day
cron.schedule("0 0 * * * *", async () => {
    // console.log("Running trial check every sec...");
    try {
        //get the current date
        const today = new Date();
        const updatedUser = await User.updateMany({
            trialActive: true, 
            trialExpires: {$lt: today}, //* $lt = lessthan
        },{
            trialActive: false,
            subscriptionPlan: "Free",
            monthlyRequestCount: 200,
        });
        console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
});
  
//Corn for the Free Plan : run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    // console.log("Running trial check every sec...");
    try {
        //get the current date
        const today = new Date();
        await User.updateMany({
            subscriptionPlan: "Free",
            nextBillingDate: {$lt: today}, //* $lt = lessthan
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});

//Corn for the Basic Plan : run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    // console.log("Running trial check every sec...");
    try {
        //get the current date
        const today = new Date();
        await User.updateMany({
            subscriptionPlan: "Basic",
            nextBillingDate: {$lt: today}, //* $lt = lessthan
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});

//Corn for the Premiun Plan : run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    // console.log("Running trial check every sec...");
    try {
        //get the current date
        const today = new Date();
        await User.updateMany({
            subscriptionPlan: "Premiun",
            nextBillingDate: {$lt: today}, //* $lt = lessthan
        },{
            monthlyRequestCount: 0,
        });
    } catch (error) {
        console.log(error);
    }
});

//-----middlewares-----//
app.use(express.json());  //^pass incoming json data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  //^ to pass the cookie automatically
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}
app.use(cors(corsOptions));


//-------- Routes -------//
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);


//---- Error Handler Middleware -------//
app.use(errorHandler);

//Start the server
app.listen(PORT, console.log(`server is running on port ${PORT}`));
