import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth, clearAccessToken } from "../../utils/tokenStorage.js";
import apiBaseUrl from "../../config/api.js";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetchWithAuth(`${apiBaseUrl}/student/dashboard`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load dashboard details", err);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    navigate("/student/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between rounded-3xl bg-white/70 backdrop-blur-md p-6 shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.fullName?.charAt(0) || "S"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Dashboard</h1>
              <p className="text-sm text-slate-500 font-medium">Welcome back, {user?.fullName || "Student"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="rounded-full bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Main Content Area */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Profile Card Widget */}
          <div className="group relative rounded-4xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-900/20 overflow-hidden hover:-translate-y-1 transition-all duration-300">
            {/* Inner decoration */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/20 p-3 backdrop-blur-sm mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Your Profile</h2>
              <p className="mt-3 text-blue-100/90 text-sm leading-relaxed max-w-xs">
                Access your academic records, contact information, and keep track of your personal details in one place.
              </p>
              
              <div className="mt-8">
                {user ? (
                  <Link
                    to={`/student/dashboard/${user.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-md transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <span>View My Profile</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                ) : (
                  <div className="inline-block h-11 w-40 animate-pulse rounded-full bg-white/30 backdrop-blur-md"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Add more widgets here in the future (e.g., Courses, Grades) */}
          <div className="rounded-4xl bg-white/70 backdrop-blur-md p-8 border border-slate-200/60 shadow-sm flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-700 mb-2">More Features Soon</h3>
             <p className="text-slate-500 text-sm max-w-xs">We are working on bringing your courses, grades, and announcements directly to your dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
