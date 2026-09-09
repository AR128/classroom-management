import express from "express";
import jwt from "jsonwebtoken";
import { getDashboard, loginUser } from "../controllers/authController.js";
import verifyToken from "../middleware/auth.js";
import { loginRules, validateInputs } from "../middleware/validator.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { upload } from "../middleware/upload.js";
import {
  createStudent,
  getStudentOptions,
  getStudentCount,
  studentStatus,
  allStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// Login Endpoint
router.post("/login", loginRules, validateInputs, loginUser);

// Protected Endpoint
router.get("/dashboard", verifyToken, getDashboard);

//Adding Student
router.post(
  "/dashboard/add-student",
  verifyToken,
  upload.single("profileImage"),
  createStudent,
);

//Enum options exposure
router.get(
  "/dashboard/add-student/student-options",
  verifyToken,
  getStudentOptions,
);

//total number of students count
router.get(
  "/dashboard/add-student/student-count",
  verifyToken,
  getStudentCount,
);

//status of students
router.get("/dashboard/add-student/status-student", verifyToken, studentStatus);

//displaying all students
router.get("/dashboard/students", verifyToken, allStudents);

//to edit the information about the students
router.put(
  "/dashboard/students/:id",
  verifyToken,
  upload.single("profileImage"),
  updateStudent,
);

//to delete the student from the database
router.delete("/dashboard/students/:id", verifyToken, deleteStudent);

// Refresh Endpoint
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found.",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    });

    return res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid.",
    });
  }
});

export default router;
