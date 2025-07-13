Here's your **revised and fully aligned `README.md`** with consistent formatting, corrected headers, and clear structure — especially tailored for a **MongoDB-based Book Review API**:

---

# 📚 Book Review API

A RESTful API for managing books and reviews. Authenticated users can add books and reviews, while the public can browse and search. Built using **Node.js**, **Express.js**, **MongoDB**, and **JWT-based authentication**.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mohammadamanpatel/book-review-assignment
cd book-review-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=your_jwt_expiry
```

### 4. Run the Project

```bash
npm run dev
```

Server will be running at:
👉 `http://localhost:5000`

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/v1`

---

### 🔐 Auth Routes `/auth`

| Method | Endpoint  | Description             |
| ------ | --------- | ----------------------- |
| POST   | `/signup` | Register a new user     |
| POST   | `/login`  | Login and get JWT token |

#### Example (Signup)

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

### 📘 Book Routes `/books`

| Method | Endpoint       | Auth | Description                          |
| ------ | -------------- | ---- | ------------------------------------ |
| POST   | `/`            | ✅    | Create a new book                    |
| GET    | `/`            | ❌    | Get all books with pagination/filter |
| GET    | `/:id`         | ❌    | Get a book by ID with reviews        |
| GET    | `/search/book` | ❌    | Search books by title or author      |

#### Example

```bash
POST /api/v1/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help",
  "description": "Practical strategies to form good habits"
}
```

```bash
GET /api/v1/books?author=james&genre=selfhelp&page=1&limit=5
```

---

### ✍️ Review Routes

| Method | Endpoint             | Auth | Description            |
| ------ | -------------------- | ---- | ---------------------- |
| POST   | `/books/:id/reviews` | ✅    | Add a review to a book |
| PUT    | `/reviews/:ReviewId` | ✅    | Update your review     |
| DELETE | `/reviews/:reviewId` | ✅    | Delete your review     |

#### Example

```bash
POST /api/v1/books/64f92b4e1fc0/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Very insightful!"
}
```

```bash
PUT /api/v1/reviews/64f92c73abc1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Updated after re-reading!"
}
```

---

## 🧱 Database Schema

### 🧑 User

```js
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### 📕 Book

```js
{
  _id: ObjectId,
  title: String,
  author: String,
  genre: String,
  description: String,
  createdBy: ObjectId (ref to User),
  createdAt: Date,
  updatedAt: Date
}
```

### ✍️ Review

```js
{
  _id: ObjectId,
  book: ObjectId (ref to Book),
  user: ObjectId (ref to User),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

> ✅ Each user can only submit one review per book — enforced via compound index `{ user: 1, book: 1 }`.

---

## 📌 Design Decisions & Assumptions

* JWT is used for stateless authentication (`Authorization: Bearer <token>`).
* Passwords are hashed securely using `bcrypt`.
* Public can browse/search books; review actions require authentication.
* Case- and space-insensitive filtering/search implemented with MongoDB `$regexMatch` and `$expr`.
* Reviews are paginated when viewing a book.
* Ratings are aggregated in real-time using MongoDB `$group` stage.

---

## 📂 Folder Structure (Simplified)

```
src/
│
├── controllers/
│   ├── auth-controllers.js
│   ├── book-controllers.js
│   └── book-review-controllers.js
│
├── db-call-repositories/
│   ├── book-db-repo.js
│   ├── book-review-db-repo.js
│   └── user-db-repo.js
│
├── middlewares/
│   └── auth-middleware.js
│
├── models/
│   ├── user.model.js
│   ├── book.model.js
│   └── book-review.model.js
│
├── routes/
│   ├── auth-routes.js
│   ├── book-routes.js
│   └── review-routes.js
│
├── utils/
│   ├── jwt-utils.js
│   └── compare-password-util.js
│
└── server.js / app.js
```

---

## 🧪 Testing

Use **Postman** or **curl** for testing routes.
Make sure to include the `Authorization` header with your JWT token for protected routes.

---

## 📌 Example `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/book-review-app
JWT_SECRET=supersecurejwtsecret
JWT_EXPIRY=1d
```

---

## 🧭 Entity Relationship Diagram (Mermaid)

<details>
<summary><strong>Click to expand Mermaid ER Diagram</strong></summary>

```mermaid
erDiagram
  USER ||--o{ BOOK : creates
  USER ||--o{ REVIEW : writes
  BOOK ||--o{ REVIEW : receives

  USER {
    ObjectId _id
    String username
    String email
    String password
  }

  BOOK {
    ObjectId _id
    String title
    String author
    String genre
    String description
    ObjectId createdBy // ref: USER
  }

  REVIEW {
    ObjectId _id
    ObjectId book      // ref: BOOK
    ObjectId user      // ref: USER
    Number rating
    String comment
  }
```

</details>


---
