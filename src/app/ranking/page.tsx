import { RankingAgressivo } from "@/components/ranking/detailed-ranking";
import { PlayerService } from "@/services/player-service";

export default async function RankingPage() {
  const players = await PlayerService.getRanking();

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto pt-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              The <br /> <span className="text-blue-600">Leaderboard</span>
            </h1>
          </div>
          <div className="text-right">
             <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Season 26</p>
          </div>
        </header>

        <RankingAgressivo players={players} />
      </div>
    </main>
  );
}