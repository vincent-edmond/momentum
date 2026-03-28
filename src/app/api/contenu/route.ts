import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contenu
 * Retourne le contenu personnalisé (vidéo, témoignages, lecture) pour un profil + plan.
 *
 * Body attendu :
 * {
 *   sessionId: string
 *   ca: ChiffreAffaires
 *   frein: FreinCroissance
 *   secteur: Secteur
 *   plan: 1 | 2 | 3
 * }
 *
 * Retourne :
 * {
 *   video_principale: Video | null
 *   temoignages: Temoignage[]
 *   lecture: Newsletter | null
 *   etapes: Etape[]
 * }
 *
 * // TODO: brancher Pinecone — recherche sémantique dans le namespace
 * //   "transcripts-formations" pour trouver les vidéos les plus pertinentes.
 * //   Vecteur de requête : embedding(frein + secteur + CA + plan).
 * //   Fallback : filtrage statique sur content.json.
 *
 * // TODO: brancher Google Sheet (ID: 1Pm3_aUZqOrlcJmxGYPGk6-O6RaXVFbWaP0YRjjsmvUc)
 * //   pour récupérer les 213 vidéos réelles avec leurs hash Wistia.
 *
 * // TODO: brancher Wistia API pour résoudre les IDs et récupérer
 * //   les métadonnées (durée, thumbnail) en temps réel.
 *
 * // TODO: brancher Notion API pour récupérer les 80+ newsletters réelles.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(
    { error: "Not implemented — using static content.json for now", body },
    { status: 501 }
  );
}
