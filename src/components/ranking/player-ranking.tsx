"use client";

import { Star, Trophy, Medal } from "lucide-react";

interface Player {
  id: string;
  name: string;
  rating: number;
}

interface RankingProps {
  players: Player[];
}

export function PlayerRanking({ players }: RankingProps) {
  // Ordena do maior rating para o menor
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-slate-400" />;
      case 2: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-slate-400">{index + 1}º</span>;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {sortedPlayers.map((player, index) => (
        <div 
          key={player.id}
          className={`
            flex items-center justify-between p-4 rounded-xl border transition-all
            ${index === 0 ? "bg-yellow-50/50 border-yellow-200 shadow-sm" : "bg-white border-slate-200"}
          `}
        >
          {/* Lado Esquerdo: Posição e Nome */}
          <div className="flex items-center gap-4">
            <div className="w-8 flex justify-center">
              {getRankIcon(index)}
            </div>
            <div>
              <p className={`font-semibold ${index === 0 ? "text-yellow-900" : "text-slate-900"}`}>
                {player.name}
              </p>
              <p className="text-xs text-slate-500 sm:hidden">Nível {player.rating}/5</p>
            </div>
          </div>

          {/* Lado Direito: Estrelas (Escondido em telas muito pequenas, ou simplificado) */}
          <div className="hidden sm:flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < player.rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Mobile Rating (Apenas número para economizar espaço) */}
          <div className="sm:hidden flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
             <span className="text-xs font-bold">{player.rating}</span>
             <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      ))}
    </div>
  );
}