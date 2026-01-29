"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Trophy, SwatchBook, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  // Função simples para definir a cor ativa
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md fixed bottom-0 left-0 right-0 h-20 border-t border-slate-800/50 flex items-center justify-around pb-6 z-50">
      
      {/* Início */}
      <Link href="/" className={cn(
        "flex flex-col items-center gap-1.5 transition-all",
        isActive('/') ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
      )}>
        <LayoutDashboard size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
      </Link>

      {/* Atletas */}
      <Link href="/jogadores" className={cn(
        "flex flex-col items-center gap-1.5 transition-all",
        isActive('/jogadores') ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
      )}>
        <Users size={22} strokeWidth={isActive('/jogadores') ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">Atletas</span>
      </Link>

      {/* Botão de Destaque: Sortear */}
      <Link href="/jogadores" className="relative -mt-10">
        <div className="bg-blue-600 p-4 rounded-[1.5rem] shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] border-4 border-[#020617] transition-all active:scale-90 hover:bg-blue-500">
          <SwatchBook size={28} className="text-white" />
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-blue-500 whitespace-nowrap">
          Novo Jogo
        </span>
      </Link>

      {/* Ranking */}
      <Link href="/ranking" className={cn(
        "flex flex-col items-center gap-1.5 transition-all",
        isActive('/ranking') ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
      )}>
        <Trophy size={22} strokeWidth={isActive('/ranking') ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">Ranking</span>
      </Link>
    </nav>
  );
}