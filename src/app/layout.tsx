import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import "./globals.css";
import { Toaster } from "sonner";
import { MatchService } from "@/services/match-service";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let matchDayId: string | null = null;

  try {
    // Buscamos apenas a rodada ATIVA (não finalizada)
    const activeMatchDay = await MatchService.getCurrentMatchDay();
    matchDayId = activeMatchDay ? activeMatchDay.id : null;
  } catch (error) {
    // Se o banco falhar no deploy, o ID fica null mas o Layout não quebra
    console.error("Erro ao buscar dados para o Nav:", error);
  }

  return (
    <html lang="pt-br" className="h-full">
      <body className="bg-[#020617] text-slate-200 antialiased h-full flex flex-col">
        <Header />

        <main className="flex-1 pt-16 pb-20 overflow-y-auto overflow-x-hidden">
          <div className="max-w-md mx-auto px-4 py-6">{children}</div>
        </main>
        
        <Toaster theme="dark" position="top-center" />
        
        {/* REMOVA a condicional 'latestMatchDay &&' para que o Nav apareça sempre */}
        <BottomNav matchDayId={matchDayId} />
      </body>
    </html>
  );
}