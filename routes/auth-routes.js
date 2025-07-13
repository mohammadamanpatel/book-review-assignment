import express from "express";
import { login, signup } from "../controllers/auth-controllers.js";
const router = express.Router();

//auth routes for user registration and login
router.post("/signup",signup)
router.post("/login",login)
export default router;