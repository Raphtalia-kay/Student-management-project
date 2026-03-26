import Student from "../models/Student.js";

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, age, major } = req.body;
    if (!name || !email || !age || !major) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const student = await Student.create({
      name,
      email,
      age,
      major,
    });
    res.status(201).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Studnet not found" });
    }
    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(201).json(updateStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    res.status(201).json(deleteStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
