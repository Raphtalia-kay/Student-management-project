import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerStudent = async (req, res) => {
  try {
    const { name, email, age, password, major } = req.body;
    if (!name || !email || !age || !password || !major) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      age,
      major,
      password: hashpassword,
    });
    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        major: student.major,
        age: student.age,
      },
    });
  } catch (error) {
   
    res.status(500).json({ message: error.message });
  }
};

const loginStudent = async (req, res) => {
  try {
    console.log("hello");
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accesstoken = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role : student.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refreshtoken = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role : student.role
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        major: student.major,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role : decoded.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accesstoken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "Access Token refreshed" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Refresh token" });
  }
};
const logoutStudent = (req, res) => {
  res.clearCookie("accesstoken");
  res.clearCookie("refreshtoken");
  res.status(200).json({ message: "Logged out successfully" });
};
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminDashboard = (req,res) => {
  res.status(200).json({message : "Welcome to the admin dashboard"})
}
export default {
  registerStudent,
  loginStudent,
  getProfile,
  logoutStudent,
  refreshAccessToken,
  adminDashboard
};
