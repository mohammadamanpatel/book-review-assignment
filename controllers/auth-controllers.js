import { createUserEntry } from "../db-call-repositories/user-db-repo.js";
import User from "../models/user.model.js";
import comparePassword from "../utils/compare-password-util.js";
import generateToken from "../utils/Jwt-utils.js";

// Controller for user signup (registration)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user already exists with the same email or username
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user entry
    const user = await createUserEntry({ username, email, password });

    // Generate a JWT token using user ID
    const token = generateToken(user._id);

    // Send successful response with token and user info
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Controller for user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist or password is incorrect, return error
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for authenticated user
    const token = generateToken(user._id, user.username, user.email);

    // Send success response with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
