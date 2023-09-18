import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  // set JWT as HTTP-Only
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.NODE_ENV !== "development",
    sameSite: "strict",
    expiresAt: 30 * 24 * 60 * 60 * 1000, // 30days in mili seconds = 30 days * 24 hours * 60 minutes * 60 seconds * 1000 miliseconds
  });
};

export default generateToken;
