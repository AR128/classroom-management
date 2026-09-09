import { Router } from "express";
import { studentLoginRules, validateInputs } from "../middleware/validator.js";
import { loginStudent, getDashboard, student } from "../controllers/studentController.js";
import verifyToken from "../middleware/auth.js";

const studentRouter = Router();

studentRouter.post("/login", studentLoginRules, validateInputs, loginStudent);

studentRouter.get("/dashboard", verifyToken, getDashboard);

studentRouter.get("/dashboard/:id", verifyToken, student);

export default studentRouter;
