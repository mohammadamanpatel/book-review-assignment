import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/book-review-controllers.js";
import { authenticate } from "../middlewares/auth-middleware.js";

const router = express.Router();

// Add a review to a book
router.post("/books/:id/reviews", authenticate, createReview);

// Update your review
router.put("/reviews/:ReviewId", authenticate, updateReview);

// Delete your review
router.delete("/reviews/:reviewId", authenticate, deleteReview);

export default router;
