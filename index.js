import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
await connectDB();

const PORT = process.env.PORT || 4000;
const limiter = rateLimit({
  windowMs : 15 * 60 *1000,
  limit : 20,
  standardHeaders : "draft-8",
  legacyHeaders : false,
  message : "too many requests from this IP, please try again after 15 minutes"
})
app.use(express.json());
app.use(helmet())
app.use(limiter)
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
