import type { ProfilProspect, SessionData, Progression, ChatMessage } from "./types";

type ProfilWithClerk = ProfilProspect & { clerkUserId?: string };

function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Session ──────────────────────────────────────────────────────────────────

/**
 * Sauvegarde la session dans localStorage ET sur le serveur (Netlify Blobs).
 * Le localStorage reste la source primaire (instantané).
 * Le serveur est le backup cross-device (async, fire-and-forget).
 */
export function saveSession(profil: ProfilWithClerk): string {
  const sessionId = generateSessionId();
  const sessionData: SessionData = {
    ...profil,
    sessionId,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`momentum_${sessionId}`, JSON.stringify(sessionData));
    localStorage.setItem(`momentum_email_${profil.email}`, sessionId);
    localStorage.setItem("momentum_current", sessionId);
    if (profil.clerkUserId) {
      localStorage.setItem(`momentum_clerk_${profil.clerkUserId}`, sessionId);
    }

    // Persistance cross-device — fire and forget
    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profil, sessionId }),
    }).catch(() => {/* silencieux — localStorage reste le fallback */});
  }

  return sessionId;
}

/**
 * Retrouve la session d'un utilisateur par son clerkUserId.
 * 1. localStorage (instantané)
 * 2. Serveur MongoDB (cross-device)
 */
export async function getSessionByClerkUserIdAsync(clerkUserId: string): Promise<SessionData | null> {
  // 1. localStorage
  if (typeof window !== "undefined") {
    const localId = localStorage.getItem(`momentum_clerk_${clerkUserId}`);
    if (localId) {
      const local = getSession(localId);
      if (local) return local;
    }
  }

  // 2. Serveur
  try {
    const res = await fetch(`/api/session?clerkUserId=${encodeURIComponent(clerkUserId)}`);
    if (!res.ok) return null;
    const data = await res.json() as { sessionId: string; session: SessionData };
    if (data.session && typeof window !== "undefined") {
      localStorage.setItem(`momentum_${data.sessionId}`, JSON.stringify(data.session));
      localStorage.setItem(`momentum_clerk_${clerkUserId}`, data.sessionId);
      localStorage.setItem("momentum_current", data.sessionId);
    }
    return data.session ?? null;
  } catch {
    return null;
  }
}

/**
 * Retrouve la session d'un utilisateur par son email.
 * 1. Cherche dans localStorage (instantané)
 * 2. Si absent, interroge le serveur (cross-device)
 */
export async function getSessionByEmailAsync(email: string): Promise<SessionData | null> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. localStorage d'abord
  if (typeof window !== "undefined") {
    const localId = localStorage.getItem(`momentum_email_${normalizedEmail}`);
    if (localId) {
      const local = getSession(localId);
      if (local) return local;
    }
  }

  // 2. Fallback serveur (cross-device)
  try {
    const res = await fetch(`/api/session?email=${encodeURIComponent(normalizedEmail)}`);
    if (!res.ok) return null;
    const data = await res.json() as { sessionId: string; session: SessionData };
    if (data.session && typeof window !== "undefined") {
      // Hydrate le localStorage pour les prochains accès
      localStorage.setItem(`momentum_${data.sessionId}`, JSON.stringify(data.session));
      localStorage.setItem(`momentum_email_${normalizedEmail}`, data.sessionId);
    }
    return data.session ?? null;
  } catch {
    return null;
  }
}


/**
 * Retourne la session active courante depuis localStorage.
 */
export function getCurrentSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("momentum_current");
}

/**
 * Récupère la session par sessionId.
 * 1. localStorage (instantané)
 * 2. Serveur si absent (cross-device — ex: lien partagé sur autre device)
 */
export async function getSessionAsync(sessionId: string): Promise<SessionData | null> {
  // 1. localStorage
  const local = getSession(sessionId);
  if (local) return local;

  // 2. Serveur
  try {
    const res = await fetch(`/api/session?id=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return null;
    const data = await res.json() as { session: SessionData };
    if (data.session && typeof window !== "undefined") {
      localStorage.setItem(`momentum_${sessionId}`, JSON.stringify(data.session));
    }
    return data.session ?? null;
  } catch {
    return null;
  }
}

/**
 * Récupère la session synchroniquement depuis localStorage uniquement.
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

// ─── Chat history ─────────────────────────────────────────────────────────────

export function getChatHistory(sessionId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(`momentum_chat_${sessionId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChatMessage(sessionId: string, msg: ChatMessage): void {
  if (typeof window === "undefined") return;
  const history = getChatHistory(sessionId);
  history.push(msg);
  const trimmed = history.slice(-100);
  localStorage.setItem(`momentum_chat_${sessionId}`, JSON.stringify(trimmed));
}

// ─── Progression ──────────────────────────────────────────────────────────────

function computeScore(p: Omit<Progression, "score" | "updatedAt">): number {
  let score = 0;
  if (p.plan_choisi) score += 33;
  if (p.video_watched) score += 33;
  const etapeScore = Math.min(p.etape_courante, 3) * Math.floor(34 / 3);
  score += etapeScore;
  return Math.min(score, 100);
}

/**
 * Sauvegarde la progression dans localStorage ET sur le serveur.
 */
export function saveProgression(sessionId: string, plan: 1 | 2 | 3): Progression {
  const progression: Progression = {
    sessionId,
    plan,
    etape_courante: 0,
    video_watched: false,
    plan_choisi: true,
    score: 33,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`momentum_prog_${sessionId}`, JSON.stringify(progression));

    // Sync serveur
    fetch("/api/progression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, plan, plan_choisi: true }),
    }).catch(() => {});
  }

  return progression;
}

/**
 * Récupère la progression.
 * 1. localStorage (instantané)
 * 2. Serveur si absent (cross-device)
 */
export async function getProgressionAsync(sessionId: string): Promise<Progression | null> {
  const local = getProgression(sessionId);
  if (local) return local;

  try {
    const res = await fetch(`/api/progression?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return null;
    const data = await res.json() as { progression: Progression };
    if (data.progression && typeof window !== "undefined") {
      localStorage.setItem(`momentum_prog_${sessionId}`, JSON.stringify(data.progression));
    }
    return data.progression ?? null;
  } catch {
    return null;
  }
}

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
 * Met à jour la progression et sync serveur.
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
    localStorage.setItem(`momentum_prog_${sessionId}`, JSON.stringify(updated));

    // Sync serveur
    fetch("/api/progression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...updates }),
    }).catch(() => {});
  }

  return updated;
}
