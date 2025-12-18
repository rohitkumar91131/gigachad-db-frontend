'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ServerTimer from '@/components/ServerTimer';

export default function Home() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH FUNCTION ---
  async function fetchData(pageNum) {
    // Env variable se URL lo
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; 
    
    if (!apiUrl) {
        console.error("API URL not found in .env");
        return null;
    }

    const res = await fetch(`${apiUrl}/users/page/${pageNum}`);
    
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  // --- DEBOUNCED EFFECT ---
  useEffect(() => {
    let isMounted = true;
    let timer;

    async function loadData() {
      setLoading(true);
      
      // 500ms ka wait (Debounce) taaki user ke rukne par hi call jaye
      timer = setTimeout(async () => {
        try {
          const result = await fetchData(page);
          if (isMounted && result) {
            setData(result);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          if (isMounted) setLoading(false);
        }
      }, 500);
    }

    loadData();

    // Cleanup function (Purana timer cancel karo agar naya click aaya)
    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none"></div>

      {/* ⏱️ Timer Component */}
      <ServerTimer 
        time={data ? `${Number(data.time_taken).toFixed(4)} ms` : "0.0000 ms"} 
        page={page} 
      />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- HEADER (Clickable -> Roadmap) --- */}
        <div className="text-center mb-12 space-y-2">
          <Link href="/roadmap">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300">
              GIGA DB
            </h1>
          </Link>
          <p className="text-gray-400 text-sm md:text-base font-mono tracking-widest uppercase">
            High Performance • Binary Tree • 0 Latency
          </p>
          <p className="text-xs text-gray-600 pt-2">(Click Title for System Logs)</p>
        </div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
          // SKELETON LOADING
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-900/50 border border-gray-800 rounded-xl animate-pulse flex items-center p-4 gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // REAL DATA
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.users.map((user) => (
              <Link key={user.id} href={`/${user.id}`}>
                <div className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 p-5 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1">
                  
                  {/* Decorative Line */}
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-mono font-bold text-cyan-400 group-hover:text-white shadow-inner">
                        {user.id}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h2 className="font-bold text-lg text-gray-100 group-hover:text-cyan-300 transition-colors">
                          {user.name}
                        </h2>
                        <span className={`text-xs px-2 py-0.5 rounded border ${
                          user.role === 'Admin' 
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* --- PAGINATION BAR (Floating) --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-6 bg-gray-900/80 backdrop-blur-md border border-gray-700 px-6 py-3 rounded-full shadow-2xl">
            
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                page === 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white hover:text-cyan-400'
              }`}
            >
              ← Prev
            </button>

            <div className="hidden md:flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Page</span>
              <span className="text-xl font-bold font-mono text-white">{page}</span>
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold hover:text-cyan-400 transition-all"
            >
              Next →
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}