import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json(players);
}

export async function POST(request: Request) {
  const { name, rating } = await request.json();
  const player = await prisma.player.create({
    data: { name, rating: Number(rating) }
  });
  return NextResponse.json(player);
}