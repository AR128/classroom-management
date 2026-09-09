import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearAccessToken,
  fetchWithAuth,
  getAccessToken,
} from "../../utils/tokenStorage";

export default function AddStudent() {
  const location = useLocation();
  const studentFromState = location.state?.student;
  const isEdit = Boolean(location.state?.student);
  const studentId = location.state?.studentId || null;
  const navigate = useNavigate();
  const defaultForm = {
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    course: "",
    status: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  };

  const [formData, setFormData] = useState(() => {
    if (studentFromState) {
      const dobValue = studentFromState.dob
        ? new Date(studentFromState.dob).toISOString().slice(0, 10)
        : "";

      return {
        ...defaultForm,
        ...studentFromState,
        dob: dobValue,
        address: {
          ...defaultForm.address,
          ...(studentFromState.address || {}),
        },
      };
    }

    return defaultForm;
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(
    () => studentFromState?.profilePicture?.url || null,
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setSelectedFile(null);
    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const [options, setOptions] = useState({
    gender: [],
    course: [],
    status: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = getAccessToken();
    if (!accessToken) {
      clearAccessToken();
      navigate("/admin/login");
      return;
    }

    const url = isEdit
      ? `http://localhost:3000/admin/dashboard/students/${studentId}`
      : "http://localhost:3000/admin/dashboard/add-student";

    const method = isEdit ? "PUT" : "POST";

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "address") fd.append("address", JSON.stringify(v));
        else fd.append(k, v ?? "");
      });
      if (selectedFile) fd.append("profileImage", selectedFile);

      const response = await fetchWithAuth(url, {
        method,
        body: fd,
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            (isEdit
              ? "Student updated successfully"
              : "Student added successfully"),
        );
        navigate("/admin/dashboard/students");
      } else {
        if (response.status === 401 || response.status === 403) {
          clearAccessToken();
          navigate("/admin/login");
          return;
        }
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      clearAccessToken();
      navigate("/admin/login");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCancel = () => {
    navigate("/admin/dashboard/students");
  };

  useEffect(() => {
    if (studentFromState) {
      const dobValue = studentFromState.dob
        ? new Date(studentFromState.dob).toISOString().slice(0, 10)
        : "";

      setFormData({
        ...defaultForm,
        ...studentFromState,
        dob: dobValue,
        address: {
          ...defaultForm.address,
          ...(studentFromState.address || {}),
        },
      });
      setPreview(studentFromState.profilePicture?.url || null);
      setSelectedFile(null);
    }
  }, [studentFromState]);

  useEffect(() => {
    const loadOptions = async () => {
      const token = getAccessToken();
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await fetchWithAuth(
          "http://localhost:3000/admin/dashboard/add-student/student-options",
          {
            method: "GET",
          },
        );
        const json = await res.json();
        if (res.ok) setOptions(json.data);
        else if (res.status === 401 || res.status === 403) {
          clearAccessToken();
          navigate("/admin/login");
        } else {
          console.error("Unable to load options:", json.message || json);
        }
      } catch (err) {
        console.error("Error loading student options", err);
        clearAccessToken();
        navigate("/admin/login");
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    return () => {
      if (
        preview &&
        typeof preview === "string" &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden flex items-start justify-center selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-5xl w-full p-8 md:p-12 relative z-10 transition-all hover:shadow-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600 font-medium">
              Student profile
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
              {isEdit ? "Edit Student" : "Add Student"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the details below
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-100 border flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400">No image</div>
              )}
            </div>

            <label className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profileImage"
              />
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="profileImage"
                  className="text-center cursor-pointer px-3 py-2 rounded-lg border border-dashed border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {preview ? "Change photo" : "Upload photo"}
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 underline"
                  >
                    Remove photo
                  </button>
                )}
                {selectedFile && (
                  <p className="text-xs text-slate-500 truncate">
                    {selectedFile.name}
                  </p>
                )}
              </div>
            </label>

            <p className="text-xs text-slate-500 text-center">
              JPG, JPEG, PNG — max 2MB
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
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
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Date of Birth
                </span>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Gender
                </span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input capitalize"
                >
                  <option value="">Select gender</option>
                  {options.gender.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Course
                </span>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select a course</option>
                  {options.course.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input capitalize"
                >
                  <option value="">Select status</option>
                  {options.status.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">
                Address
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street"
                  className="form-input"
                />
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="form-input"
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="form-input"
                />
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleChange}
                  placeholder="ZIP"
                  className="form-input"
                />
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="form-input md:col-span-2"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="primary-btn px-5 py-2">
                {isEdit ? "Update Student" : "Save Student"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
