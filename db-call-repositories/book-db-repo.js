import Book from "../models/book.model.js";

// Creates a new book entry in the database
export const createBookEntry = async ({
  title,
  author,
  genre,
  description,
  bookCreatorId,
}) => {
  const book = await Book.create({
    title: title,
    author: author,
    genre: genre,
    description: description,
    createdBy: bookCreatorId,
  });
  return book;
};

// Returns the total number of books based on optional author and genre filters
export const getTotalbooksCount = async (BooksQuery) => {
  const matchConditions = [];

  if (BooksQuery.author) {
    // Adds author filter condition after removing spaces and converting to lowercase
    matchConditions.push({
      $expr: {
        $regexMatch: {
          input: {
            $toLower: {
              $replaceAll: { input: "$author", find: " ", replacement: "" },
            },
          },
          regex: BooksQuery.author.replace(/\s+/g, "").toLowerCase(),
        },
      },
    });
  }

  if (BooksQuery.genre) {
    // Adds genre filter condition after removing spaces and converting to lowercase
    matchConditions.push({
      $expr: {
        $regexMatch: {
          input: {
            $toLower: {
              $replaceAll: { input: "$genre", find: " ", replacement: "" },
            },
          },
          regex: BooksQuery.genre.replace(/\s+/g, "").toLowerCase(),
        },
      },
    });
  }

  // Uses aggregation to match documents based on conditions and count them
  const result = await Book.aggregate([
    {
      $match: matchConditions.length > 0 ? { $and: matchConditions } : {},
    },
    {
      $count: "total",
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Returns list of books with optional filters, pagination, and sorting
export const getAllBooksEntry = async (BooksQuery, offset, limit) => {
  const matchConditions = [];

  if (BooksQuery.author) {
    // Adds author filter condition after removing spaces and converting to lowercase
    matchConditions.push({
      $expr: {
        $regexMatch: {
          input: {
            $toLower: {
              $replaceAll: { input: "$author", find: " ", replacement: "" },
            },
          },
          regex: BooksQuery.author.replace(/\s+/g, "").toLowerCase(),
        },
      },
    });
  }

  if (BooksQuery.genre) {
    // Adds genre filter condition after removing spaces and converting to lowercase
    matchConditions.push({
      $expr: {
        $regexMatch: {
          input: {
            $toLower: {
              $replaceAll: { input: "$genre", find: " ", replacement: "" },
            },
          },
          regex: BooksQuery.genre.replace(/\s+/g, "").toLowerCase(),
        },
      },
    });
  }

  const books = await Book.aggregate([
    // Matches filtered books, sorts by creation time in descending order, and applies pagination
    {
      $match: matchConditions.length > 0 ? { $and: matchConditions } : {},
    },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: Number(limit) },
  ]);

  return books;
};

// Returns a single book by its ID and populates the creator's username
export const getBookByIdEntry = async (bookId) => {
  const book = await Book.findById(bookId).populate("createdBy", "username");
  return book;
};

// Searches books by title or author using a case-insensitive match after removing spaces
export const getBookBySearch = async (normalizedQuery) => {
  const books = await Book.find({
    $or: [
      {
        $expr: {
          $regexMatch: {
            input: {
              $replaceAll: { input: "$title", find: " ", replacement: "" },
            },
            regex: normalizedQuery,
            options: "i",
          },
        },
      },
      {
        $expr: {
          $regexMatch: {
            input: {
              $replaceAll: { input: "$author", find: " ", replacement: "" },
            },
            regex: normalizedQuery,
            options: "i",
          },
        },
      },
    ],
  });
  return books;
};
