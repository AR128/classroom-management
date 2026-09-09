import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 relative overflow-hidden flex items-center justify-center selection:bg-blue-200 selection:text-blue-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-2xl w-full p-10 md:p-16 relative z-10 transition-all hover:shadow-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-[1.5rem] bg-linear-to-br from-blue-100 to-indigo-50 text-blue-600 shadow-inner border border-white">
             <svg className="w-10 h-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
          </div>

          <p className="mb-4 inline-flex rounded-full bg-blue-100/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 border border-blue-200/50 backdrop-blur-sm shadow-sm">
            Student Management
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Manage students with clarity.
          </h1>

          <p className="mt-5 text-lg text-slate-500 font-medium max-w-md">
            A seamless, modern dashboard for campus administration and student access.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full">
            <Link to="/admin" className="px-8 py-4 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95">
              Admin Portal
            </Link>
            <Link to="/student" className="px-8 py-4 rounded-full bg-white text-sm font-bold text-slate-700 shadow-md border border-slate-100 transition-all duration-300 hover:bg-slate-50 hover:shadow-lg hover:scale-105 active:scale-95">
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
