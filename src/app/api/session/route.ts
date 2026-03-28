import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/session
 * Crée une session prospect et la persiste côté serveur.
 *
 * Body attendu :
 * {
 *   prenom: string
 *   email: string
 *   ca: ChiffreAffaires
 *   frein: FreinCroissance
 *   secteur: Secteur
 * }
 *
 * Retourne : { sessionId: string }
 *
 * // TODO: brancher HubSpot — créer/mettre à jour le contact avec
 * //   les propriétés de qualification (ca, frein, secteur, statut_audit_flash).
 * //   Utiliser POST /crm/v3/objects/contacts ou upsert par email.
 *
 * // TODO: brancher Hyros — envoyer l'événement "qualification" pour
 * //   le tracking d'attribution. Endpoint : /data/v1/leads.
 *
 * // TODO: migrer localStorage → cette route pour rendre les sessions
 * //   persistantes inter-appareils.
 */
export async function POST(req: NextRequest) {
  // Implémentation à venir — actuellement géré côté client via localStorage
  const body = await req.json();
  return NextResponse.json(
    { error: "Not implemented — use client-side session for now", body },
    { status: 501 }
  );
}

/**
 * GET /api/session?id={sessionId}
 * Récupère une session existante.
 *
 * // TODO: lire depuis HubSpot ou base de données au lieu du localStorage.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("id");
  return NextResponse.json(
    { error: "Not implemented", sessionId },
    { status: 501 }
  );
}
