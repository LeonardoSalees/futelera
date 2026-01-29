"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Star, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

export function AddPlayerForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("3");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rating) return;

    setIsPending(true);
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating: Number(rating) }),
      });

      if (response.ok) {
        setName("");
        setRating("3");
        router.refresh(); // Atualiza a lista de jogadores automaticamente
      }
    } catch (error) {
        console.error("Erro ao adicionar:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
        Novo Atleta
      </label>
      <form 
        onSubmit={handleAdd} 
        className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-2xl focus-within:border-blue-500/50 transition-all"
      >
        <div className="flex-[3] flex items-center pl-3">
          <UserPlus className="h-4 w-4 text-slate-600 mr-2" />
          <Input
            placeholder="Nome do craque..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-600 font-bold"
          />
        </div>

        <div className="h-8 w-px bg-slate-800" />

        <div className="flex-1 min-w-[100px]">
          <Select value={rating} onValueChange={setRating} disabled={isPending}>
            <SelectTrigger className="bg-transparent border-none text-slate-300 focus:ring-0 focus:ring-offset-0 font-black italic">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()} className="focus:bg-blue-600 focus:text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-black">{num}</span>
                    <Star className={cn(
                        "h-3 w-3",
                        Number(rating) >= num ? "fill-blue-500 text-blue-500" : "text-slate-700"
                    )} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          disabled={isPending || !name.trim()} 
          className={cn(
            "h-11 w-11 rounded-xl transition-all active:scale-90 shrink-0",
            name.trim() ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-600"
          )}
        >
          {isPending ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5 stroke-[3px]" />
          )}
        </Button>
      </form>
    </div>
  );
}