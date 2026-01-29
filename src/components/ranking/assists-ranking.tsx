"use client";

import { Handshake, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface PlayerRanking {
  id: string;
  name: string;
  assistsCount: number;
  matchesCount: number;
  avatarURL?: string | null;
}

export function RankingGarcons({ players }: { players: PlayerRanking[] }) {
  // Pegamos os top 5 garçons
  const topGarcons = players.slice(0, 5);

  return (
    <div className="w-full space-y-3">
      {topGarcons.map((player, index) => (
        <div
          key={player.id}
          className="group relative flex items-center gap-4 p-4 bg-zinc-950/40 hover:bg-emerald-950/20 border-l-4 border-l-transparent hover:border-l-emerald-500 border-y border-r border-white/5 rounded-r-2xl transition-all duration-300"
        >
          {/* POSIÇÃO */}
          <div className="flex items-center justify-center min-w-[25px]">
            <span className="text-xl font-black italic text-zinc-700 group-hover:text-emerald-500">
              {index + 1}º
            </span>
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black uppercase italic text-white truncate group-hover:text-emerald-400">
              {player.name}
            </h4>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              {player.matchesCount} PARTIDAS
            </p>
          </div>

          {/* CONTADOR DE ASSISTÊNCIAS */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-3xl font-[1000] italic leading-none text-emerald-500 tracking-tighter">
                {player.assistsCount}
              </span>
              <p className="text-[8px] font-black text-emerald-600 uppercase text-center tracking-tighter">
                PASSES
              </p>
            </div>
            <Handshake size={16} className="text-zinc-800 group-hover:text-emerald-500" />
          </div>
        </div>
      ))}
    </div>
  );
}