import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../utils/tokenStorage.js";
import apiBaseUrl from "../../config/api.js";

export default function AdLogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.token);
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex items-center justify-center px-5 py-8 selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-5xl w-full overflow-hidden p-0 relative z-10 transition-all hover:shadow-3xl">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="hidden md:flex flex-col justify-between bg-slate-900 p-8 text-white">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
                Campus admin
              </span>

              <h1 className="mt-6 text-3xl font-bold leading-tight">
                Student Management Console
              </h1>

              <p className="mt-4 max-w-sm text-sm text-slate-300">
                Manage student records, track admissions, and stay organized
                from one place.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Trusted access
              </p>
              <p className="mt-2 text-xl font-semibold">Secure admin login</p>
            </div>
          </div>

          <div className="p-7 sm:p-9 md:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Admin Login
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Username
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>

              <div className="pt-2">
                <button type="submit" className="primary-btn w-full">
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
