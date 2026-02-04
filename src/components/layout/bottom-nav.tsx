"use client"; // Obrigatório no topo

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Trophy, SwatchBook, LayoutDashboard, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({ matchDayId }: { matchDayId: string | null }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  // Verifica se está na arena de uma partida específica ou na página geral de partida
  const isArenaActive = pathname.startsWith("/partida");

  // Se não houver rodada ativa, o botão Arena leva para jogadores/novo jogo
  const arenaHref = matchDayId ? `/partida/${matchDayId}` : "/jogadores";

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md fixed bottom-0 left-0 right-0 h-20 border-t border-slate-800/50 flex items-center justify-around pb-6 z-50">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center gap-1.5 transition-all",
          isActive("/") ? "text-blue-500" : "text-slate-500"
        )}
      >
        <LayoutDashboard size={22} />
        <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
      </Link>

      <Link
        href={arenaHref}
        className={cn(
          "flex items-center gap-2 px-6 py-4 rounded-full font-black uppercase italic tracking-widest transition-all",
          isArenaActive
            ? "bg-white text-slate-900 scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            : "bg-blue-600 text-white"
        )}
      >
        <Play size={20} className={isArenaActive ? "fill-current" : ""} />
        <span className="text-sm">{matchDayId ? "Arena" : "Novo Jogo"}</span>
      </Link>

      <Link
        href="/ranking"
        className={cn(
          "flex flex-col items-center gap-1.5 transition-all",
          isActive("/ranking") ? "text-blue-500" : "text-slate-500"
        )}
      >
        <Trophy size={22} />
        <span className="text-[10px] font-black uppercase tracking-widest">Ranking</span>
      </Link>
    </nav>
  );
}