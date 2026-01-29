"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Zap, Trophy, Timer, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActiveMatchCard() {
  const [matchDay, setMatchDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/matches/current");
      const data = await res.json();
      setMatchDay(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-24 bg-slate-900/20 animate-pulse rounded-[2rem] border border-slate-800/50" />;

  // 1. Estado: Sem pelada hoje
  if (!matchDay) {
    return (
      <Link href="/jogadores">
        <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 p-6 rounded-[2rem] flex items-center justify-between group transition-all">
          <div className="flex items-center gap-4">
            <Trophy className="text-slate-600 group-hover:text-blue-500" />
            <span className="text-sm font-bold text-slate-400">Iniciar Rodada de Hoje</span>
          </div>
          <ChevronRight size={18} className="text-slate-800" />
        </div>
      </Link>
    );
  }

  const currentMatch = matchDay.matches?.[0]; // Pega o confronto mais recente
  const isPlaying = currentMatch?.status === "playing";

  // Se tem MatchDay mas não tem Match ainda, manda para sorteio
  const destinationHref = currentMatch 
    ? `/partida/${currentMatch.id}` 
    : "/sorteio";

  return (
    <Link href={destinationHref}>
      <div className={cn(
        "relative overflow-hidden p-5 rounded-[2.2rem] border transition-all active:scale-[0.98]",
        isPlaying ? "bg-slate-900 border-blue-600/50" : "bg-slate-900 border-slate-800"
      )}>
        
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className={cn("h-1.5 w-1.5 rounded-full", isPlaying ? "bg-red-500 animate-pulse" : "bg-slate-600")} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
              {isPlaying ? "Confronto ao vivo" : "Aguardando Próximo"}
            </span>
          </div>
          <span className="text-[8px] font-black text-slate-700 uppercase">Matchday ID: {matchDay.id.slice(-4)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center",
              isPlaying ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "bg-slate-800"
            )}>
              {isPlaying ? <Zap size={20} className="text-white fill-current" /> : <Timer size={20} className="text-slate-500" />}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase italic truncate w-16 leading-none">
                  {currentMatch?.teams[0]?.name || "T. Alpha"}
                </span>
              </div>
              
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="text-lg font-black text-white">{currentMatch?.scoreA ?? 0}</span>
                <span className="text-[8px] font-black text-slate-800">X</span>
                <span className="text-lg font-black text-white">{currentMatch?.scoreB ?? 0}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-white uppercase italic truncate w-16 leading-none text-right">
                  {currentMatch?.teams[1]?.name || "T. Bravo"}
                </span>
              </div>
            </div>
          </div>
          
          <ChevronRight size={16} className="text-slate-700" />
        </div>
      </div>
    </Link>
  );
}