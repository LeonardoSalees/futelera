import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import "./globals.css";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";
import { MatchService } from "@/services/match-service";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca a rodada mais recente para o botão da Navbar
  const latestMatchDay = await prisma.matchDay.findFirst({
    orderBy: { date: 'desc' },
    select: { id: true }
  });

  const activeMatchDay = await MatchService.getCurrentMatchDay();
  
  // Se existir e não estiver finalizada, passamos o ID, senão null
  const matchDayId = activeMatchDay && !activeMatchDay.finished ? activeMatchDay.id : null;
  return (
    <html lang="pt-br" className="h-full">
      <body className="bg-[#020617] text-slate-200 antialiased selection:bg-blue-500/30 h-full flex flex-col">
        <Header />

        {/* Container que gerencia o scroll sem afetar o Header/Nav */}
        <main className="flex-1 pt-16 pb-20 overflow-y-auto overflow-x-hidden">
          <div className="max-w-md mx-auto px-4 py-6">{children}</div>
        </main>
        <Toaster theme="dark" position="top-center" />
        {latestMatchDay && <BottomNav matchDayId={latestMatchDay.id} />}
      </body>
    </html>
  );
}
