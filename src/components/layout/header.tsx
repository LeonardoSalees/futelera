export function Header() {
  return (
    <header className="bg-[#020617] text-slate-200 antialiased selection:bg-blue-500/30 fixed top-0 left-0 right-0 h-16 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Futelera
      </h1>
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-500">LP</span>
      </div>
    </header>
  );
}