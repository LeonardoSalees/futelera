import { MatchService } from "@/services/match-service";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await MatchService.finishMatch(id);
  return NextResponse.json({ success: true });
}