import express, { urlencoded } from "express";
import { config } from "dotenv";
import connectDB from "./config/db.config.js";

//importing the auth,book and book-review routes and placing them in app.use for accessing them
import authRoutes from "./routes/auth-routes.js";
import bookRoutes from "./routes/book-routes.js";
import reviewRoutes from "./routes/review-routes.js";
config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books",bookRoutes);
app.use("/api/v1",reviewRoutes)

//listening on the port number along with calling callDB function 
app.listen(PORT, async () => {
  console.log("our app is running on port" + PORT);
  await connectDB();
});
