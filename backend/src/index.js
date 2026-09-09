import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Student Management API");
});

app.use("/admin", router);
app.use("/student", studentRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
