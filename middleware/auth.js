import jwt from "jsonwebtoken"
import User from "../model/userModel.js"

const isAuthenticatedUser = async (req, res, next) => {
  const { authorization } = req.headers;
  
  try {
    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      console.log("not valid");
      return next();
    }

    const verify = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(verify?.id);
    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.log(error);
    return;
  }
};

export { isAuthenticatedUser };
