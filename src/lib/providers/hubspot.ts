import type { ProfilProspect, Progression } from "@/lib/types";

/**
 * Provider HubSpot — désactivé pour les tests.
 * À brancher sur le workflow N8N "Momentum - HubSpot Sync" une fois prêt.
 *
 * Webhook N8N disponible : https://n8n.agent-ia-max-p.com/webhook/momentum-hubspot
 * Actions : sync_contact | sync_progression | trigger_email
 */

export async function createOrUpdateContact(
  profil: ProfilProspect,
  sessionId: string
): Promise<void> {
  void profil;
  void sessionId;
}

export async function syncProgression(
  email: string,
  progression: Progression
): Promise<void> {
  void email;
  void progression;
}

export async function triggerEmailSequence(
  sessionId: string,
  event: "plan_choisi" | "video_vue" | "etape_complete"
): Promise<void> {
  void sessionId;
  void event;
}
