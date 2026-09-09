import { Link } from "react-router-dom";

export default function Student() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden flex items-center justify-center selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-3xl w-full p-8 md:p-14 relative z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-200/50">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold bg-indigo-50/50 inline-block px-3 py-1 rounded-full border border-indigo-100 backdrop-blur-sm">
            Student Access
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome
          </h1>
          <p className="mt-4 text-lg text-slate-500 font-medium">
            Log in to view your profile and manage your academic details.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/student/login"
            className="group relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-linear-to-br from-indigo-50 to-blue-50/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
               <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-indigo-600 shadow-sm border border-indigo-50">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-500">Access Portal</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              Student Login
            </div>
          </Link>

          <Link
            to="/"
            className="group rounded-[2rem] border border-slate-200 bg-white/50 p-8 text-left transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 border border-slate-100 shadow-sm">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Return</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">Home</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
