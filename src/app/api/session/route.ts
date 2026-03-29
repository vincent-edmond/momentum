import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { SessionData, ProfilProspect } from "@/lib/types";

function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * POST /api/session
 * Crée une session et la persiste dans MongoDB (cross-device).
 * Body : { prenom, email, ca, frein, secteur, sessionId? }
 * Retourne : { sessionId, session }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ProfilProspect & { sessionId?: string };
    const { prenom, email, ca, frein, secteur, sessionId: existingId } = body;

    if (!email || !prenom) {
      return NextResponse.json({ error: "email et prenom requis" }, { status: 400 });
    }

    const db = await getDb();
    const sessions = db.collection<SessionData>("sessions");

    const sessionId = existingId ?? generateSessionId();
    const sessionData: SessionData = {
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      ca,
      frein,
      secteur,
      sessionId,
      createdAt: new Date().toISOString(),
    };

    // Upsert par sessionId
    await sessions.updateOne(
      { sessionId },
      { $set: sessionData },
      { upsert: true }
    );

    return NextResponse.json({ sessionId, session: sessionData });
  } catch (err) {
    console.error("POST /api/session error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * GET /api/session?id=xxx     → récupère session par sessionId
 * GET /api/session?email=xxx  → récupère sessionId + session par email
 */
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const sessions = db.collection<SessionData>("sessions");

    const sessionId = req.nextUrl.searchParams.get("id");
    const email = req.nextUrl.searchParams.get("email");

    const clerkUserId = req.nextUrl.searchParams.get("clerkUserId");

    if (sessionId) {
      const session = await sessions.findOne({ sessionId }, { projection: { _id: 0 } });
      if (!session) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (email) {
      const session = await sessions.findOne(
        { email: email.trim().toLowerCase() },
        { projection: { _id: 0 } }
      );
      if (!session) return NextResponse.json({ error: "Email inconnu" }, { status: 404 });
      return NextResponse.json({ sessionId: session.sessionId, session });
    }

    if (clerkUserId) {
      const session = await sessions.findOne(
        { clerkUserId },
        { projection: { _id: 0 } }
      );
      if (!session) return NextResponse.json({ error: "Utilisateur inconnu" }, { status: 404 });
      return NextResponse.json({ sessionId: session.sessionId, session });
    }

    return NextResponse.json({ error: "id, email ou clerkUserId requis" }, { status: 400 });
  } catch (err) {
    console.error("GET /api/session error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
