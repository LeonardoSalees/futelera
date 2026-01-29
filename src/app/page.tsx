"use client";

import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Settings, 
  Zap, 
  ChevronRight,
  BarChart3,
  UserPlus
} from "lucide-react";
import { ActiveMatchCard } from "@/components/active-match-card";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    title: "Atletas", 
    icon: Users, 
    href: "/jogadores", 
    color: "text-blue-500", 
    desc: "Convocação e sorteio" 
  },
  { 
    title: "Ranking", 
    icon: Trophy, 
    href: "/ranking", 
    color: "text-amber-500", 
    desc: "Artilharia e vitórias" 
  },  
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] p-6 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Header Compacto */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
                Futelera
              </h1>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">
                Dashboard v2.0
              </p>
            </div>
          </div>
          <Link href="/jogadores" className="h-10 w-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <UserPlus size={18} />
          </Link>
        </div>

        {/* Card de Partida Ativa (O Protagonista) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Em Andamento
            </h3>
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <ActiveMatchCard />
        </div>

        {/* Menu de Ações Estilo "List Item" - Mais minimalista que o Grid */}
        <div className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-1">
            Menu Principal
          </h3>
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link key={item.title} href={item.href}>
                <div className="group bg-slate-900/40 border border-slate-800/50 p-4 rounded-[1.5rem] flex items-center justify-between transition-all active:scale-[0.98] hover:bg-slate-900/80">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl bg-slate-950 border border-slate-800", item.color)}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-200 uppercase italic tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Informativo Rápido (Footer da Home) */}
        <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-[2rem] flex items-center gap-4">
           <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Users size={16} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Dica do Juiz</p>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">Mantenha o rating dos jogadores atualizado para sorteios mais justos.</p>
           </div>
        </div>
      </div>
    </main>
  );
}