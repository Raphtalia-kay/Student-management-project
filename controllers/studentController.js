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

const searchByName = async (req, res) => {
  try {
    const searchName = req.query.name;
    if (!searchName) {
      return res.status(400).json({ message: "Name query is required" });
    }
    const students = await Student.find({
      name: {
        $regex: searchName.trim(),
        $options: "i",
      },
    });

    res.status(201).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const filterByMajor = async (req, res) => {
  try {
    const { major, name } = req.query;
    const filter = {};
    if (major) {
      filter.major = major;
    }
    if (name) {
      filter.name = {
        $regex: name.trim(),
        $options: "i",
      };
    }
    const students = await Student.find(filter);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sortFilter = async (req, res) => {
  try {
    const { sort } = req.query;

    // default sort ( newest )
    let sortOption = {
      createdAt: -1,
    };
    if (sort) {
      const sortMode = ["name", "age", "createdAt"];
      let sortField = sort;
      let sortDirection = 1;
      if (sort.startsWith("-")) {
        sortField = sort.substring(1);
        sortDirection = -1;
      }
      if (sortMode.includes(sortField)) {
        sortOption = {
          [sortField]: sortDirection,
        };
      }
    }

    const students = await Student.find().sort(sortOption);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// pagination
const pagination = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 1;

    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 5;
    }

    let skip = (page - 1) * limit;
    const totalStudents = await Student.countDocuments();
    const students = await Student.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalStudents / limit);

    res.status(200).json({
      currentPage: page,
      limit: limit,
      totalStudents: totalStudents,
      totalPages: totalPages,
      hasNextPages: page < totalPages,
      hasPrevPages: page > 1,
      students: students,
    });
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
  searchByName,
  filterByMajor,
  sortFilter,
  pagination
};
