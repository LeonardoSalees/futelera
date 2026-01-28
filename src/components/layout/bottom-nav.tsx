import Link from 'next/link';
import { Users, Trophy, SwatchBook, LayoutDashboard } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="bg-[#020617] text-slate-200 antialiased selection:bg-blue-500/30 fixed bottom-0 left-0 right-0 h-16 border-t border-slate-200 flex items-center justify-around pb-safe z-50">
      <Link href="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-green-600">
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Início</span>
      </Link>
      <Link href="/jogadores" className="flex flex-col items-center gap-1 text-slate-500 hover:text-green-600">
        <Users size={20} />
        <span className="text-[10px] font-medium">Atletas</span>
      </Link>
      <Link href="/sorteio" className="flex flex-col items-center gap-1 text-slate-600 font-bold">
        <div className="bg-green-600 text-white p-3 rounded-full -mt-8 shadow-lg shadow-green-200 border-4 border-white">
          <SwatchBook size={24} />
        </div>
        <span className="text-[10px] text-green-600">Sortear</span>
      </Link>
      <Link href="/ranking" className="flex flex-col items-center gap-1 text-slate-500 hover:text-green-600">
        <Trophy size={20} />
        <span className="text-[10px] font-medium">Ranking</span>
      </Link>
    </nav>
  );
}