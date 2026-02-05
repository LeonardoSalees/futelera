// app/jogadores/page.tsx
import { PlayerListClient } from "./player-list-client";
import { AddPlayerForm } from "@/components/add-player-form";

async function getPlayers() {
 
  
  const response = await fetch(`api/players`, {
    cache: 'no-store', // Garante que o servidor busque dados frescos toda vez
  });

  if (!response.ok) {
    console.error("Erro ao buscar jogadores");
    return [];
  }

  return response.json();
}

export default async function JogadoresPage() {
  const players = await getPlayers();

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Atletas</h1>
        <p className="text-sm text-muted-foreground">
          Adicione novos mestres ou selecione quem vai pro jogo.
        </p>
      </div>

      <AddPlayerForm />
      <hr className="border-slate-200" />
      <PlayerListClient initialPlayers={players} />
    </div>
  );
}