// app/page.tsx

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const players = await prisma.player.findMany();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Peladeiros</h1>
      <ul>
        {players.map(player => (
          <li key={player.id} className="border-b py-2">
            {player.name} - Nível: {player.rating}
          </li>
        ))}
      </ul>
    </main>
  );
}