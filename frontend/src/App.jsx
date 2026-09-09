import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import Student from "./pages/student/Student";
import AdLogIn from "./pages/admin/AdLogIn";
import ProtectedRoute from "./pages/ProtectedRoute";
import Dashboard from "./pages/admin/AdDashboard";
import AddStudent from "./pages/admin/AddStudent";
import AllStudents from "./pages/admin/AllStudents";
import "./App.css";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentInfo from "./pages/student/StudentInfo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdLogIn />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/add-student"
          element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/students"
          element={
            <ProtectedRoute>
              <AllStudents />
            </ProtectedRoute>
          }
        />
        <Route path="/student" element={<Student />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/dashboard/:id" element={
          <ProtectedRoute>
            <StudentInfo/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}
