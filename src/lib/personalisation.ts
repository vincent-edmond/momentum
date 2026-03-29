import type {
  ProfilProspect,
  PersonalisationResult,
  Video,
  Temoignage,
  Newsletter,
  ContentData,
  DiagnosticPoints,
  Chemin,
  Etape,
  ChiffreAffaires,
} from "./types";
import contentData from "@/data/content.json";
import diagnosticsData from "@/data/diagnostics.json";
import cheminsData from "@/data/chemins.json";

// Providers — retournent null tant que non branchés (fallback automatique)
import { searchVideos } from "./providers/pinecone";
import { generateDiagnostic } from "./providers/anthropic";
import {
  createOrUpdateContact,
  syncProgression,
} from "./providers/hubspot";

const data = contentData as ContentData;

const diagnostics = diagnosticsData as Record<
  string,
  Record<string, DiagnosticPoints>
>;
const chemins = cheminsData as Record<
  string,
  { plan1: Chemin; plan2: Chemin; plan3: Chemin }
>;

// ─── Diagnostic ──────────────────────────────────────────────────────────────

/**
 * Retourne les 3 points de diagnostic.
 * Essaie le provider Anthropic (N8N → Claude) en premier, fallback sur diagnostics.json.
 */
async function getDiagnosticPoints(
  profil: ProfilProspect
): Promise<DiagnosticPoints> {
  // p4 et p5 viennent toujours du statique (enrichissement garanti)
  const freinData = diagnostics[profil.frein];
  const caData = freinData?.[profil.ca];
  const staticEnrichment = caData
    ? { p4: caData.p4, p5: caData.p5 }
    : {};

  const fromProvider = await generateDiagnostic(profil);
  if (fromProvider) {
    // N8N fournit p1-p3, on complète avec les p4/p5 statiques
    return { ...fromProvider, ...staticEnrichment };
  }

  // Fallback complet : données statiques diagnostics.json
  if (!caData) {
    return {
      p1: `${profil.prenom}, voici ce que j'ai identifié dans ton profil.`,
      p2: "Ton frein principal impacte directement ta croissance.",
      p3: "Il est temps d'agir concrètement.",
    };
  }
  return {
    p1: caData.p1.replace("{secteur}", profil.secteur.toLowerCase()),
    p2: caData.p2,
    p3: caData.p3,
    p4: caData.p4,
    p5: caData.p5,
  };
}

// ─── Chemins ─────────────────────────────────────────────────────────────────

function getChemins(
  profil: ProfilProspect
): { plan1: Chemin; plan2: Chemin; plan3: Chemin } {
  const freinChemins = chemins[profil.frein];
  if (!freinChemins) return chemins[Object.keys(chemins)[0]];
  return freinChemins;
}

// ─── Règle d'accès programme ─────────────────────────────────────────────────

/**
 * Les utilisateurs < 200K n'ont accès qu'au programme MentorMax (MM).
 * Les utilisateurs 200K+ ont accès à MentorMax ET MaxMastermind (3M).
 */
function canAccess3M(ca: ChiffreAffaires): boolean {
  return ca !== "< 200K";
}

function filterVideosByAccess(videos: Video[], ca: ChiffreAffaires): Video[] {
  if (canAccess3M(ca)) return videos;
  // Filtre : exclure les vidéos taguées 3M (MaxMastermind)
  return videos.filter((v) => !v.programme || v.programme === "MM");
}

// ─── Vidéos ───────────────────────────────────────────────────────────────────

/**
 * Sélectionne jusqu'à 3 vidéos pertinentes (principale + supplémentaires).
 * Respecte la règle d'accès programme (MM vs 3M).
 */
async function selectVideos(
  profil: ProfilProspect,
  plan: number
): Promise<{ principale: Video | null; supplementaires: Video[] }> {
  const fromProvider = await searchVideos(profil, plan);
  const { ca, frein } = profil;

  // Pool de vidéos accessibles (sans les Q&R)
  const QR_PATTERN = /q\s*[&\/]\s*r|questions?\s*[&\/—-]?\s*r[eé]ponses?|q\s*&\s*a|\bq\s*r\b/i;
  const accessible = filterVideosByAccess(data.videos, ca).filter(
    (v) => !QR_PATTERN.test(v.titre)
  );

  let candidates: Video[] = [];

  // 1. Exact match (frein + CA + plan)
  const exact = accessible.filter(
    (v) => v.frein_cible.includes(frein) && v.ca_cible.includes(ca) && v.plan.includes(plan)
  );
  // 2. Frein + plan
  const freinPlan = accessible.filter(
    (v) => v.frein_cible.includes(frein) && v.plan.includes(plan)
  );
  // 3. Frein seul
  const freinOnly = accessible.filter((v) => v.frein_cible.includes(frein));
  // 4. Tout le reste (fallback)
  const rest = accessible;

  // Construire un pool sans doublons
  const seen = new Set<string>();
  for (const list of [exact, freinPlan, freinOnly, rest]) {
    for (const v of list) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        candidates.push(v);
      }
    }
    if (candidates.length >= 3) break;
  }

  // Provider Pinecone supplante la première vidéo si disponible
  const principale = fromProvider ?? candidates[0] ?? null;
  const supplementaires = candidates
    .filter((v) => v.id !== principale?.id)
    .slice(0, 2);

  return { principale, supplementaires };
}

// ─── Témoignages ─────────────────────────────────────────────────────────────

/**
 * // TODO: brancher HubSpot success_stories pour les témoignages réels.
 */
function selectTemoignages(
  profil: ProfilProspect,
  plan: number
): Temoignage[] {
  const { secteur } = profil;

  const secteurPlan = data.temoignages.filter(
    (t) => t.secteur_cible.includes(secteur) && t.plan.includes(plan)
  );
  if (secteurPlan.length >= 2) return secteurPlan.slice(0, 2);

  const secteurOnly = data.temoignages.filter((t) =>
    t.secteur_cible.includes(secteur)
  );
  if (secteurOnly.length >= 2) return secteurOnly.slice(0, 2);

  const hauteEmotion = data.temoignages.filter(
    (t) => t.haute_emotion && !secteurOnly.includes(t)
  );
  return [...secteurOnly, ...hauteEmotion].slice(0, 2);
}

// ─── Lecture ─────────────────────────────────────────────────────────────────

/**
 * // TODO: brancher Notion API pour les 80+ newsletters réelles.
 */
function selectLecture(profil: ProfilProspect): Newsletter | null {
  const match = data.newsletters.find((n) => n.theme.includes(profil.frein));
  return match || data.newsletters[0] || null;
}

// ─── Étapes ──────────────────────────────────────────────────────────────────

function getEtapes(profil: ProfilProspect, plan: 1 | 2 | 3): Etape[] {
  const freinChemins = getChemins(profil);
  const planKey = `plan${plan}` as keyof typeof freinChemins;
  return freinChemins[planKey]?.etapes || [];
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

/**
 * Orchestrateur principal — async pour absorber les providers N8N.
 * Appelle HubSpot (fire-and-forget), puis Pinecone + Anthropic en parallèle.
 */
export async function personalise(
  profil: ProfilProspect,
  plan: 1 | 2 | 3 = 2,
  sessionId?: string
): Promise<PersonalisationResult> {
  // Side-effect HubSpot (fire-and-forget, ne bloque pas le rendu)
  if (sessionId) {
    createOrUpdateContact(profil, sessionId).catch(() => {});
  }

  // Appels parallèles pour minimiser la latence
  const [diagnostic, videos] = await Promise.all([
    getDiagnosticPoints(profil),
    selectVideos(profil, plan),
  ]);

  return {
    diagnostic,
    chemins: getChemins(profil),
    contenu: {
      video_principale: videos.principale,
      videos_supplementaires: videos.supplementaires,
      temoignages: selectTemoignages(profil, plan),
      lecture: selectLecture(profil),
      etapes: getEtapes(profil, plan),
    },
  };
}

/**
 * Retourne uniquement le diagnostic et les chemins (pour la page /diagnostic).
 */
export async function getDiagnosticEtChemins(profil: ProfilProspect): Promise<{
  diagnostic: DiagnosticPoints;
  chemins: { plan1: Chemin; plan2: Chemin; plan3: Chemin };
}> {
  return {
    diagnostic: await getDiagnosticPoints(profil),
    chemins: getChemins(profil),
  };
}

// Re-export pour les pages
export { syncProgression };
