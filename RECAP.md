# Student Management - Project Recap

## Project Setup

- Initialized a Node.js project with ES modules (`"type": "module"`)
- Installed core dependencies: `express`, `mongoose`, `dotenv`
- Dev tool: `nodemon` for auto-restarting the server

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB Atlas (via Mongoose v9)
- **Environment Variables:** dotenv

## Project Structure

```
student-management/
├── config/
│   └── db.js                    # MongoDB connection logic
├── models/
│   └── Student.js               # Mongoose Student schema/model
├── controllers/
│   └── studentController.js     # All student-related logic
├── routes/
│   └── studentRoutes.js         # Express route definitions
├── middleware/
│   └── errorMiddleware.js       # (Placeholder - not yet implemented)
├── index.js                     # Entry point - Express server setup
├── .env                         # Environment variables (MONGO_URI, PORT)
├── .gitignore                   # Ignores node_modules and .env
├── RECAP.md                     # This file
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
| `getAllStudents`   | Returns all students (200)                                    |
| `getStudentById`  | Returns a single student by MongoDB `_id` (200 or 404)       |
| `createStudent`   | Validates all fields, checks duplicate email, creates (201)   |
| `updateStudent`   | Finds by ID, updates with `findByIdAndUpdate` (201 or 404)   |
| `deleteStudent`   | Finds by ID, deletes with `findByIdAndDelete` (201 or 404)   |

- All functions have try-catch blocks returning 500 on unexpected errors

### 6. Search by Name (`searchByName`)

- Endpoint: `GET /students/search?name=john`
- Uses MongoDB `$regex` with `$options: "i"` for case-insensitive matching
- Trims the search term before querying
- Returns matching students or 404 if `name` query param is missing

### 7. Filter by Major (`filterByMajor`)

- Endpoint: `GET /students/filter?major=CS&name=john`
- Both `major` and `name` are optional query params
- Builds a dynamic filter object — can combine both or use either alone
- Name filtering is case-insensitive via regex

### 8. Sorting (`sortFilter`)

- Endpoint: `GET /students/?sort=name` or `GET /students/?sort=-age`
- Allowed sort fields: `name`, `age`, `createdAt`
- Prefix with `-` for descending order (e.g., `-age` = oldest first)
- Default sort: `createdAt` descending (newest first)
- Invalid sort fields are ignored and fall back to default

### 9. Routes (`routes/studentRoutes.js`)

| Method   | Path               | Handler          | Purpose              |
| -------- | ------------------ | ---------------- | -------------------- |
| `GET`    | `/students/`       | `sortFilter`     | List all (sorted)    |
| `GET`    | `/students/search` | `searchByName`   | Search by name       |
| `GET`    | `/students/filter` | `filterByMajor`  | Filter by major/name |
| `GET`    | `/students/:id`    | `getStudentById` | Get one by ID        |
| `POST`   | `/students/`       | `createStudent`  | Create new student   |
| `PUT`    | `/students/:id`    | `updateStudent`  | Update by ID         |
| `DELETE` | `/students/:id`    | `deleteStudent`  | Delete by ID         |

> **Route order matters:** Specific string routes (`/search`, `/filter`) are defined before the `/:id` param route so Express matches them first.

### 10. Error Middleware (`middleware/errorMiddleware.js`)

- File created as a placeholder
- Not yet implemented — centralized error handling is a future task

## Key Concepts Covered

- RESTful API design (proper HTTP methods and status codes)
- MVC pattern (Model → Controller → Route separation)
- Mongoose schema design with validation and options
- MongoDB query operators (`$regex`, `$options`)
- Dynamic query building (filter objects constructed from optional params)
- Sorting with direction control (ascending/descending)
- Route ordering in Express (specific before parameterized)
- ES module syntax throughout (`import`/`export`)
- Environment variable management with dotenv
- Async/await with try-catch error handling
