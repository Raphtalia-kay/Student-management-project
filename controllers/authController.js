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
    const student = Student.create({
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login Successfully",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        major: student.major,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
export default {
  registerStudent,
  loginStudent,
  getProfile,
};
