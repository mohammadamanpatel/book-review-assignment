import User from "../models/user.model.js";

// Creates a new user entry with the provided username, email, and password
export const createUserEntry = async ({ username, email, password }) => {
  console.log({ username, email, password });
  const user = new User({ username, email, password: password }); // initializes a new user
  return await user.save(); // saves the user to the database
};

// Finds a user by their ID and excludes the password field from the result
export const findUserEntry = async (userId) => {
  return await User.findById(userId).select("-password");
};
