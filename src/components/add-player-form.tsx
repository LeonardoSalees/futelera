"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button} from "@/components/ui/button";
import { Plus, Loader2, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border">
      <div className="flex-[3]">
        <Input
          placeholder="Nome do jogador..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="bg-white border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="h-6 w-px bg-slate-200" /> {/* Divisor vertical */}

      <div className="flex items-center gap-2 flex-1 px-2">
        <Select value={rating} onValueChange={setRating} disabled={isPending}>
  <SelectTrigger className="w-[110px] bg-white">
    <SelectValue placeholder="Nível" />
  </SelectTrigger>
  <SelectContent>
    {[1, 2, 3, 4, 5].map((num) => (
      <SelectItem key={num} value={num.toString()}>
        <div className="flex items-center gap-2">
          {num} <Star className="h-3 w-3 fill-current text-yellow-500" />
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
      </div>

      <Button type="submit" size="sm" disabled={isPending || !name.trim()} className="shrink-0">
        {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </Button>
    </form>
  );
}