import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Progression } from "@/lib/types";

function computeScore(p: Omit<Progression, "score" | "updatedAt">): number {
  let score = 0;
  if (p.plan_choisi) score += 33;
  if (p.video_watched) score += 33;
  const etapeScore = Math.min(p.etape_courante, 3) * Math.floor(34 / 3);
  score += etapeScore;
  return Math.min(score, 100);
}

/**
 * POST /api/progression
 * Crée ou met à jour la progression dans MongoDB.
 * Body : { sessionId, plan, video_watched?, etape_courante?, plan_choisi? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string;
      plan?: 1 | 2 | 3;
      video_watched?: boolean;
      etape_courante?: number;
      plan_choisi?: boolean;
    };

    const { sessionId } = body;
    if (!sessionId) return NextResponse.json({ error: "sessionId requis" }, { status: 400 });

    const db = await getDb();
    const progressions = db.collection<Progression>("progressions");

    // Lire la progression existante
    const existing = await progressions.findOne({ sessionId }, { projection: { _id: 0 } });

    const merged: Omit<Progression, "score" | "updatedAt"> = {
      sessionId,
      plan: body.plan ?? existing?.plan ?? 1,
      etape_courante: body.etape_courante ?? existing?.etape_courante ?? 0,
      video_watched: body.video_watched ?? existing?.video_watched ?? false,
      plan_choisi: body.plan_choisi ?? existing?.plan_choisi ?? (body.plan != null),
    };

    const progression: Progression = {
      ...merged,
      score: computeScore(merged),
      updatedAt: new Date().toISOString(),
    };

    await progressions.updateOne(
      { sessionId },
      { $set: progression },
      { upsert: true }
    );

    return NextResponse.json({ progression });
  } catch (err) {
    console.error("POST /api/progression error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * GET /api/progression?sessionId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ error: "sessionId requis" }, { status: 400 });

    const db = await getDb();
    const progressions = db.collection<Progression>("progressions");

    const progression = await progressions.findOne({ sessionId }, { projection: { _id: 0 } });
    if (!progression) return NextResponse.json({ error: "Progression introuvable" }, { status: 404 });

    return NextResponse.json({ progression });
  } catch (err) {
    console.error("GET /api/progression error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
