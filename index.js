import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
await connectDB();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/students", studentRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to our express app");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
