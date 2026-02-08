"use client";

import { useEffect, useState, useCallback } from "react"; // Adicionado useCallback
import { PlayerListClient } from "./player-list-client";
import { AddPlayerForm } from "@/components/add-player-form";
import { Loader2 } from "lucide-react";

export default function JogadoresPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Criamos uma função reutilizável para buscar os dados
  const fetchPlayers = useCallback(async () => {
    try {
      const response = await fetch("/api/players");
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Atletas</h1>
        <p className="text-sm text-muted-foreground">
          Adicione novos mestres ou selecione quem vai pro jogo.
        </p>
      </div>

      {/* Passamos a função de buscar dados para o formulário */}
      <AddPlayerForm onSuccess={fetchPlayers} />
      
      <hr className="border-slate-800/50" />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <PlayerListClient initialPlayers={players} />
      )}
    </div>
  );
}