import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
    //console.log(req.user);
    if (!req.user) {
        return res.status(401).json({message: "Not authorized"})
    }
    //* Find the user
    const user = await User.findById(req?.user?._id);
    if (!user) {
        return res.status(404).json({message: "User not found"})
    }
    let requestLimit = 0;
    //check if the user is on trail period 
    if (user?.trialActive) {
        requestLimit = user?.monthlyRequestCount;
    }
    //*Check if the user has exceeded his/her monthly request or not
    if (user?.apiRequestCount >= requestLimit) {
        throw new Error("API Request limit reached, Please subscribe to a plan");
    }

    // console.log(requestLimit);
    next();
});

export default { checkApiRequestLimit };

