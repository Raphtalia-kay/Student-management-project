# Student Management - Project Recap

## Project Setup

- Initialized a Node.js project with ES modules (`"type": "module"`)
- Installed core dependencies: `express`, `mongoose`, `dotenv`, `zod`
- Dev tool: `nodemon` for auto-restarting the server

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB Atlas (via Mongoose v9)
- **Validation:** Zod v4
- **Environment Variables:** dotenv

## Project Structure

```
student-management/
├── config/
│   └── db.js                         # MongoDB connection logic
├── models/
│   └── Student.js                    # Mongoose Student schema/model (now includes password field)
├── controllers/
│   ├── authController.js             # Registration, login, and profile logic
│   └── studentController.js          # Student CRUD logic
├── routes/
│   ├── authRoutes.js                 # Auth route definitions (register, login, profile)
│   └── studentRoutes.js              # Student route definitions
├── middleware/
│   ├── authMiddleware.js             # JWT token verification via cookies
│   └── validateMiddleware.js         # Zod schema validation middleware
├── dtos/
│   └── student.dto.js               # Request/Response DTOs
├── schema/
│   ├── auth.schema.js               # Zod schemas for register/login
│   └── student.schema.js            # Zod schemas for student CRUD
├── index.js                          # Entry point - Express server setup
├── dockerfile                        # Docker container config
├── .env                              # Environment variables (MONGO_URI, PORT, JWT_SECRET)
├── .gitignore                        # Ignores node_modules and .env
├── RECAP.md                          # This file
└── package.json
```

## What Was Done

### 1. Express Server (`index.js`)

- Created an Express app
- Loaded environment variables with `dotenv.config()` before anything else
- Connected to MongoDB before starting the server
- Added JSON body parser middleware (`express.json()`)
- Mounted student routes at `/students`
- Set up a root route (`GET /`) returning a welcome message
- Server runs on port 3000

### 2. Database Connection (`config/db.js`)

- Created a reusable `connectDB` function using Mongoose
- Connects to MongoDB Atlas using `MONGO_URI` from `.env`
- Logs success or exits the process on failure

### 3. Environment Variables (`.env`)

- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 3000)

### 4. Student Model (`models/Student.js`)

- Defined a Mongoose schema with the following fields:
  - `name` — String, required
  - `email` — String, required, unique, trimmed
  - `age` — Number, required
  - `major` — String, required, trimmed
- Enabled `timestamps: true` — Mongoose auto-adds `createdAt` and `updatedAt`
- Set `minimize: false` so empty objects are still stored

### 5. CRUD Operations (`controllers/studentController.js`)

Full Create, Read, Update, Delete functionality:

| Function          | What It Does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `getAllStudents`   | Returns all students with filtering, sorting, and pagination  |
| `getStudentById`  | Returns a single student by MongoDB `_id` (200 or 404)       |
| `createStudent`   | Validates via DTO, checks duplicate email, creates (201)      |
| `updateStudent`   | Finds by ID, updates via DTO with `findByIdAndUpdate` (200 or 404) |
| `deleteStudent`   | Finds by ID, deletes with `findByIdAndDelete` (200 or 404)   |

- All functions have try-catch blocks returning 500 on unexpected errors
- Responses go through `studentResponseDTO` to shape output consistently

### 6. Combined Endpoint — Search, Filter, Sort, Paginate (`getAllStudents`)

Previously there were separate endpoints for searching, filtering, sorting, and pagination. These have been **combined into a single `getAllStudents` controller** that supports all of these via query parameters on `GET /students/`:

- **Search by name:** `?name=john` — case-insensitive regex match
- **Filter by major:** `?major=CS` — exact match
- **Sort:** `?sort=name` or `?sort=-age` — allowed fields: `name`, `age`, `createdAt`. Prefix with `-` for descending. Default: `createdAt` descending
- **Pagination:** `?page=1&limit=5` — offset-based with `skip` and `limit`. Default limit: 2

All query params can be combined freely: `?name=john&major=CS&sort=-age&page=2&limit=10`

Response includes pagination metadata:
```json
{
  "currentPage": 1,
  "limit": 5,
  "totalStudents": 23,
  "totalPages": 5,
  "hasNextPages": true,
  "hasPrevPages": false,
  "students": [...]
}
```

### 7. Data Transfer Objects (`dtos/student.dto.js`)

Two DTO functions to separate internal data from external API shape:

- **`studentResponseDTO(student)`** — Maps a Mongoose document to a clean response object:
  - Renames `_id` to `id`
  - Returns only `id`, `name`, `email`, `age`, `major` (strips `__v`, `createdAt`, `updatedAt`, etc.)

- **`studentRequestDTO(body)`** — Sanitizes incoming request data:
  - Trims `name`, `email`, and `major` strings
  - Passes `age` through as-is
  - Uses optional chaining (`?.trim()`) so missing fields don't throw

### 8. Zod Validation Schemas (`schema/student.schema.js`)

Two Zod schemas for request validation:

- **`createStudentSchema`** — All fields required:
  - `name`: string, trimmed, 1–20 chars
  - `email`: valid email format
  - `age`: positive number
  - `major`: string, trimmed, 1–50 chars

- **`updateStudentSchema`** — All fields optional (partial update):
  - Same validation rules as create, but each field is `.optional()`
  - Allows PATCH-style updates where you only send the fields you want to change

### 9. Validation Middleware (`middleware/validateMiddleware.js`)

- **`validate(schema)`** — Higher-order function that returns Express middleware
- Takes a Zod schema as argument
- Uses `schema.safeParse(req.body)` for non-throwing validation
- On failure: returns 400 with an array of human-readable error messages from `result.error.issues`
- On success: replaces `req.body` with `result.data` (the parsed/transformed output from Zod) and calls `next()`
- This means Zod's transforms (like `.trim()`) are applied before the data reaches the controller

### 10. Routes (`routes/studentRoutes.js`)

| Method   | Path             | Middleware                        | Handler          | Purpose                     |
| -------- | ---------------- | --------------------------------- | ---------------- | --------------------------- |
| `GET`    | `/students/`     | —                                 | `getAllStudents`  | List all (filter/sort/page) |
| `GET`    | `/students/:id`  | —                                 | `getStudentById` | Get one by ID               |
| `POST`   | `/students/`     | `validate(createStudentSchema)`   | `createStudent`  | Create new student          |
| `PUT`    | `/students/:id`  | `validate(updateStudentSchema)`   | `updateStudent`  | Update by ID                |
| `DELETE` | `/students/:id`  | —                                 | `deleteStudent`  | Delete by ID                |

- Routes simplified from 8 down to 5 after combining search/filter/sort/pagination into `getAllStudents`
- POST and PUT routes run Zod validation middleware before reaching the controller
- Validation middleware replaces `req.body` with Zod-parsed data, ensuring clean input

### 11. Error Middleware (`middleware/errorMiddleware.js`)

- File created as a placeholder
- Not yet implemented — centralized error handling is a future task

## Key Concepts Covered

- RESTful API design (proper HTTP methods and status codes)
- MVC pattern (Model → Controller → Route separation)
- DTO pattern (Data Transfer Objects for request/response shaping)
- Schema validation with Zod (separate from Mongoose validation)
- Middleware composition (higher-order validate function)
- Mongoose schema design with validation and options
- MongoDB query operators (`$regex`, `$options`)
- Dynamic query building (filter objects constructed from optional params)
- Sorting with direction control (ascending/descending)
- Pagination with offset-based strategy (`skip` + `limit`)
- Pagination metadata (total pages, current page, next/prev indicators)
- ES module syntax throughout (`import`/`export`)
- Environment variable management with dotenv
- Async/await with try-catch error handling

### 12. Dockerization (`dockerfile`)

- Built a Dockerfile to containerize the Express app
- Uses `node:18` as the base image
- Sets `/app` as the working directory inside the container
- Copies `package*.json` first and runs `npm install` (leverages Docker layer caching — dependencies are only reinstalled when `package.json` changes)
- Copies all project files after installing deps
- Exposes port 3000
- Runs the app with `npm start` (which uses `nodemon index.js`)

### 13. User Registration with JWT (`controllers/authController.js` — `registerStudent`)

- Added `bcrypt` and `jsonwebtoken` as new dependencies
- **Registration flow:**
  1. Accepts `name`, `email`, `age`, `password`, `major` from `req.body`
  2. Checks all fields are present (returns 400 if missing)
  3. Checks for duplicate email via `Student.findOne({ email })`
  4. Hashes the password using `bcrypt.hash(password, 10)` — 10 salt rounds
  5. Creates the student in the database with the hashed password
  6. Returns 201 with the student data (excludes password from response)

### 14. User Login with JWT & Cookies (`controllers/authController.js` — `loginStudent`)

- **Login flow:**
  1. Accepts `email` and `password` from `req.body`
  2. Finds the student by email — returns generic "Invalid credentials" if not found (doesn't reveal whether email exists)
  3. Compares plaintext password against stored hash using `bcrypt.compare()`
  4. On success, generates a JWT token with `jwt.sign()`:
     - Payload: `{ id: student._id, email: student.email }`
     - Secret: `process.env.JWT_SECRET`
     - Expiry: `1m` (1 minute — short for testing purposes)
  5. Sets the token as an HTTP cookie named `cookietoken`:
     - `httpOnly: true` — not accessible via JavaScript (XSS protection)
     - `secure: false` — allows HTTP in development (should be `true` in production)
     - `sameSite: "lax"` — cookie sent on top-level navigations (CSRF protection)
     - `maxAge: 15 * 60 * 1000` — cookie expires in 15 minutes
  6. Returns 200 with student data (excludes password)

### 15. Auth Middleware (`middleware/authMiddleware.js`)

- Protects routes that require authentication
- **How it works:**
  1. Reads the JWT from `req.cookies.cookietoken` (requires `cookie-parser` middleware)
  2. If no token is found → returns 401 "No token provided"
  3. Verifies the token using `jwt.verify(token, process.env.JWT_SECRET)`
  4. If verification fails (expired or tampered) → returns 401 "Invalid or expired token"
  5. On success, attaches the decoded payload (`{ id, email }`) to `req.user` and calls `next()`
- Used on `GET /auth/profile` to identify the logged-in user

### 16. Get Profile (`controllers/authController.js` — `getProfile`)

- Protected route — requires valid JWT cookie (via `authMiddleware`)
- Finds the student by `req.user.id` (set by auth middleware)
- Uses `.select("-password")` to exclude the password hash from the response
- Returns the full student document (minus password) or 404 if not found

### 17. Auth Zod Schemas (`schema/auth.schema.js`)

Two schemas for validating auth requests:

- **`registerStudentSchema`** — validates registration input:
  - `name`: string, trimmed, 1–20 chars
  - `email`: valid email format
  - `age`: positive number
  - `major`: string, trimmed, 1–50 chars
  - `password`: string, min 8 characters

- **`loginStudentSchema`** — validates login input:
  - `email`: valid email format
  - `password`: string, min 8 characters

### 18. Auth Routes (`routes/authRoutes.js`)

| Method | Path             | Middleware                           | Handler           | Purpose              |
| ------ | ---------------- | ------------------------------------ | ----------------- | -------------------- |
| `POST` | `/auth/register` | `validate(registerStudentSchema)`    | `registerStudent` | Register new student |
| `POST` | `/auth/login`    | `validate(loginStudentSchema)`       | `loginStudent`    | Login & get cookie   |
| `GET`  | `/auth/profile`  | `authMiddleware`                     | `getProfile`      | Get logged-in user   |

### 19. Separation of Auth and Student Concerns

- Previously all logic was in `studentController.js` and `studentRoutes.js`
- Auth-related logic (register, login, profile) was moved to dedicated files:
  - `controllers/authController.js` — handles authentication logic
  - `routes/authRoutes.js` — defines auth endpoints under `/auth`
- Student routes (`/students`) remain focused on CRUD operations
- The `errorMiddleware.js` placeholder was removed in favor of `authMiddleware.js`

### 20. Cookie & CORS Setup (`index.js`)

- Added `cookie-parser` middleware to parse cookies from incoming requests
- Added `cors` middleware with specific configuration:
  - `origin`: allows `http://localhost:3001` and `http://localhost:3000` (for frontend dev)
  - `credentials: true` — allows cookies to be sent cross-origin (required for cookie-based auth)
- Auth routes mounted at `/auth`
- Port default changed from 3000 to 4000

### 21. Student Model Update (`models/Student.js`)

- Added `password` field to the Mongoose schema:
  - Type: String, required
  - Stores bcrypt-hashed passwords (never plaintext)

## New Dependencies Added

| Package         | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `bcrypt`        | Password hashing (native C++ bindings)           |
| `bcryptjs`      | Pure JS fallback for bcrypt (Docker compatibility)|
| `jsonwebtoken`  | JWT creation and verification                    |
| `cookie-parser` | Parse cookies from `req.cookies`                 |
| `cors`          | Cross-Origin Resource Sharing middleware          |

## New Environment Variables

- `JWT_SECRET` — Secret key used to sign and verify JWT tokens

## Key Concepts Covered (New)

- Authentication vs Authorization
- Password hashing with bcrypt (salting, cost factor)
- JWT (JSON Web Tokens) — stateless authentication
- Cookie-based token storage (httpOnly, secure, sameSite flags)
- CORS configuration for credentialed requests
- Route separation by domain (auth vs student)
- Protecting routes with middleware (auth guard pattern)
- Docker containerization (Dockerfile, layer caching, image building)
