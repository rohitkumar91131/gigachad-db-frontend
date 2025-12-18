export default function ServerTimer({ time, page }) {
  if (!time) return null;
  
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Time Badge */}
      <div className="bg-black/80 text-green-400 border border-green-500 px-4 py-2 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(0,255,0,0.5)] backdrop-blur-md">
        ⚡ Speed: <span className="font-bold text-white">{time}</span>
      </div>

      {/* Page Badge */}
      {page && (
        <div className="bg-black/80 text-blue-400 border border-blue-500 px-4 py-2 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(0,100,255,0.5)] backdrop-blur-md">
          📄 Page: <span className="font-bold text-white">{page}</span>
        </div>
      )}
    </div>
  );
}