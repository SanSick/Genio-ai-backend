import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

//------ Registrstion -----//
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    trialActive: true,
    trialPeriod: 7, // example: 7 days
  });

  // Set trial expiry date
  newUser.trialExpires = new Date(
    Date.now() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  await newUser.save();

  res.status(201).json({
    status: true,
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});


//------ Login -----//
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  // Set cookie
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production" ? true : false,
  //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  //   maxAge: 3 * 24 * 60 * 60 * 1000,
  // });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
  
  

  res.status(200).json({
    status: "success",
    message: "Login successful",
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});

//------ Logout -----//
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    // httpOnly: true,
    // expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});


//------ Profile -----//
export const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("payments")
    .populate("contentHistory");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    status: "success",
    user,
  });
});


//------ Check user Auth Status -----//
export const checkAuth = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAuthenticated: true });

  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});


export default {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
