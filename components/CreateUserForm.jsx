'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // 👈 Import Link

export default function CreateUserForm({ isOpen, onClose, onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🆕 New State: To store created user data
  const [createdUser, setCreatedUser] = useState(null);

  // Jab modal khule, purana success state clear karo
  useEffect(() => {
    if (isOpen) {
      setCreatedUser(null);
      setName('');
      setEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json(); // 👈 Response data parse karo

      if (res.ok) {
        // Parent ko refresh karo
        onUserCreated(); 
        
        // 🆕 Form close mat karo, Success State set karo
        setCreatedUser(data.user); 
      } else {
        alert("Failed to create user");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  // Helper to reset for adding another user
  const handleAddAnother = () => {
    setCreatedUser(null);
    setName('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      <div className="bg-[#0f0f11] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Glow Effect */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${createdUser ? 'from-green-500 to-cyan-500' : 'from-cyan-500 to-purple-600'}`}></div>

        <div className="p-8">
          
          {/* --- CONDITIONAL RENDERING START --- */}
          {createdUser ? (
            
            // ✅ SUCCESS VIEW
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Entity Created</h2>
              <p className="text-gray-400 text-sm mb-6">
                <span className="text-cyan-400 font-mono">{createdUser.name}</span> has been successfully indexed in GigaDB.
              </p>

              <div className="flex flex-col gap-3 w-full">
                {/* View Profile Button */}
                <Link href={`/${createdUser.id}`}>
                  <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2">
                    View Profile →
                  </button>
                </Link>

                <div className="flex gap-3 mt-2">
                    <button 
                        onClick={handleAddAnother}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition"
                    >
                        + Add Another
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-400 text-sm font-semibold transition"
                    >
                        Close
                    </button>
                </div>
              </div>
            </div>

          ) : (

            // 📝 FORM VIEW
            <>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-cyan-400">Add</span> New Entity
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600"
                    placeholder="Ex. John Wick"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Secure Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600"
                    placeholder="Ex. agent@gigadb.net"
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition font-semibold"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? "Processing..." : "Create User →"}
                  </button>
                </div>
              </form>
            </>
          )}
          {/* --- CONDITIONAL RENDERING END --- */}

        </div>
      </div>
    </div>
  );
}