import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearAccessToken, fetchWithAuth } from "../../utils/tokenStorage";

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardRes = await fetchWithAuth(
          "http://localhost:3000/admin/dashboard",
          {
            method: "GET",
          },
        );

        const dashboardJson = await dashboardRes.json();
        console.log(dashboardJson);

        const countRes = await fetchWithAuth(
          "http://localhost:3000/admin/dashboard/add-student/student-count",
          {
            method: "GET",
          },
        );

        if (countRes.ok) {
          const countJson = await countRes.json();
          setStudentCount(countJson.count);
        }

        const statusRes = await fetchWithAuth(
          "http://localhost:3000/admin/dashboard/add-student/status-student",
          {
            method: "GET",
          },
        );

        if (statusRes.ok) {
          const statusJson = await statusRes.json();
          setActiveCount(statusJson.activeCount);
          setInactiveCount(statusJson.inactiveCount);
        }
      } catch (err) {
        console.error(err);
        clearAccessToken();
        navigate("/admin/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    clearAccessToken();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 transition-all hover:shadow-3xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-medium">
              Overview
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
              Welcome back
            </h1>
          </div>

          <button onClick={handleLogout} className="secondary-btn">
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="stat-card">
            <p className="text-sm text-slate-500">Total students</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">
              {studentCount}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-3 text-4xl font-bold text-emerald-600">
              {activeCount}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-slate-500">Inactive</p>
            <p className="mt-3 text-4xl font-bold text-amber-600">
              {inactiveCount}
            </p>
          </div>
          <Link
            to="/admin/dashboard/students"
            className="stat-card flex items-center justify-center bg-blue-50 border-blue-100 hover:bg-blue-100"
          >
            <span className="text-lg font-semibold text-blue-700">
              View Students
            </span>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
