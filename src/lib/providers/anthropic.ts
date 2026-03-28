import type { ProfilProspect, DiagnosticPoints } from "@/lib/types";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_DIAGNOSTIC;

/**
 * Provider Anthropic : génération dynamique du diagnostic via N8N vers Claude.
 * Appelle le workflow N8N "Momentum - Diagnostic IA" qui utilise claude-sonnet-4-5
 * avec la voix de Max Piccinini (direct, tutoiement, phrases courtes).
 *
 * Input  : { prenom, ca, frein, secteur }
 * Output : { p1, p2, p3, p4?, p5? }
 */

/** Supprime les tirets cadratins que Claude génère parfois malgré la consigne. */
function sanitise(text: string): string {
  return text.replace(/—/g, ":").trim();
}

export async function generateDiagnostic(
  profil: ProfilProspect
): Promise<DiagnosticPoints | null> {
  if (!WEBHOOK_URL) return null;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: profil.prenom,
        ca: profil.ca,
        frein: profil.frein,
        secteur: profil.secteur,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data?.p1 && data?.p2 && data?.p3) {
      return {
        p1: sanitise(data.p1),
        p2: sanitise(data.p2),
        p3: sanitise(data.p3),
        ...(data.p4 ? { p4: sanitise(data.p4) } : {}),
        ...(data.p5 ? { p5: sanitise(data.p5) } : {}),
      };
    }
    return null;
  } catch {
    return null;
  }
}
