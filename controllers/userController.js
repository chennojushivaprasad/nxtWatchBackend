import User from "../model/userModel.js";
import bcrypt from "bcrypt";

import { sendToken, getJWTToken } from "../helper/jwtToken.js";

const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullname,
        email,
        password: hashedPassword,
      });

      const data = await user.save();
      const accessToken = getJWTToken({ id: data._id });

      sendToken(data, accessToken, 200, res);
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    console.error("error", req.body, err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email }).select("+password");
  } catch (error) {
    return console.log(error);
  }

  if (userExists) {
    const match = await bcrypt.compare(password, userExists.password);
    
    if (match) {
      const payload = { id: userExists._id };
      const accessToken = getJWTToken(payload);
      delete userExists["password"]
      sendToken(userExists, accessToken, 200, res);
    } else {
      return res.status(401).json({ message: "login failed" });
    }
  } else {
    return res.status(500).json({ message: "user does not exist" });
  }
};

const logout = async (req, res, next) => {
  req.cookie("accessToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    successStatus: true,
    message: "Logged Out",
  });
};

const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(500)
        .json({ successStatus: false, message: "user does not exist" });
    }
    return res.status(200).json({ user, successStatus: true });
  } catch (error) {
    return console.log(error);
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { email, ...updateUser } = req?.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(500)
        .json({ successStatus: false, message: "user does not exist" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateUser },
      { new: true }
    );

    return res.status(200).json({ successStatus: true, user: updatedUser });
  } catch (error) {
    return console.log(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      return res
        .status(500)
        .json({ successStatus: false, message: "user does not exist" });
    }
    return res.status(200).json({ users, successStatus: true });
  } catch (error) {
    return console.log(error);
  }
};

const deleteUser = async (req, res, next) => {};

export { register, login, logout, getAllUser, getUser, updateUser, deleteUser };
