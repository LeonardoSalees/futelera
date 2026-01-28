"use client";

import { Trophy, Zap, TrendingUp } from "lucide-react";

export function RankingAgressivo({ players }: { players: any[] }) {
  return (
    <div className="flex flex-col gap-2">
      {players.map((player, index) => {
        const isTop1 = index === 0;

        return (
          <div 
            key={player.id}
            className={`
              relative overflow-hidden flex items-center justify-between 
              p-5 rounded-sm transition-all
              ${isTop1 ? 'bg-white text-black scale-[1.02] z-10' : 'bg-slate-900 text-white hover:bg-slate-800'}
            `}
          >
            {/* Background Decorativo para o Líder */}
            {isTop1 && (
              <div className="absolute right-0 top-0 opacity-10 uppercase font-black text-6xl italic -rotate-12 translate-x-10">
                GOAT
              </div>
            )}

            <div className="flex items-center gap-6">
              {/* Posição com fonte de impacto */}
              <span className={`text-4xl font-black italic ${isTop1 ? 'text-black' : 'text-slate-700'}`}>
                {(index + 1).toString().padStart(2, '0')}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">
                    {player.name}
                  </h3>
                  {player.rating === 5 && (
                    <Zap className={`h-4 w-4 fill-current ${isTop1 ? 'text-black' : 'text-yellow-400'}`} />
                  )}
                </div>
                
                <div className="flex gap-4 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isTop1 ? 'text-black/60' : 'text-slate-500'}`}>
                    {player.matchesCount} Partidas
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isTop1 ? 'text-black/60' : 'text-slate-500'}`}>
                    Avg: {player.average}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Gigante */}
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black italic tracking-tighter">
                {player.goalsCount}
              </span>
              <span className={`text-xs font-bold uppercase ${isTop1 ? 'text-black/40' : 'text-slate-600'}`}>
                Gols
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}