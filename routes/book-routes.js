import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  searchBooks,
} from "../controllers/book-controllers.js";
import { authenticate } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Authenticated: Add a new book
router.post("/", authenticate, createBook);

// Public: Get all books (pagination + filter)
router.get("/", getAllBooks);

// Public: Get book details (with reviews & avg rating)
router.get("/:id", getBookById);

// Public: Search books by title or author
router.get("/search/Book", searchBooks);

export default router;
