import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Header />
        
        {/* Container que gerencia o scroll sem afetar o Header/Nav */}
        <main className="flex-1 pt-16 pb-20 overflow-y-auto overflow-x-hidden">
          <div className="max-w-md mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        <BottomNav />
      </body>
    </html>
  );
}