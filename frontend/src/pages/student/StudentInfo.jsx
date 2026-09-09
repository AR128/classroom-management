import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchWithAuth } from "../../utils/tokenStorage.js";
import apiBaseUrl from "../../config/api.js";

export default function StudentInfo() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await fetchWithAuth(`${apiBaseUrl}/student/dashboard/${id}`);
        const data = await res.json();
        if (data.success) {
          setStudent(data.student);
        } else {
          // If unauthorized or not found, navigate back or handle gracefully
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch student details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-24 w-24 mb-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Profile Not Found</h2>
        <p className="mt-3 text-slate-500 max-w-md">We couldn't locate the requested student profile or you might not have permission to view it.</p>
        <Link 
          to="/student/dashboard" 
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/30"
        >
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative Banner Background */}
      <div className="h-64 w-full bg-linear-to-br from-indigo-700 via-blue-600 to-sky-500 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
         <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
         
         <div className="mx-auto max-w-5xl px-6 md:px-12 pt-8 relative z-10">
            <Link 
              to="/student/dashboard" 
              className="inline-flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black/40 border border-white/10"
            >
              &larr; Back to Dashboard
            </Link>
         </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-12 -mt-32 relative z-20">
        <div className="rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/60 border border-slate-100">
          
          <div className="px-8 pb-12 sm:px-14">
            
            {/* Avatar & Status Row */}
            <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="group relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl transition hover:scale-105 duration-300">
                {student.profilePicture?.url ? (
                  <img src={student.profilePicture.url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-4xl font-black text-slate-400">
                    {student.fullName?.charAt(0) || "S"}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm border ${student.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'}`}>
                  <span className={`h-2 w-2 rounded-full ${student.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {student.status || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Header Details */}
            <div className="mb-12 border-b border-slate-100 pb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{student.fullName}</h1>
              <p className="mt-3 text-lg font-medium text-blue-600 flex items-center gap-2">
                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                {student.course || "No Course Assigned"}
              </p>
            </div>

            {/* Information Grid */}
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              
              {/* Contact Information */}
              <div className="rounded-3xl bg-slate-50/50 p-6 sm:p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Contact Details</h3>
                </div>
                <div className="space-y-5">
                  <div className="group">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors break-all">{student.email}</p>
                  </div>
                  <div className="group">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Phone Number</p>
                    <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{student.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="rounded-3xl bg-slate-50/50 p-6 sm:p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Personal Info</h3>
                </div>
                <div className="space-y-5">
                  <div className="group">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Gender</p>
                    <p className="font-semibold text-slate-800 capitalize">{student.gender || 'Not specified'}</p>
                  </div>
                  <div className="group">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Date of Birth</p>
                    <p className="font-semibold text-slate-800">
                      {student.dob ? new Date(student.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="lg:col-span-2 rounded-3xl bg-slate-50/50 p-6 sm:p-8 border border-slate-100 hover:shadow-md transition-shadow mt-2">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Address</h3>
                </div>
                
                {student.address ? (
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1 group">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Street</p>
                      <p className="font-medium text-slate-800">{student.address.street || '—'}</p>
                    </div>
                    <div className="group">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">City</p>
                      <p className="font-medium text-slate-800">{student.address.city || '—'}</p>
                    </div>
                    <div className="group">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">State</p>
                      <p className="font-medium text-slate-800">{student.address.state || '—'}</p>
                    </div>
                    <div className="group">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Zip / Country</p>
                      <p className="font-medium text-slate-800">{student.address.zip || '—'} / {student.address.country || '—'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-500 italic">No address information provided.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
