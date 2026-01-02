// //&------ IsAuthenticated middleware
// const isAuthenticated = asyncHandler(async (req, res, next) => {
//     // console.log("isAuthenticated");
//     // console.log(req.cookies);
//     if (req.cookies.token) {
//         //! Verify the token
//         const decoded = verify(req.cookies.token, process.env.JWT_SECRET);
//         //* this is the actual user
//         // console.log(decoded);
//         //* Add the user to the req object
//         req.user = await findById(decoded?.id).select('-password');
//         return next();

//     }else{
//         return res.status(401).json({message: 'Not authorized, no token'});
//     }
// });

// export default {isAuthenticated};

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});
