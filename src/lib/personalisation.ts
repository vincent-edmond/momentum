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

// ─── Vidéo principale ────────────────────────────────────────────────────────

/**
 * Sélectionne la vidéo principale.
 * Essaie Pinecone (N8N → OpenAI embeddings → Pinecone namespace "cours") en premier,
 * fallback sur content.json.
 *
 * // TODO: brancher Google Sheet pour les 213 vidéos réelles en fallback.
 */
async function selectVideoPrincipale(
  profil: ProfilProspect,
  plan: number
): Promise<Video | null> {
  const fromProvider = await searchVideos(profil, plan);
  if (fromProvider) return fromProvider;

  // Fallback : filtrage statique content.json
  const { ca, frein } = profil;

  const exactMatch = data.videos.find(
    (v) =>
      v.frein_cible.includes(frein) &&
      v.ca_cible.includes(ca) &&
      v.plan.includes(plan)
  );
  if (exactMatch) return exactMatch;

  const freinPlan = data.videos.find(
    (v) => v.frein_cible.includes(frein) && v.plan.includes(plan)
  );
  if (freinPlan) return freinPlan;

  const freinCA = data.videos.find(
    (v) => v.frein_cible.includes(frein) && v.ca_cible.includes(ca)
  );
  if (freinCA) return freinCA;

  return (
    data.videos.find(
      (v) => v.frein_cible.length >= 3 && v.ca_cible.length >= 3
    ) || null
  );
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
  const [diagnostic, video_principale] = await Promise.all([
    getDiagnosticPoints(profil),
    selectVideoPrincipale(profil, plan),
  ]);

  return {
    diagnostic,
    chemins: getChemins(profil),
    contenu: {
      video_principale,
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
