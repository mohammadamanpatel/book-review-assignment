import { getBookByIdEntry } from "../db-call-repositories/book-db-repo.js";
import {
  createReviewEntry,
  deleteReviewEntry,
  existingReviewCheck,
  getReviewById,
  saveUpdatedeReview,
} from "../db-call-repositories/book-review-db-repo.js";

// Controller to create a review for a book (requires authentication)
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: bookId } = req.params;
    const userId = req.user._id;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if the book exists
    const book = await getBookByIdEntry(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the user has already reviewed the book
    const existing = await existingReviewCheck(bookId, req.user._id);
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    // Create the review
    const review = await createReviewEntry(bookId, userId, rating, comment);

    // Send response with created review
    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    // Handle server error
    res
      .status(500)
      .json({ message: "Failed to submit review", error: err.message });
  }
};

// Controller to update a review (only by the review owner)
export const updateReview = async (req, res) => {
  try {
    const { ReviewId } = req.params;
    const { rating, comment } = req.body;

    // Fetch review by ID
    const review = await getReviewById(ReviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the logged-in user is the owner of the review
    if (review.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this review" });
    }

    // Update the review
    const updatedReview = await saveUpdatedeReview(review, rating, comment);

    // Send updated review in response
    res.status(200).json({ message: "Review updated", updatedReview });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: err.message });
  }
};

// Controller to delete a review (only by the review owner)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await getReviewById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the logged-in user is the owner of the review
    if (review.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    // Delete the review
    await deleteReviewEntry(review);

    // Send response after deletion
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: err.message });
  }
};
