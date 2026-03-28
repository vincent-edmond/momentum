import type { ProfilProspect, SessionData, Progression } from "./types";

/**
 * Génère un ID de session unique.
 */
function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sauvegarde les données de session dans localStorage.
 *
 * // TODO: brancher HubSpot — créer/mettre à jour le contact avec
 * les propriétés de qualification (ca, frein, secteur, statut_audit_flash).
 *
 * // TODO: brancher Hyros — envoyer l'événement de qualification
 * pour le tracking d'attribution.
 */
export function saveSession(profil: ProfilProspect): string {
  const sessionId = generateSessionId();
  const sessionData: SessionData = {
    ...profil,
    sessionId,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`momentum_${sessionId}`, JSON.stringify(sessionData));
  }

  return sessionId;
}

/**
 * Récupère les données de session depuis localStorage.
 */
export function getSession(sessionId: string): SessionData | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(`momentum_${sessionId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Calcule le score de progression (0–100) à partir des données de progression.
 */
function computeScore(p: Omit<Progression, "score" | "updatedAt">): number {
  let score = 0;
  if (p.plan_choisi) score += 33;
  if (p.video_watched) score += 33;
  // Les étapes valent le reste (34 pts répartis sur 3 étapes)
  const etapeScore = Math.min(p.etape_courante, 3) * Math.floor(34 / 3);
  score += etapeScore;
  return Math.min(score, 100);
}

/**
 * Sauvegarde la progression du prospect dans localStorage.
 *
 * // TODO: synchroniser avec HubSpot — propriété "progression_score"
 * et "etape_courante" sur le contact.
 */
export function saveProgression(
  sessionId: string,
  plan: 1 | 2 | 3
): Progression {
  const progression: Progression = {
    sessionId,
    plan,
    etape_courante: 0,
    video_watched: false,
    plan_choisi: true,
    score: 33, // plan_choisi = 33 pts
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(
      `momentum_prog_${sessionId}`,
      JSON.stringify(progression)
    );
  }

  return progression;
}

/**
 * Récupère la progression depuis localStorage.
 */
export function getProgression(sessionId: string): Progression | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(`momentum_prog_${sessionId}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Progression;
  } catch {
    return null;
  }
}

/**
 * Met à jour des champs de progression et recalcule le score.
 */
export function updateProgression(
  sessionId: string,
  updates: Partial<Omit<Progression, "sessionId" | "score" | "updatedAt">>
): Progression | null {
  const current = getProgression(sessionId);
  if (!current) return null;

  const merged = { ...current, ...updates };
  const score = computeScore(merged);
  const updated: Progression = {
    ...merged,
    score,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(
      `momentum_prog_${sessionId}`,
      JSON.stringify(updated)
    );
  }

  return updated;
}
