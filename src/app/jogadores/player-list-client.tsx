"use client";

import { useState, useMemo } from "react"; // Removido useActionState
import { useRouter } from "next/navigation"; // Para redirecionar via Client
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Loader2 } from "lucide-react";

// Definição de interface para tipagem
interface Player {
  id: string;
  name: string;
  rating: number;
}

export function PlayerListClient({ initialPlayers }: { initialPlayers: Player[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Estado de loading manual
  const [error, setError] = useState<string | null>(null);

  const filteredPlayers = useMemo(() => {
    return initialPlayers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, initialPlayers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const playersPerTeam = 6;
  if (selectedIds.length < 2) {
    setError("Selecione pelo menos 2 jogadores.");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData(e.currentTarget);
  
  // 1. Pegamos os nomes customizados dos inputs
  const customNameA = formData.get("teamAName") as string;
  const customNameB = formData.get("teamBName") as string;
  const customNameC = formData.get("teamCName") as string;
  const customNameD = formData.get("teamDName") as string;
  const customNameE = formData.get("teamEName") as string;
  const customNameF = formData.get("teamFName") as string;

  // 2. Calculamos quantos times precisamos no total
  const numTeamsNeeded = Math.ceil(selectedIds.length / playersPerTeam);

  // 3. Geramos o array de nomes dinamicamente
  const teamNames = Array.from({ length: numTeamsNeeded }, (_, i) => {
    if (i === 0 && customNameA) return customNameA;
    if (i === 1 && customNameB) return customNameB;
    if (i === 1 && customNameC) return customNameC;
    if (i === 1 && customNameD) return customNameD;
    if (i === 1 && customNameE) return customNameE;
    if (i === 1 && customNameF) return customNameF;
    return `Time ${String.fromCharCode(65 + i)}`; // Gera Time C, Time D, etc.
  });

  const payload = {
    playerIds: selectedIds,
    teamNames: teamNames, // Agora envia a lista completa (Ex: ["Time A", "Time B", "Time C"])
  };

  try {
    const response = await fetch("/api/sorteio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Erro ao sortear times.");
    }

    const teams = await response.json();
    localStorage.setItem("ultimo_sorteio", JSON.stringify(teams));
    router.push("/sorteio/resultado");
  } catch (err: any) {
    setError(err.message);
    setLoading(false);
  }
};

  const togglePlayer = (id: string) => {
    if (loading) return;
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24">
      {/* Inputs de nomes de times permanecem iguais */}
      <div className="grid grid-cols-2 gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time A</label>
          <Input name="teamAName" placeholder="Ex: Colete Azul" className="bg-slate-50 border-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time B</label>
          <Input name="teamBName" placeholder="Ex: Colete Vermelho" className="bg-slate-50 border-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time C</label>
          <Input name="teamCName" placeholder="Ex: Colete Preto" className="bg-slate-50 border-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time D</label>
          <Input name="teamDName" placeholder="Ex: Colete Amarelo" className="bg-slate-50 border-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time E</label>
          <Input name="teamEName" placeholder="Ex: Colete Roxo" className="bg-slate-50 border-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Time F</label>
          <Input name="teamFName" placeholder="Ex: Colete Verde" className="bg-slate-50 border-none" />
        </div>
      </div>

      {/* Exibição de Erro */}
      {error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Lista de Jogadores (Lógica de renderização permanece igual) */}
      <div className="grid gap-3">
        {filteredPlayers.map((player) => (
          <Card
            key={player.id}
            onClick={() => togglePlayer(player.id)}
            className={`transition-all active:scale-[0.98] cursor-pointer ${
              selectedIds.includes(player.id) ? "border-green-500 bg-green-50/50" : "bg-white"
            }`}
          >
            {/* ... Conteúdo do Card ... */}
            <CardContent className="p-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-4">
                  <div className={`h-5 w-5 rounded border flex items-center justify-center ${selectedIds.includes(player.id) ? "bg-green-600" : "border-slate-300"}`}>
                    {selectedIds.includes(player.id) && <UserCheck className="h-3 w-3 text-white" />}
                  </div>
                  <span className="font-semibold text-slate-800">{player.name}</span>
                </div>
                <Badge variant="secondary">Nível {player.rating}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão Flutuante */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-2xl rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : `SORTEAR ${selectedIds.length} JOGADORES`}
          </Button>
        </div>
      )}
    </form>
  );
}