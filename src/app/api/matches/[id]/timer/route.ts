// src/app/api/matches/[id]/timer/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Params agora é uma Promise no Next.js 15
) {
  try {
    const { id } = await params;
    const { status, timerOffset } = await req.json();

    // Validação básica
    if (!id) {
      return NextResponse.json({ error: "ID da partida é obrigatório" }, { status: 400 });
    }

    const updatedMatch = await prisma.match.update({
      where: { id },
      data: {
        status,
        timerOffset: Number(timerOffset), // Garante que seja um inteiro
        // Se deu play (status === "playing"), registra o momento exato do início.
        // Se pausou ou qualquer outro status, limpa o startTime para o cálculo não bugar.
        startTime: status === "playing" ? new Date() : null 
      }
    });

    return NextResponse.json(updatedMatch);
  } catch (error: any) {
    console.error("Erro ao atualizar cronômetro:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar tempo com o servidor" }, 
      { status: 500 }
    );
  }
}