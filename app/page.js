'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ServerTimer from '@/components/ServerTimer';
import CreateUserForm from '@/components/CreateUserForm';

export default function Home() {
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState(1); // 🆕 Input State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH FUNCTION ---
  async function fetchData(pageNum) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; 
    if (!apiUrl) return null;

    const res = await fetch(`${apiUrl}/users/page/${pageNum}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  // --- REFRESH DATA ---
  const refreshData = () => {
    setLoading(true);
    fetchData(page).then((result) => {
      setData(result);
      setLoading(false);
    });
  };

  // --- DEBOUNCED LOAD ---
  useEffect(() => {
    let isMounted = true;
    let timer;

    async function loadData() {
      setLoading(true);
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
    setInputPage(page); // Sync input with page

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [page]);

  // --- JUMP TO PAGE ---
  const handlePageInput = (e) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(inputPage);
      if (newPage > 0) setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none"></div>

      {
        !loading ?         <ServerTimer 
          time={data ? `${Number(data.time_taken).toFixed(4)} ms` : "0.0000 ms"} 
          page={page} 
        /> : <p></p>
      }

      {/* ✨ CREATE USER FORM MODAL ✨ */}
      <CreateUserForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserCreated={refreshData}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- HEADER --- */}
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
          // REAL DATA or EMPTY STATE
          <>
            {data?.users?.length === 0 ? (
              // 🌑 EMPTY STATE UI
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                 <div className="w-20 h-20 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4">
                    <span className="text-4xl text-gray-700">∅</span>
                 </div>
                 <h2 className="text-xl font-bold text-gray-500">SECTOR EMPTY</h2>
                 <p className="text-gray-600 text-sm font-mono mt-1">No entities found on Page {page}</p>
                 <button onClick={() => setPage(1)} className="mt-6 text-cyan-500 hover:underline text-sm">Return to Start</button>
              </div>
            ) : (
              // 🟢 DATA GRID
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.users.map((user, index) => {
                  const serialNumber = (page - 1) * 20 + index + 1;
                  return (
                    <Link key={user.id} href={`/${user.id}`}>
                      <div className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 p-5 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1">
                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-mono font-bold text-cyan-400 group-hover:text-white shadow-inner">
                              {serialNumber}
                            </div>
                            <div className="flex flex-col">
                              <h2 className="font-bold text-lg text-gray-100 group-hover:text-cyan-300 transition-colors">
                                {user.name}
                              </h2>
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                                 <span className="text-cyan-600">@</span>
                                 <span className="truncate max-w-[150px] group-hover:text-gray-300 transition-colors">
                                    {user.email}
                                 </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* --- ANIMATED PAGINATION BAR (Bottom Center) --- */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-700 ease-out ${
           loading ? 'translate-y-24 opacity-0 scale-90' : 'translate-y-0 opacity-100 scale-100'
        }`}>
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
            
            {/* 🆕 Input Box for Page Jumping */}
            <div className="hidden md:flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Page</span>
              <input 
                type="number"
                min="1"
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={handlePageInput}
                className="w-12 bg-transparent text-center text-lg font-bold font-mono text-white border-b border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors appearance-none"
              />
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              // Check if next page has data logic can be added here if backend sends total pages
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold hover:text-cyan-400 transition-all"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ✨ ANIMATED FLOATING ADD BUTTON (Bottom Right) ✨ */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          // 🔥 Scale 0 to 1 Animation
          className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-110 flex items-center justify-center group transition-all duration-500 ease-cubic-bezier ${
             loading ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100 rotate-0'
          }`}
          title="Create New User"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

      </div>
    </div>
  );
}