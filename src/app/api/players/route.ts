import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(players);
}

export async function POST(request: Request) {
  try {
    const { name, rating } = await request.json();
    const player = await prisma.player.create({
      data: { name, rating: Number(rating) }
    });
         revalidatePath("/ranking");
     revalidatePath("/jogadores");

    
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar player" }, { status: 500 });
  }
}