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
│   └── db.js          # MongoDB connection logic
├── index.js           # Entry point - Express server setup
├── .env               # Environment variables (MONGO_URI, PORT)
└── package.json
```

## What Was Done

### 1. Express Server (`index.js`)

- Created an Express app
- Loaded environment variables with `dotenv.config()` before anything else
- Connected to MongoDB before starting the server
- Added JSON body parser middleware (`express.json()`)
- Set up a root route (`GET /`) returning a welcome message
- Server runs on port 3000

### 2. Database Connection (`config/db.js`)

- Created a reusable `connectDB` function using Mongoose
- Connects to MongoDB Atlas using `MONGO_URI` from `.env`
- Logs success or exits the process on failure

### 3. Environment Variables (`.env`)

- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 3000)
