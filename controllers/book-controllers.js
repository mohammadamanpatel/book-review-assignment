import mongoose from "mongoose";
import {
  createBookEntry,
  getAllBooksEntry,
  getBookByIdEntry,
  getBookBySearch,
  getTotalbooksCount,
} from "../db-call-repositories/book-db-repo.js";
import {
  findReviewByBookId,
  getAvgRatingAgg,
  getTotalReviews,
} from "../db-call-repositories/book-review-db-repo.js";

// Controller to create a new book
export const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    // Check for required fields
    if (!title || !author || !genre) {
      return res
        .status(400)
        .json({ message: "Title, author, and genre are required" });
    }

    // Get the ID of the user who is creating the book
    const bookCreatorId = req.user._id;

    // Call DB function to create the book
    const book = await createBookEntry({
      title,
      author,
      genre,
      description,
      bookCreatorId,
    });

    // Send response with created book
    res.status(201).json({ message: "Book created", book });
  } catch (err) {
    // Handle server error
    res
      .status(500)
      .json({ message: "Failed to create book", error: err.message });
  }
};

// Controller to get all books with optional filters and pagination
export const getAllBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    // Build query object based on filters
    const BooksQuery = {};
    if (author) BooksQuery.author = author;
    if (genre) BooksQuery.genre = genre;

    const offset = (page - 1) * limit;

    // Get total number of books matching the filter
    const total = await getTotalbooksCount(BooksQuery);

    // Get paginated list of books
    const books = await getAllBooksEntry(BooksQuery, offset, limit);

    // Send response with results
    res.status(200).json({ total, page: Number(page), books });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: err.message });
  }
};

// Controller to get a book by its ID with its reviews and average rating
export const getBookById = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Get the book by ID
    const book = await getBookByIdEntry(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const offset = (page - 1) * limit;

    // Fetch paginated reviews for the book
    const reviews = await findReviewByBookId(book._id, offset, limit);

    // Get total number of reviews
    const totalReviews = await getTotalReviews(book._id);

    // Get average rating for the book
    const ratingAgg = await getAvgRatingAgg(book._id);
    const avgRating = ratingAgg.length ? ratingAgg[0].avg.toFixed(1) : null;

    // Send complete book detail with reviews and rating
    res.status(200).json({
      book,
      averageRating: avgRating || "No ratings yet",
      reviews,
      totalReviews,
      reviewPage: Number(page),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch book details", error: err.message });
  }
};

// Controller to search books by title or author (case-insensitive, space-insensitive)
export const searchBooks = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // If no query provided, return error
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Normalize the query by removing spaces and converting to lowercase
    const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();

    // Perform DB search using normalized query
    const results = await getBookBySearch(normalizedQuery);

    // Send matched results
    res.status(200).json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
