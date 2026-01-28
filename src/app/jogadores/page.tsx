import { PlayerService } from "@/services/player-service";
import { PlayerListClient } from "./player-list-client";
import { AddPlayerForm } from "@/components/add-player-form"; // Criaremos este abaixo

export default async function JogadoresPage() {
  // O servidor busca os dados na nuvem antes de entregar a página
  const players = await PlayerService.getAllPlayers();

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Atletas
        </h1>
        <p className="text-sm text-muted-foreground">
          Adicione novos mestres ou selecione quem vai pro jogo.
        </p>
      </div>

      {/* Formulário para adicionar novos jogadores via API */}
      <AddPlayerForm/>

      <hr className="border-slate-200" />

      {/* Lista interativa que gerencia o sorteio */}
      <PlayerListClient initialPlayers={players} />
    </div>
  );
}