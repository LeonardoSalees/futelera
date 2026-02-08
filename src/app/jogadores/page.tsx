"use client"; // 👈 Essencial para hooks como useState e useEffect

import { useEffect, useState } from "react";
import { PlayerListClient } from "./player-list-client";
import { AddPlayerForm } from "@/components/add-player-form";
import { Loader2 } from "lucide-react"; // Opcional: para um feedback visual

export default function JogadoresPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os jogadores ao montar o componente
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch("/api/players"); // Adicionado "/" para caminho absoluto
        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Atletas</h1>
        <p className="text-sm text-muted-foreground">
          Adicione novos mestres ou selecione quem vai pro jogo.
        </p>
      </div>

      <AddPlayerForm />
      
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