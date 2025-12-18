'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ServerTimer from '@/components/ServerTimer';

export default function UserProfile({ params }) {
  // --- PARAMS HANDLING ---
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- API CALL ---
  const fetchUser = async (userId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
          console.error("API URL missing in .env");
          return { success: false };
      }

      const res = await fetch(`${apiUrl}/${userId}`);
      if (!res.ok) return { success: false };
      return await res.json();
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const result = await fetchUser(id);
      setData(result);
      setLoading(false);
    }
    loadUser();
  }, [id]);

  // --- LOADING SKELETON ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="w-full max-w-lg bg-gray-900/50 border border-gray-800 rounded-3xl h-[500px] animate-pulse relative z-10">
          <div className="h-40 bg-gray-800 rounded-t-3xl"></div>
          <div className="w-28 h-28 bg-gray-700 rounded-full absolute top-24 left-8 border-4 border-gray-900"></div>
          <div className="mt-20 px-8 space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
            <div className="h-24 bg-gray-800 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- 404 NOT FOUND ---
  if (!data || !data.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-red-500 font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        <h1 className="text-6xl font-black mb-2 tracking-tighter glitch-effect">SYSTEM FAILURE</h1>
        <p className="text-red-400/70 mb-8 border border-red-900/50 px-4 py-2 rounded bg-red-950/30">
          ERROR 404: USER_ID NOT FOUND IN SECTOR {id}
        </p>
        <Link href="/" className="px-6 py-3 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded uppercase tracking-widest text-sm">
          Return to Base
        </Link>
      </div>
    );
  }

  const user = data.user;

  // --- MAIN PROFILE UI ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* 1. Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 2. Top Right Timer */}
      <ServerTimer time={`${data.time_ms || 0} ms`} />

      {/* 3. The CARD Container */}
      <div className="relative w-full max-w-lg group">
        
        {/* Glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        
        <div className="relative bg-[#0f0f11] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          
          {/* --- Cover Image --- */}
          <div className="h-40 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
             {/* ID Badge */}
             <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
               <span className="text-xs text-gray-400 font-mono tracking-widest">UID: #{user.id}</span>
             </div>
          </div>

          {/* --- Content Body --- */}
          <div className="px-8 pb-8">
            
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
              <div className="w-32 h-32 rounded-3xl bg-[#0f0f11] p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-4xl font-black text-white border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    {user.id}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex gap-2 mb-2">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs text-green-500 font-mono">ONLINE</span>
              </div>
            </div>

            {/* Name & Role Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">{user.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                 <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                   user.role === 'Admin' 
                   ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' 
                   : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                 }`}>
                   {user.role}
                 </span>
                 <span className="text-xs text-gray-500 font-mono">Ver. 2.0</span>
              </div>

              {/* ✨ NEW: EMAIL DISPLAY ADDED HERE ✨ */}
              <div className="flex items-center gap-2 pt-1 text-gray-400">
                {/* Mail Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-cyan-500">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                {/* Email Text (Monospace for tech feel) */}
                <span className="text-sm font-mono tracking-wide opacity-80 hover:text-cyan-300 transition-colors cursor-pointer">
                  {user.email || `user_${user.id}@gigadb.net`}
                </span>
              </div>
              
            </div>

            {/* Bio Section */}
            <div className="mt-6 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-[#161618] border border-gray-800 rounded-xl p-5">
                <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">User Biography</h3>
                <p className="text-gray-300 leading-relaxed font-light">
                  {user.bio || "No bio data available in the secure vault."}
                </p>
              </div>
            </div>

            {/* Stats / Performance */}
            <div className="mt-6 grid grid-cols-2 gap-3">
               <div className="bg-[#161618] border border-gray-800 rounded-lg p-3 flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Latency</span>
                  <span className="text-green-400 font-mono text-lg">{data.time_ms || 0} ms</span>
               </div>
               <div className="bg-[#161618] border border-gray-800 rounded-lg p-3 flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Storage</span>
                  <span className="text-blue-400 font-mono text-lg">RAM Disk</span>
               </div>
            </div>

            {/* Back Button */}
            <Link href="/" className="block mt-8">
              <button className="group w-full relative overflow-hidden bg-gray-800 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Back to Dashboard</span>
                </div>
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}