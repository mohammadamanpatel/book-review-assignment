import bcrypt from "bcryptjs";

//comparing user's password wheather password is correct or not
const comparePassword = async (enteredPassword, dbPassword) => {
  return await bcrypt.compareSync(enteredPassword, dbPassword);
};
export default comparePassword;
