import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/diagnostic
 * Génère le diagnostic personnalisé pour un profil prospect.
 *
 * Body attendu :
 * {
 *   sessionId: string
 *   prenom: string
 *   ca: ChiffreAffaires
 *   frein: FreinCroissance
 *   secteur: Secteur
 * }
 *
 * Retourne :
 * {
 *   diagnostic: { p1: string, p2: string, p3: string }
 *   chemins: { plan1: Chemin, plan2: Chemin, plan3: Chemin }
 * }
 *
 * // TODO: brancher Anthropic API (Claude claude-sonnet-4-6) pour générer
 * //   un diagnostic dynamique avec la voix de Max Piccinini.
 * //   Prompt système : inclure le secteur exact, le CA, le frein,
 * //   et des exemples de style tirés des newsletters réelles.
 * //   Enrichissement : récupérer des extraits Pinecone (namespace
 * //   "transcripts-formations") pour contextualiser le diagnostic.
 *
 * // TODO: logger chaque diagnostic généré dans HubSpot
 * //   (propriété "derniere_page_vue" = "diagnostic").
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(
    { error: "Not implemented — using static diagnostics.json for now", body },
    { status: 501 }
  );
}
