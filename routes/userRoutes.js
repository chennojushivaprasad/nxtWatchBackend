import express from "express"
import {
  register,
  login,
  logout,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const userRouter = express();


userRouter.get("/user/:userId",isAuthenticatedUser, getUser);

userRouter.put("/user/:userId",isAuthenticatedUser, updateUser);

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/logout",isAuthenticatedUser, logout);

export default userRouter
