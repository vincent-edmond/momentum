import type { ProfilProspect, Video } from "@/lib/types";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_VIDEO_SEARCH;

/**
 * Provider Pinecone — recherche sémantique via N8N → OpenAI embeddings → Pinecone.
 * Index : newsletter-max-piccinini
 * Namespace : cours (~246 vecteurs de transcriptions de formations chunked)
 * Embeddings : text-embedding-3-small (1536 dims)
 *
 * Input  : { frein, secteur, ca, plan }
 * Output : Video (la plus pertinente pour le profil) ou null
 */
export async function searchVideos(
  profil: ProfilProspect,
  plan: number
): Promise<Video | null> {
  if (!WEBHOOK_URL) return null;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        frein: profil.frein,
        secteur: profil.secteur,
        ca: profil.ca,
        plan,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data?.found || !data?.video) return null;

    const v = data.video;
    const video: Video = {
      id: v.id || "pinecone-1",
      titre: v.titre || "Formation Max Piccinini",
      description: v.description || "",
      wistia_url: v.wistia_url || "",
      plan: Array.isArray(v.plan) ? v.plan : [1, 2, 3],
      frein_cible: [],
      ca_cible: [],
    };

    return video;
  } catch {
    return null;
  }
}
