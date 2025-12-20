'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServerTimer from '@/components/ServerTimer';

export default function UserProfile({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  
  // 🆕 State for Copy Feedback
  const [copied, setCopied] = useState(false);

  // --- API CALL: FETCH ---
  const fetchUser = async (userId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return { success: false };

      const res = await fetch(`${apiUrl}/users/${userId}`);
      if (!res.ok) return { success: false };
      return await res.json();
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  // --- COPY UUID FUNCTION ---
  const handleCopy = () => {
    if (data?.user?.id) {
      navigator.clipboard.writeText(data.user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    }
  };

  // --- API CALL: DELETE ---
  const handleDelete = async () => {
    if (!confirm("⚠️ WARNING: TERMINATION PROTOCOL\n\nAre you sure you want to delete this entity? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/users/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        router.push('/');
      } else {
        alert("Delete Failed: " + result.msg);
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("System Error: Could not reach server.");
      setDeleting(false);
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
          <div className="mt-20 px-8 space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/2"></div>
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
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Timer */}
      <ServerTimer time={`${data.time_ms || 0} ms`} />

      <div className="relative w-full max-w-lg group">
        
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
        
        <div className="relative bg-[#0f0f11] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          
          {/* Cover Image */}
          <div className="h-40 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
             
             {/* 🔥 CLICKABLE UUID BADGE 🔥 */}
             <button
               onClick={handleCopy}
               className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full border transition-all duration-300 flex items-center gap-2 group/copy ${
                 copied 
                   ? "bg-green-500/20 border-green-500/50 cursor-default" 
                   : "bg-black/50 border-white/10 hover:border-cyan-500/50 hover:bg-black/70 cursor-pointer"
               }`}
               title="Click to copy full UUID"
             >
               {/* Status Dot */}
               <div className={`w-1.5 h-1.5 rounded-full ${copied ? "bg-green-500" : "bg-cyan-500 animate-pulse"}`}></div>
               
               {/* Text Change on Copy */}
               <span className={`text-[10px] font-mono tracking-widest ${copied ? "text-green-400 font-bold" : "text-gray-300 group-hover/copy:text-white"}`}>
                 {copied ? "COPIED!" : `UID: ${user.id.slice(0,8)}...`}
               </span>

               {/* Copy Icon (Hidden when copied) */}
               {!copied && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-500 group-hover/copy:text-cyan-400 transition-colors">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                  </svg>
               )}
             </button>

          </div>

          <div className="px-8 pb-8">
            
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
              <div className="w-32 h-32 rounded-3xl bg-[#0f0f11] p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-4xl font-black text-white border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    {user.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="flex gap-2 mb-2">
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs text-green-500 font-mono">ONLINE</span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">{user.name}</h1>
              <div className="flex items-center gap-2 pt-1 text-gray-400">
                <span className="text-sm font-mono tracking-wide opacity-80 text-cyan-500">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
               <div className="bg-[#161618] border border-gray-800 rounded-lg p-3 flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Latency</span>
                  <span className="text-green-400 font-mono text-lg">{data.time_ms || 0} ms</span>
               </div>
               <div className="bg-[#161618] border border-gray-800 rounded-lg p-3 flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Role</span>
                  <span className="text-blue-400 font-mono text-lg">USER</span>
               </div>
            </div>

            {/* --- ACTION BUTTONS (Back & Delete) --- */}
            <div className="mt-8 flex gap-4">
              
              {/* Back Button */}
              <Link href="/" className="flex-1">
                <button className="w-full h-12 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition active:scale-95">
                  ← Back
                </button>
              </Link>

              {/* Delete Button */}
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-12 rounded-xl bg-red-900/20 border border-red-900/50 text-red-500 font-bold hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/delete"
              >
                {deleting ? (
                  <span className="animate-pulse">PURGING...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover/delete:animate-bounce">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    TERMINATE
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}