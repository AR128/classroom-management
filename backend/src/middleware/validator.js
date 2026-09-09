import { body, validationResult } from "express-validator";

export const loginRules = [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const studentLoginRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email."),
  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

export const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
