import asyncHandler from 'express-async-handler';
import { verify } from 'jsonwebtoken';
import { findById } from '../models/User';

//&------ IsAuthenticated middleware
const isAuthenticated = asyncHandler(async (req, res, next) => {
    // console.log("isAuthenticated");
    // console.log(req.cookies);
    if (req.cookies.token) {
        //! Verify the token
        const decoded = verify(req.cookies.token, process.env.JWT_SECRET);
        //* this is the actual user
        // console.log(decoded);
        //* Add the user to the req object
        req.user = await findById(decoded?.id).select('-password');
        return next();

    }else{
        return res.status(401).json({message: 'Not authorized, no token'});
    }
});

export default {isAuthenticated};