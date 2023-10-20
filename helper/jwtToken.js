import jwt from "jsonwebtoken";

const sendToken = (user, accessToken, statusCode, res) => {
  res.status(statusCode).json({ successStatus: true, user, accessToken });
};

const getJWTToken = (payload) => {
  const jwtExpire = 30 || process.env.JWT_EXPIRE 
  const secretKey = process.env.JWT_SECRET;
  const jwtToken = jwt.sign(payload, secretKey, {
    expiresIn: jwtExpire * 24 * 60 * 60 * 1000,
  });
  return jwtToken;
};

export { getJWTToken, sendToken };
