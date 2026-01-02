// const express = require("express");
// const {
//   register,
//   login,
//   logout,
//   userProfile,
//   checkAuth,
// } = require("../controllers/usersController").default;
// const { isAuthenticated } = require("../middlewares/isAuthenticated").default;

// const usersRouter = express.Router();

// usersRouter.post("/register", register);
// usersRouter.post("/login", login);
// usersRouter.post("/logout", logout);
// usersRouter.get("/profile", isAuthenticated, userProfile);
// usersRouter.get("/auth/check", isAuthenticated, checkAuth);

// module.exports = usersRouter;

import { Router } from "express";
import {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
} from "../controllers/usersController.js";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const usersRouter = Router();

// Auth
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", isAuthenticated, logout);

// Profile
usersRouter.get("/profile", isAuthenticated, userProfile);

// Auth status check (no middleware)
usersRouter.get("/auth/check", checkAuth);

export default usersRouter;
