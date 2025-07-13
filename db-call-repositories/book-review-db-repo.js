import mongoose from "mongoose";
import Review from "../models/book-review.model.js";

// Finds all reviews for a specific book with pagination and populates user and book fields
export const findReviewByBookId = async (bookId, offset, limit) => {
  const objectId = mongoose.Types.ObjectId.isValid(bookId)
    ? new mongoose.Types.ObjectId(bookId)
    : bookId;

  console.log("Converted objectId:", objectId);
  const reviews = await Review.find({ book: bookId })
    .populate("user", "username")
    .populate("book", "title author genre")
    .skip(offset)
    .limit(Number(limit));
  console.log("reviews", reviews);
  return reviews;
};

// Returns the total number of reviews for a specific book
export const getTotalReviews = async (bookId) => {
  return await Review.countDocuments({ book: bookId });
};

// Aggregates the average rating of reviews for a specific book
export const getAvgRatingAgg = async (bookId) => {
  const ratingAgg = await Review.aggregate([
    { $match: { book: bookId } },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);
  console.log("ratingAgg", ratingAgg);
  return ratingAgg;
};

// Checks if a user has already reviewed a particular book
export const existingReviewCheck = async (bookId, userId) => {
  const existing = await Review.findOne({ book: bookId, user: userId });
  return existing;
};

// Creates a new review entry for a book and populates book details
export const createReviewEntry = async (bookId, userId, rating, comment) => {
  const review = await Review.create({
    book: bookId,
    user: userId,
    rating: rating,
    comment: comment ? comment : "",
  });
  return review.populate("book", "title author genre");
};

// Finds a review by its ID and populates user and book information
export const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate("user", "username")
    .populate("book", "title author genre");
  return review;
};

// Updates the rating or comment of a review and populates book info after saving
export const saveUpdatedeReview = async (review, rating, comment) => {
  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();
  return review.populate("book", "title author genre");
};

// Deletes a specific review document
export const deleteReviewEntry = async (review) => {
  return await review.deleteOne();
};
