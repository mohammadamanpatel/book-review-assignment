import jwt from "jsonwebtoken";
import { findUserEntry } from "../db-call-repositories/user-db-repo.js";

// Middleware to authenticate users using JWT
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Extract the authorization header
    const authHeader = req.headers.authorization;
    console.log("auth header", authHeader);

    // Check if the authorization header exists and starts with 'Bearer'
    if (authHeader && authHeader.startsWith("Bearer")) {
      // Extract token from 'Bearer <token>' format
      token = authHeader.split(" ")[1];
    }

    // If token is not provided, deny access
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    // Verify the token using JWT_SECRET
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    // Attach the user object (without password) to the request for downstream use
    req.user = await findUserEntry(decoded.id);
    console.log("req.user in middleware", req.user);

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired, send unauthorized response
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
