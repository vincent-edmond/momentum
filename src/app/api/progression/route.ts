import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/progression
 * Crée ou met à jour la progression d'un prospect.
 *
 * Body attendu :
 * {
 *   sessionId: string
 *   plan: 1 | 2 | 3
 *   video_watched?: boolean
 *   etape_courante?: number
 * }
 *
 * Retourne : { progression: Progression }
 *
 * // TODO: persister la progression dans HubSpot (propriétés custom) :
 * //   - momentum_plan_choisi (number)
 * //   - momentum_score (number 0–100)
 * //   - momentum_etape_courante (number)
 * //   - momentum_video_watched (boolean)
 * //   Utiliser PATCH /crm/v3/objects/contacts/{id}.
 *
 * // TODO: déclencher un webhook n8n pour les séquences email :
 * //   - J+1 si video_watched = false
 * //   - J+3 si score < 50 et video_watched = true
 * //   - J+7 si score < 66
 *
 * // TODO: envoyer l'événement Hyros "progression_update" pour
 * //   affiner le scoring d'attribution.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(
    { error: "Not implemented — using localStorage for now", body },
    { status: 501 }
  );
}

/**
 * GET /api/progression?sessionId={id}
 * Récupère la progression d'un prospect.
 *
 * // TODO: lire depuis HubSpot au lieu du localStorage.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  return NextResponse.json(
    { error: "Not implemented", sessionId },
    { status: 501 }
  );
}
