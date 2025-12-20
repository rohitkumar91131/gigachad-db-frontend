'use client';

import Link from 'next/link';

export default function Roadmap() {
  
  const timeline = [
    {
      status: "COMPLETED",
      title: "Phase 1: The Engine (Genesis)",
      desc: "Node.js setup, File-based storage system (users.jsonl), and basic Append-Only logic.",
      tech: ["Node.js", "FS Module", "JSON Lines"]
    },
    {
      status: "COMPLETED",
      title: "Phase 2: Indexing Architecture",
      desc: "Implemented RAM-based Indexing. Moved from Linear Search (O(n)) to Indexed Lookups.",
      tech: ["RAM Map", "File Positions", "Buffer Reading"]
    },
    {
      status: "COMPLETED",
      title: "Phase 3: The Algorithm (AVL Tree)",
      desc: "Replaced simple Binary Tree with Self-Balancing AVL Tree to prevent 'Skewed Tree' issues & Stack Overflow on sorted data.",
      tech: ["AVL Algorithm", "Rotations", "Iterative Logic"]
    },
    {
      status: "COMPLETED",
      title: "Phase 4: High-Performance API",
      desc: "Built a pure REST API with Microsecond latency measurement using process.hrtime.",
      tech: ["Express.js", "Precision Timing", "Env Config"]
    },
    {
      status: "COMPLETED",
      title: "Phase 5: The Interface (Dashboard)",
      desc: "Created a futuristic Next.js Frontend with server-side timing, glassmorphism UI, and debounced search.",
      tech: ["Next.js 15", "Tailwind CSS", "Debouncing"]
    },
    {
      status: "COMPLETED",
      title: "Phase 6: Identity Evolution & Writes",
      desc: "Migrated Core DB from Integers to UUIDs (String Indexing). Added 'Create User' Write Ops, Modal UI, and solved pagination for random strings.",
      tech: ["UUIDs", "String AVL Logic", "Write Ops", "UI Animations"]
    },
    {
      status: "COMPLETED", // 👈 UPDATED STATUS
      title: "Phase 7: The Purge (Deletion)",
      desc: "Implemented 'Soft Delete' mechanism. Removing nodes from AVL Tree (RAM) with complex rebalancing. Added 'Termination Protocol' UI with safety checks.",
      tech: ["AVL Deletion", "Rebalancing", "Soft Delete", "UseRouter"]
    },
    {
      status: "UPCOMING",
      title: "Phase 8: Garbage Collection (Vacuum)",
      desc: "Running a background process to permanently remove 'soft deleted' rows from the disk file to recover storage space.",
      tech: ["Compaction", "Vacuuming", "Cron Jobs"]
    },
    {
      status: "UPCOMING",
      title: "Phase 9: Binary Optimization",
      desc: "Moving from JSON text to Raw Binary Buffers (Bit-level manipulation) for 2x speed and 50% less storage.",
      tech: ["Buffers", "Binary Packing", "Bitwise Ops"]
    },
    {
      status: "UPCOMING",
      title: "Phase 10: Secondary Indexing",
      desc: "Ability to search by Name or Email, not just ID. Creating multiple index files.",
      tech: ["Multi-Index", "B-Tree Concept"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans relative overflow-hidden p-6 md:p-12">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-16 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2">
              SYSTEM LOGS
            </h1>
            <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
              Project Development Timeline
            </p>
          </div>
          <Link href="/">
             <button className="px-6 py-2 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-cyan-500 transition-all text-sm font-mono text-cyan-400">
               ← RETURN TO TERMINAL
             </button>
          </Link>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
          
          {timeline.map((item, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Dot on Line */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                  item.status === 'COMPLETED' ? 'bg-cyan-500' : 'bg-yellow-500 animate-pulse'
              }`}></div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0f0f11] p-6 rounded-xl border border-gray-800 shadow-xl hover:border-gray-600 transition-all">
                <div className="flex items-center justify-between mb-2">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wider ${
                       item.status === 'COMPLETED' 
                       ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' 
                       : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                   }`}>
                       {item.status}
                   </span>
                   <span className="text-gray-600 text-xs font-mono">v0.{index + 1}</span>
                </div>
                
                <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2">
                    {item.tech.map((t, i) => (
                        <span key={i} className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                            {t}
                        </span>
                    ))}
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center p-8 bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-400 font-mono text-sm">
                System Status: <span className="text-green-400">OPERATIONAL</span>
            </p>
            <p className="text-gray-600 text-xs mt-2">
                &copy; 2024 GigaDB Architecture. All logs secured.
            </p>
        </div>

      </div>
    </div>
  );
}