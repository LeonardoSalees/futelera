import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Settings, 
  PlusCircle, 
  PlayCircle, 
  BarChart3 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const menuItems = [
  { 
    title: "Estatísticas", 
    icon: BarChart3, 
    href: "/ranking", 
    color: "bg-blue-600", 
    desc: "Ranking geral" 
  },
  { 
    title: "Sortear Times", 
    icon: Users, 
    href: "/sorteio", 
    color: "bg-emerald-600", 
    desc: "Equilibrar pelada" 
  },
  { 
    title: "Jogadores", 
    icon: Settings, 
    href: "/jogadores", 
    color: "bg-purple-600", 
    desc: "Gerenciar lista" 
  },
  { 
    title: "Nova Rodada", 
    icon: PlusCircle, 
    href: "/nova-rodada", 
    color: "bg-indigo-600", 
    admin: true 
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-12">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header Minimalista */}
        <div className="flex justify-between items-center px-2">
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              Futebol de Segunda
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Painel de Controle
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        {/* Grid de Ações Principais */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <Card className={`${item.color} border-none h-32 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 group-hover:brightness-110 shadow-lg shadow-black/20`}>
                <item.icon className="h-8 w-8 text-white/90" />
                <span className="text-white font-black uppercase text-xs tracking-tighter">
                  {item.title}
                </span>
                {item.admin && (
                  <span className="absolute top-2 right-2 text-[8px] bg-black/20 text-white/60 px-1.5 py-0.5 rounded-full font-bold">
                    ADMIN
                  </span>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* Card de Partida Ativa (Destaque) */}
        <div className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-2">
            Status da Noite
          </h3>
          <Link href="/partida/atual">
            <Card className="bg-slate-900 border-slate-800 p-6 flex items-center justify-between group hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase">Partida em Andamento</h4>
                  <p className="text-slate-500 text-[10px] font-medium">Clique para abrir o placar</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}