import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { generateTokenPair } from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await Admin.findOne({ username, email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
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
