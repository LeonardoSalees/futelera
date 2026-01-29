"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Biblioteca de notificações
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, UserCheck, Loader2, CheckSquare, Square, 
  Settings2, Users2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  rating: number;
}

export function PlayerListClient({ initialPlayers }: { initialPlayers: Player[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Configuração dinâmica do ADM
  const [playersPerTeam, setPlayersPerTeam] = useState(6);

  // Lógica de cálculo de times
  const numTeamsNeeded = Math.ceil(selectedIds.length / playersPerTeam);
  const teamLetters = ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, numTeamsNeeded);

  const filteredPlayers = useMemo(() => {
    return initialPlayers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, initialPlayers]);

  const allFilteredSelected = filteredPlayers.length > 0 && 
    filteredPlayers.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = filteredPlayers.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const newIds = filteredPlayers.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newIds])));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação 1: Mínimo de jogadores
    if (selectedIds.length < 2) {
      toast.error("Seleção Insuficiente", {
        description: "Selecione pelo menos 2 jogadores para o sorteio."
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const missingNames: string[] = [];
    
    const teamNames = teamLetters.map((letter) => {
      const name = formData.get(`team${letter}Name`) as string;
      if (!name || name.trim() === "") {
        missingNames.push(`Time ${letter}`);
      }
      return name;
    });

    // Validação 2: Nomes dos times (Notificação de Erro)
    if (missingNames.length > 0) {
      toast.error("Nomes Obrigatórios", {
        description: `Preencha os nomes: ${missingNames.join(", ")}`,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sorteio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playerIds: selectedIds, 
          teamNames,
          playersPerTeam // Enviando a configuração escolhida
        }),
      });

      if (!response.ok) throw new Error();

      const teams = await response.json();
      localStorage.setItem("ultimo_sorteio", JSON.stringify(teams));
      toast.success("Sorteio realizado com sucesso!");
      router.push("/sorteio/resultado");
    } catch (err) {
      toast.error("Erro no Servidor", {
        description: "Não foi possível realizar o sorteio. Tente novamente."
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-40">
      {/* Configurações do ADM (Players per Team) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-[2rem] space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Settings2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Configuração da Rodada</span>
          </div>
          <Badge variant="outline" className="border-blue-500/50 text-blue-500 font-black">
            {playersPerTeam} POR TIME
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-2 rounded-xl flex items-center gap-4 flex-1 border border-slate-800">
            <Users2 size={18} className="text-slate-600 ml-2" />
            <input 
              type="range" 
              min="2" 
              max="12" 
              value={playersPerTeam}
              onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-md pb-4 pt-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <Input
            placeholder="Buscar mestre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={toggleSelectAll}
          className="w-full justify-between border-slate-800 bg-slate-900/50 text-slate-500 hover:text-white"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            {allFilteredSelected ? "Remover Todos" : "Selecionar Todos"}
          </span>
          {allFilteredSelected ? <CheckSquare className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nomes dos Times (Aparece dinamicamente) */}
      {selectedIds.length > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-blue-600/5 rounded-[2rem] border border-blue-500/20 animate-in fade-in zoom-in-95">
          {teamLetters.map((letter) => (
            <div key={letter} className="space-y-1">
              <label className="text-[9px] font-black uppercase text-blue-500 ml-1">Time {letter} *</label>
              <Input
                name={`team${letter}Name`}
                placeholder={`Nome do Time...`}
                className="h-10 bg-slate-950 border-slate-800 text-white focus-visible:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lista de Jogadores */}
      <div className="grid gap-2">
        {filteredPlayers.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          return (
            <Card
              key={player.id}
              onClick={() => setSelectedIds(prev => isSelected ? prev.filter(id => id !== player.id) : [...prev, player.id])}
              className={cn(
                "transition-all active:scale-[0.98] cursor-pointer border-slate-800",
                isSelected ? "bg-blue-600 border-blue-400" : "bg-slate-900/60"
              )}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center border transition-all",
                    isSelected ? "bg-white border-white" : "border-slate-700 bg-slate-950"
                  )}>
                    {isSelected && <UserCheck className="h-3 w-3 text-blue-600" />}
                  </div>
                  <span className={cn("font-bold text-sm uppercase tracking-tight", isSelected ? "text-white" : "text-slate-300")}>
                    {player.name}
                  </span>
                </div>
                <Badge variant="outline" className={cn(
                  "font-black border-none px-2 py-0.5",
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-500"
                )}>
                  LVL {player.rating}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Botão Flutuante */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest opacity-70">Gerar Partida</span>
                <span className="text-lg italic uppercase">Sortear {selectedIds.length} Atletas</span>
              </div>
            )}
          </Button>
        </div>
      )}
    </form>
  );
}