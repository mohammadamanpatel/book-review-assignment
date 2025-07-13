import jwt from "jsonwebtoken";

//generating json web token for user auth middleware to access some book and review routes
const generateToken = (userId, username, email) => {
  return jwt.sign(
    { id: userId, username: username, email: email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};
export default generateToken;
