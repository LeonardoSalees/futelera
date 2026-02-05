import { RankingGarcons } from "@/components/ranking/assists-ranking";
import { RankingAgressivo } from "@/components/ranking/detailed-ranking";
import { PlayerService } from "@/services/player-service";
import { Trophy, Flame, Target, Crown, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const players = await PlayerService.getRanking();

  // Destaque para o 1º colocado
  const lider = players[0];
  const totalJogadores = players.length;
  const garcons = [...players].sort((a, b) => b.assistsCount - a.assistsCount);
  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 pb-32 selection:bg-blue-500/30">
      <div className="max-w-xl mx-auto pt-10 space-y-12">
        {/* CABEÇALHO ESTILO "ARENA" */}
        <header className="relative flex justify-between items-end border-b border-white/5 pb-10">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2px] w-8 bg-blue-600"></span>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Temporada 2026
              </p>
            </div>
            <h1 className="text-7xl font-[1000] italic uppercase tracking-tighter leading-[0.75] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
              Ranking <br /> <span className="text-blue-600">Perna</span> <br />{" "}
              de pau
            </h1>
          </div>

          <div className="text-right space-y-1">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              Ranking Global
            </p>
            <p className="text-white text-2xl font-black italic">
              #{totalJogadores}
            </p>
            <p className="text-slate-500 text-[9px] font-bold uppercase">
              Atletas Ativos
            </p>
          </div>

          {/* Efeito de iluminação de fundo */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        </header>

        {/* CARD DO LÍDER (BOSS CARD) */}
        {lider && (
          <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-zinc-900 rounded-[2rem] p-6 border border-white/10 flex items-center justify-between overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-blue-600/20 w-fit px-3 py-1 rounded-full border border-blue-600/30">
                  <Crown size={14} className="text-blue-500 fill-current" />
                  <span className="text-blue-500 text-[9px] font-black uppercase tracking-widest">
                    Líder Atual
                  </span>
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                  {lider.name}
                </h2>

                <div className="flex gap-4">
                  <div className="text-left">
                    <p className="text-slate-500 text-[8px] font-black uppercase">
                      Taxa de Vitória
                    </p>
                    <p className="font-black text-sm text-green-500">84.2%</p>
                  </div>
                  <div className="text-left">
                    <p className="text-slate-500 text-[8px] font-black uppercase">
                      Últimos 5
                    </p>
                    <div className="flex gap-1 mt-1">
                      {/* Exemplo visual de sequência: V-V-V-D-V */}
                      {[1, 1, 1, 0, 1].map((v, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-sm ${v ? "bg-blue-500" : "bg-slate-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase">
                  Rating
                </p>
                <p className="text-6xl font-[1000] italic tracking-tighter text-white">
                  {lider.rating}
                </p>
              </div>

              {/* Marca d'água decorativa */}
              <Trophy
                size={140}
                className="absolute -right-4 -bottom-4 text-white/[0.03] -rotate-12"
              />
            </div>
          </section>
        )}

        {/* CARDS DE MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
            <Target size={18} className="text-blue-600" />
            <p className="text-[8px] font-black uppercase text-slate-500">
              Média Gols
            </p>
            <p className="font-black italic">4.2</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
            <Flame size={18} className="text-orange-600" />
            <p className="text-[8px] font-black uppercase text-slate-500">
              Sequência
            </p>
            <p className="font-black italic">7 Vitórias</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
            <TrendingUp size={18} className="text-green-600" />
            <p className="text-[8px] font-black uppercase text-slate-500">
              Tendência
            </p>
            <p className="font-black italic">+3 pos</p>
          </div>
        </div>

        {/* LISTAGEM DETALHADA */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Lista de Elite
            </h3>
            <span className="text-[10px] font-bold text-blue-600 uppercase">
              Temporada Atual
            </span>
          </div>

          {/* O componente que você já tem, agora integrado ao novo visual */}
          <RankingAgressivo players={players} />
        </div>
      </div>

      {/* SECÇÃO 2: GARÇONS (ASSISTÊNCIAS) */}
      <section className="space-y-6 mt-5">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">
            Mestres do Passe
          </h3>
          <div className="h-[1px] flex-1 bg-emerald-500/20"></div>
        </div>
        <RankingGarcons players={garcons} />
      </section>
    </main>
  );
}
