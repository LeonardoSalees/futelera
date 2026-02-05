import { MatchService } from "@/services/match-service";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await MatchService.finishMatch(id);
       revalidatePath("/ranking");
  
  return NextResponse.json({ success: true });
}