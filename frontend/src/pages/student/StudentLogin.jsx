import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAccessToken } from "../../utils/tokenStorage.js";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.token);
        navigate("/student/dashboard");
      } else {
        setError(data.message || (data.errors && data.errors[0]?.msg) || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex items-center justify-center px-5 py-8 selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-5xl overflow-hidden p-0 w-full relative z-10 transition-all hover:shadow-3xl">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="hidden md:flex flex-col justify-between bg-slate-900 p-8 text-white">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                Student Portal
              </span>

              <h1 className="mt-6 text-3xl font-bold leading-tight">
                Welcome to Student Console
              </h1>

              <p className="mt-4 max-w-sm text-sm text-slate-300">
                Access your academic details, view enrollment status, and stay connected with campus updates.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Default Password Note
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Your initial password is your registered phone number.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-9 md:p-10">
            <div className="mb-6">
              <Link to="/student" className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 hover:underline">
                &larr; Back to Student Access
              </Link>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Student Login
              </h2>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password <span className="text-xs font-normal text-slate-500">(Initial: your phone number)</span>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter phone number or password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="pt-3">
                <button type="submit" className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
