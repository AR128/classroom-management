import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  clearAccessToken,
  fetchWithAuth,
  getAccessToken,
} from "../../utils/tokenStorage";
import apiBaseUrl from "../../config/api.js";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import dropdownIcon from "../../assets/dropdown.svg";
import goBack from "../../assets/arrowLeft.svg";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState({
    gender: [],
    course: [],
    status: [],
  });
  const [courseFilter, setCourseFilter] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const courseButtonRef = useRef(null);
  const courseMenuRef = useRef(null);
  const [courseMenuPos, setCourseMenuPos] = useState(null);
  const statusButtonRef = useRef(null);
  const statusMenuRef = useRef(null);
  const [statusMenuPos, setStatusMenuPos] = useState(null);
  const rowsPerPage = 8;

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const name = (s.fullName || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      const matchesQuery = !q || name.includes(q) || email.includes(q);
      const cf = courseFilter ? courseFilter.toLowerCase() : "";
      const sf = statusFilter ? statusFilter.toLowerCase() : "";
      const matchesCourse = !cf || (s.course || "").toLowerCase() === cf;
      const matchesStatus = !sf || (s.status || "").toLowerCase() === sf;
      return matchesQuery && matchesCourse && matchesStatus;
    });
  }, [students, query, courseFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / rowsPerPage),
  );
  const pagedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (direction) => {
    setCurrentPage((page) => {
      if (direction === "prev") return Math.max(1, page - 1);
      return Math.min(totalPages, page + 1);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return;
    }
    try {
      const res = await fetchWithAuth(
        `${apiBaseUrl}/admin/dashboard/students/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete student.");
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      clearAccessToken();
      setError(err.message || "Unable to delete student.");
    }
  };

  const courses = options.course || [];
  const status = options.status || [];

  useEffect(() => {
    const loadStudents = async () => {
      const token = getAccessToken();
      if (!token) {
        setError("Not authenticated. Please log in again.");
        return;
      }

      try {
        const response = await fetchWithAuth(
          `${apiBaseUrl}/admin/dashboard/students`,
          {
            method: "GET",
          },
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch students.");
        }

        setStudents(data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        clearAccessToken();
        setError(err.message || "Unable to load student list.");
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    const loadOptions = async () => {
      const token = getAccessToken();
      if (!token) return;
      try {
        const res = await fetchWithAuth(
          `${apiBaseUrl}/admin/dashboard/add-student/student-options`,
          {
            method: "GET",
          },
        );
        const json = await res.json();
        if (res.ok && json.data) setOptions(json.data);
      } catch (err) {
        console.error("Failed to load options:", err);
        clearAccessToken();
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (!showCourseMenu && !showStatusMenu) return;
    const onDocClick = (e) => {
      const target = e.target;
      const clickedInsideCourse =
        courseMenuRef.current?.contains(target) ||
        courseButtonRef.current?.contains(target);
      const clickedInsideStatus =
        statusMenuRef.current?.contains(target) ||
        statusButtonRef.current?.contains(target);
      if (!clickedInsideCourse) setShowCourseMenu(false);
      if (!clickedInsideStatus) setShowStatusMenu(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowCourseMenu(false);
        setShowStatusMenu(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [showCourseMenu, showStatusMenu]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden selection:bg-blue-200 selection:text-blue-900 flex justify-center items-center">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="mx-auto max-w-7xl w-full relative z-10">
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 transition-all hover:shadow-3xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link
                to="/admin/dashboard"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 transition hover:text-blue-700"
              >
                <img
                  src={goBack}
                  alt="Go Back"
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                />
                Student Directory
              </Link>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                All Students
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative block">
                <span className="sr-only">Search students</span>
                <input
                  type="search"
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-72 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 pl-10 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  aria-label="Search students by name or email"
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 1 0 3.54 9.4l2.96 2.96 1.06-1.06-2.96-2.96A5.5 5.5 0 0 0 9 3.5Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </label>

              <Link
                to="/admin/dashboard/add-student"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                + Add Student
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {students.length === 0 && !error ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              <div className="max-w-xl mx-auto">
                <h3 className="text-lg font-semibold text-slate-900">
                  No students yet
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  You can add new students to the directory. Use the Add Student
                  button to create a profile with a photo.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    to="/admin/dashboard/add-student"
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                  >
                    Add Student
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] ">
                          Name
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                          Email
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                          Phone
                        </th>
                        <th className="relative px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                          <div className="flex items-center gap-2">
                            <button
                              ref={courseButtonRef}
                              onClick={() => {
                                if (showCourseMenu) {
                                  setShowCourseMenu(false);
                                  return;
                                }
                                setShowStatusMenu(false);
                                if (courseButtonRef.current) {
                                  const rect =
                                    courseButtonRef.current.getBoundingClientRect();
                                  setCourseMenuPos({
                                    top: rect.bottom + window.scrollY,
                                    left: rect.left + window.scrollX,
                                  });
                                }
                                setShowCourseMenu(true);
                              }}
                              aria-expanded={showCourseMenu}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              Course
                              <img
                                src={dropdownIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
                            </button>
                          </div>

                          {showCourseMenu &&
                            courseMenuPos &&
                            createPortal(
                              <div
                                ref={courseMenuRef}
                                style={{
                                  position: "absolute",
                                  top: courseMenuPos.top,
                                  left: courseMenuPos.left,
                                  width: 180,
                                }}
                                className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
                              >
                                <button
                                  className="w-full border-b border-slate-100 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                                  onClick={() => {
                                    setCourseFilter("");
                                    setCurrentPage(1);
                                    setShowCourseMenu(false);
                                  }}
                                >
                                  All courses
                                </button>
                                {courses.map((c) => (
                                  <button
                                    key={c}
                                    className={`w-full px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 ${courseFilter === c ? "bg-slate-100 font-semibold text-slate-800" : "text-slate-600"}`}
                                    onClick={() => {
                                      setCourseFilter(c);
                                      setCurrentPage(1);
                                      setShowCourseMenu(false);
                                    }}
                                  >
                                    {c}
                                  </button>
                                ))}
                              </div>,
                              document.body,
                            )}
                        </th>
                        <th className="relative px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                          <div className="flex items-center gap-2">
                            <button
                              ref={statusButtonRef}
                              onClick={() => {
                                if (showStatusMenu) {
                                  setShowStatusMenu(false);
                                  return;
                                }
                                setShowCourseMenu(false);
                                if (statusButtonRef.current) {
                                  const rect =
                                    statusButtonRef.current.getBoundingClientRect();
                                  setStatusMenuPos({
                                    top: rect.bottom + window.scrollY,
                                    left: rect.left + window.scrollX,
                                  });
                                }
                                setShowStatusMenu(true);
                              }}
                              aria-expanded={showStatusMenu}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              Status
                              <img
                                src={dropdownIcon}
                                width={16}
                                height={16}
                                alt=""
                              />
                            </button>
                          </div>
                          {showStatusMenu &&
                            statusMenuPos &&
                            createPortal(
                              <div
                                ref={statusMenuRef}
                                style={{
                                  position: "absolute",
                                  top: statusMenuPos.top,
                                  left: statusMenuPos.left,
                                  width: 180,
                                }}
                                className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
                              >
                                <button
                                  className="w-full border-b border-slate-100 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                                  onClick={() => {
                                    setStatusFilter("");
                                    setCurrentPage(1);
                                    setShowStatusMenu(false);
                                  }}
                                >
                                  All Status
                                </button>
                                {status.map((c) => (
                                  <button
                                    key={c}
                                    className={`w-full px-3 py-2.5 text-left text-sm capitalize transition hover:bg-slate-50 ${statusFilter === c ? "bg-slate-100 font-semibold text-slate-800" : "text-slate-600"}`}
                                    onClick={() => {
                                      setStatusFilter(c);
                                      setCurrentPage(1);
                                      setShowStatusMenu(false);
                                    }}
                                  >
                                    {c}
                                  </button>
                                ))}
                              </div>,
                              document.body,
                            )}
                        </th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                          Options
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedStudents.map((student) => (
                        <tr
                          key={student._id}
                          className="border-t border-slate-200 transition hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                {student.profilePicture?.url ? (
                                  <img
                                    src={student.profilePicture.url}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-semibold text-slate-600">
                                    {(student.fullName || "")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join("") || "?"}
                                  </span>
                                )}
                              </div>
                              <div className="font-semibold capitalize text-slate-900">
                                {student.fullName}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 text-slate-600">
                            <a
                              href={`mailto:${student.email}`}
                              className="hover:text-blue-600"
                            >
                              {student.email}
                            </a>
                          </td>
                          <td className="px-5 py-5 text-slate-600">
                            <a
                              href={`tel:${student.phoneNumber}`}
                              aria-label={`Call ${student.fullName}`}
                              className="hover:text-blue-600"
                            >
                              {student.phoneNumber}
                            </a>
                          </td>
                          <td className="px-5 py-5 text-slate-600">
                            {student.course}
                          </td>
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                student.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center justify-center gap-3">
                              <Link
                                to="/admin/dashboard/add-student"
                                state={{
                                  student,
                                  isEdit: true,
                                  studentId: student._id,
                                }}
                                aria-label={`Edit ${student.fullName}`}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <img
                                  src={editIcon}
                                  alt="Edit student"
                                  width={18}
                                  height={18}
                                />
                              </Link>
                              <button
                                onClick={() => handleDelete(student._id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                aria-label={`Delete ${student.fullName}`}
                              >
                                <img
                                  src={deleteIcon}
                                  alt="Delete Student"
                                  width={18}
                                  height={18}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                <p>
                  Showing {pagedStudents.length} of {filteredStudents.length}{" "}
                  results (total {students.length} students).
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllStudents;
