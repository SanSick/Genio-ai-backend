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
import { register, login, logout, userProfile, checkAuth } from "../controllers/usersController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const usersRouter = Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", logout);
usersRouter.get("/profile", isAuthenticated, userProfile);
usersRouter.get("/auth/check", isAuthenticated, checkAuth);

export default usersRouter;
