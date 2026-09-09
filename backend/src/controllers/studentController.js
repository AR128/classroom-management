import { Student } from "../models/Student.js";
import cloudinary from "../config/cloudinaryConfig.js";
import bcrypt from "bcryptjs";
import { generateTokenPair } from "../utils/generateToken.js";

const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder: "students" });
  return { url: res.secure_url, public_id: res.public_id };
};

export const createStudent = async (req, res) => {
  try {
    if (typeof req.body.address === "string") {
      req.body.address = JSON.parse(req.body.address || "{}");
    }
    if (req.body.dob) req.body.dob = new Date(req.body.dob);

    if (req.file) {
      const img = await uploadToCloudinary(req.file);
      if (img) req.body.profilePicture = img;
    }

    if (!req.body.phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required." });
    }

    // Auto-set the student's initial password as their phone number hashed with bcrypt
    const hashedPassword = await bcrypt.hash(
      req.body.phoneNumber.toString().trim(),
      10,
    );
    req.body.password = hashedPassword;

    const student = await Student.create(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Student added successfully", student });
  } catch (error) {
    console.error(error);
    const message =
      error.code === 11000
        ? "Student with this email or phone already exists."
        : error.message;
    return res.status(400).json({ success: false, message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof req.body.address === "string") {
      req.body.address = JSON.parse(req.body.address || "{}");
    }
    if (req.body.dob) req.body.dob = new Date(req.body.dob);

    delete req.body.password;

    const student = await Student.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    if (req.file) {
      // upload new image
      const img = await uploadToCloudinary(req.file);
      if (img) {
        // delete old image if exists
        if (student.profilePicture?.public_id) {
          await cloudinary.uploader
            .destroy(student.profilePicture.public_id)
            .catch(() => {});
        }
        req.body.profilePicture = img;
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    const message =
      error.code === 11000
        ? "Student with this email or phone already exists."
        : error.message;
    return res.status(400).json({ success: false, message });
  }
};

export const getStudentOptions = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      gender: Student.schema.path("gender").enumValues,
      course: Student.schema.path("course").enumValues,
      status: Student.schema.path("status").enumValues,
    },
  });
};

export const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch student count",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });

    if (student.profilePicture?.public_id) {
      await cloudinary.uploader
        .destroy(student.profilePicture.public_id)
        .catch(() => {});
    }

    await Student.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Student deleted." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete student." });
  }
};

export const studentStatus = async (req, res) => {
  try {
    const activeCount = await Student.countDocuments({ status: "active" });
    const inactiveCount = await Student.countDocuments({ status: "inactive" });
    return res.status(200).json({
      success: true,
      activeCount,
      inactiveCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "unable to fetch status of Student",
    });
  }
};

export const allStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to fetch the student list",
    });
  }
};

export const loginStudent = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = (fullName || "").trim();

    // 1. Find user by email first
    let user = await Student.findOne({ email: cleanEmail });

    // 2. Fallback to searching by full name if email lookup yields nothing
    if (!user && cleanName) {
      user = await Student.findOne({
        fullName: {
          $regex: new RegExp(
            `^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        },
      });
    }

    if (!user) {
      console.log(
        "Student login failed: User not found for email:",
        cleanEmail,
        "fullName:",
        cleanName,
      );
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or credentials." });
    }

    let isMatch = false;

    // Check bcrypt hash if set
    if (user.password) {
      isMatch = await bcrypt.compare(password.trim(), user.password);
    }

    // Fallback: check phone number digits (handles +91 prefixes, spaces, or legacy records)
    if (!isMatch && user.phoneNumber) {
      const inputDigits = password.replace(/\D/g, "");
      const phoneDigits = user.phoneNumber.replace(/\D/g, "");

      if (
        inputDigits.length >= 6 &&
        (phoneDigits === inputDigits ||
          phoneDigits.endsWith(inputDigits) ||
          inputDigits.endsWith(phoneDigits))
      ) {
        isMatch = true;
        // Migrate/update stored hash
        user.password = await bcrypt.hash(password.trim(), 10);
        await user.save();
      }
    }

    if (!isMatch) {
      console.log(
        "Student login failed: Password mismatch for user:",
        user.email,
      );
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Password should be your phone number.",
      });
    }

    const { accessToken, refreshToken } = generateTokenPair(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: accessToken,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to your private dashboard!",
    user: req.user,
  });
};

export const student = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Authorization check to ensure a student can only view their own profile, 
    // unless you have separate role logic. Here we just rely on ID matching or token presence.
    if (req.user && req.user.role === 'student' && req.user.id !== id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const studentData = await Student.findById(id).select("-password -__v");
    
    if (!studentData) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.status(200).json({ success: true, student: studentData });
  } catch (error) {
    console.error("Error fetching student info:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
