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
│   └── Student.js                    # Mongoose Student schema/model
├── controllers/
│   └── studentController.js          # All student-related logic
├── routes/
│   └── studentRoutes.js              # Express route definitions
├── middleware/
│   ├── errorMiddleware.js            # (Placeholder - not yet implemented)
│   └── validateMiddleware.js         # Zod schema validation middleware
├── dtos/
│   └── student.dto.js               # Request/Response DTOs
├── schema/
│   └── student.schema.js            # Zod validation schemas
├── index.js                          # Entry point - Express server setup
├── .env                              # Environment variables (MONGO_URI, PORT)
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
