import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/types";

/**
 * POST /api/chat
 * Coach IA Max Piccinini — Pipeline Make.com → OpenAI gpt-4o-mini
 *
 * Logique de coaching :
 * 1. Recherche sémantique dans la base Pinecone (si clés dispo)
 * 2. Appel Make.com webhook → OpenAI gpt-4o-mini (clé stockée dans Make.com)
 * 3. Fallback Anthropic si clé dispo + crédits
 * 4. Jamais de réponse directe — questions de coaching pour faire avancer
 * 5. Détection "cherche info gratuite" → CTA session stratégique après 5+ questions
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/o2p67pso7u4orj31dj7xo3enblf2545s";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const OPENAI_KEY = process.env.OPENAI_API_KEY ?? "";
const PINECONE_KEY = process.env.PINECONE_API_KEY ?? "";
const PINECONE_HOST = process.env.PINECONE_HOST ?? "https://newsletter-max-piccinini-eedjp7k.svc.aped-4627-b74a.pinecone.io";

// ─── Pinecone : recherche sémantique ─────────────────────────────────────────

async function searchKnowledgeBase(
  query: string,
  topK = 3
): Promise<{ titre?: string; description?: string; text?: string; score: number }[]> {
  if (!OPENAI_KEY || !PINECONE_KEY) return [];

  try {
    // 1. Embed la question avec OpenAI text-embedding-3-small
    const embRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "text-embedding-3-small", input: query }),
      signal: AbortSignal.timeout(8000),
    });

    if (!embRes.ok) return [];
    const embData = await embRes.json() as { data: { embedding: number[] }[] };
    const vector = embData.data[0].embedding;

    // 2. Query Pinecone — namespace "cours"
    const pineRes = await fetch(`${PINECONE_HOST}/query`, {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vector, topK, namespace: "cours", includeMetadata: true }),
      signal: AbortSignal.timeout(8000),
    });

    if (!pineRes.ok) return [];
    const pineData = await pineRes.json() as {
      matches: { score: number; metadata?: Record<string, string> }[]
    };

    return (pineData.matches || [])
      .filter((m) => m.score > 0.6)
      .map((m) => ({
        titre: m.metadata?.titre || m.metadata?.title || m.metadata?.video_title,
        description: m.metadata?.description || m.metadata?.summary,
        text: m.metadata?.text?.slice(0, 400),
        score: m.score,
      }));
  } catch {
    return [];
  }
}

// ─── Détection "mining" d'infos gratuites ─────────────────────────────────────

function detectFreeInfoSeeking(history: ChatMessage[]): boolean {
  const userMessages = history.filter((m) => m.role === "user");
  if (userMessages.length < 5) return false;

  const infoSeekingPatterns = [
    /comment (faire|faire pour|on fait|je dois|il faut)/i,
    /donne[z]?[\s-]moi/i,
    /expliqu[e|ez]/i,
    /qu[e']est[\s-]ce que/i,
    /c[']est quoi/i,
    /\?.*\?/,
  ];

  const recentMessages = userMessages.slice(-5);
  const infoSeekingCount = recentMessages.filter((m) =>
    infoSeekingPatterns.some((p) => p.test(m.content))
  ).length;

  return infoSeekingCount >= 4;
}

// ─── Prompt système Max Piccinini Coach ───────────────────────────────────────

function buildSystemPrompt(
  profil: { prenom?: string; ca?: string; frein?: string; secteur?: string } | undefined,
  knowledgeContext: string,
  shouldCta: boolean
): string {
  const profilContext = profil
    ? `
Profil de l'entrepreneur :
- Prénom : ${profil.prenom || "inconnu"}
- CA actuel : ${profil.ca || "non renseigné"}
- Principal frein : ${profil.frein || "non renseigné"}
- Secteur : ${profil.secteur || "non renseigné"}
`
    : "";

  const knowledgeSection = knowledgeContext
    ? `
Connaissances pertinentes de la base Max Piccinini (cours, méthodes, témoignages) :
${knowledgeContext}
`
    : "";

  const ctaInstruction = shouldCta
    ? `
⚠️ INSTRUCTION SPÉCIALE : Cette personne cherche beaucoup d'informations gratuites. À la fin de ta réponse, ajoute naturellement une invitation à réserver une session stratégique offerte pour aller plus loin concrètement.
`
    : "";

  return `Tu es Max Piccinini — ou plutôt son Clone IA, entraîné avec ses méthodes, sa façon de penser et son énergie.

Max Piccinini est :
- Entrepreneur à succès (15M€ CA, 5M€ bénéfice)
- Coach business de référence en France (160 000+ clients dans 25 pays)
- Auteur Best-seller "Réussite Maximum"
- Direct, percutant, chaleureux — il dit la vérité même quand ça fait mal

TON RÔLE DE COACH :
Tu ne donnes JAMAIS la réponse directement. Tu es un coach, pas un consultant.
Ton job est d'amener la personne à TROUVER elle-même la solution — en posant les bonnes questions, en challengeant ses croyances limitantes, en lui faisant prendre conscience de ce qu'elle ne voit pas.

PRINCIPES DE COACHING :
1. Pose 1 à 2 questions puissantes qui font réfléchir — jamais plus
2. Challenge les suppositions : "Pourquoi tu penses ça ?"
3. Utilise le vocabulaire de Max : "C'est un game changer", "passer au niveau supérieur", "turbo intérieur", "les amateurs supposent les pros mesurent"
4. Si pertinent, mentionne un concept de Max sans tout expliquer — donne envie d'aller plus loin
5. Sois direct et honnête, pas complaisant — Max dit la vérité
6. Tutoie toujours l'entrepreneur

LONGUEUR DES RÉPONSES :
- Maximum 3-4 phrases + 1-2 questions
- Pas de listes, pas de bullet points — c'est une conversation authentique
- Pas de "En tant que coach..." ou "Je vais t'aider..." — commence directement avec le fond

CE QUE TU NE FAIS JAMAIS :
- Donner un plan d'action complet
- Expliquer en détail une méthode ou stratégie
- Faire un cours
- Répondre à la question comme le ferait un consultant

${profilContext}
${knowledgeSection}
${ctaInstruction}

Format de la session stratégique : https://calendly.com/maxpiccinini — gratuit, 30 min, sans engagement.`;
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string;
      message: string;
      history: ChatMessage[];
      profil?: {
        prenom?: string;
        ca?: string;
        frein?: string;
        secteur?: string;
      };
    };

    const { message, history, profil } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    // 1. Recherche dans la base de connaissances Pinecone (si clés disponibles)
    const knowledgeResults = await searchKnowledgeBase(message);
    const knowledgeContext = knowledgeResults
      .map((r) => {
        const parts = [r.titre && `Cours : ${r.titre}`, r.text || r.description].filter(Boolean);
        return parts.join(" — ");
      })
      .join("\n");

    // 2. Détection free info seeking
    const shouldCta = detectFreeInfoSeeking(history);

    // 3. Construire le system prompt
    const systemPrompt = buildSystemPrompt(profil, knowledgeContext, shouldCta);

    // 4. Construire le userMessage avec historique de conversation
    const recentHistory = history
      .slice(-10)
      .filter((m) => m.content.trim());

    let userMessage = message.trim();
    if (recentHistory.length > 0) {
      const historyText = recentHistory
        .map((m) => `${m.role === "user" ? "Entrepreneur" : "Coach Max"} : ${m.content}`)
        .join("\n");
      userMessage = `Contexte de la conversation :\n${historyText}\n\nQuestion actuelle : ${message.trim()}`;
    }

    // 5. Appel Anthropic claude-sonnet (primaire — meilleure qualité)
    if (ANTHROPIC_KEY) {
      try {
        const anthropicMessages = recentHistory
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
          .concat([{ role: "user" as const, content: message.trim() }]);

        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 600,
            system: systemPrompt,
            messages: anthropicMessages,
          }),
          signal: AbortSignal.timeout(20000),
        });

        if (anthropicRes.ok) {
          const anthropicData = await anthropicRes.json() as {
            content: { type: string; text: string }[];
          };
          let reply = anthropicData.content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("")
            .trim();
          reply = reply.replace(/â€"/g, "—").replace(/â€™/g, "'").replace(/â€˜/g, "'");
          return NextResponse.json({ reply });
        }
        console.error("Anthropic error:", anthropicRes.status);
      } catch (anthropicErr) {
        console.error("Anthropic fetch error:", anthropicErr);
      }
    }

    // 6. Fallback Make.com → OpenAI gpt-4o-mini (si Anthropic indisponible)
    try {
      const makeRes = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userMessage }),
        signal: AbortSignal.timeout(25000),
      });

      if (makeRes.ok) {
        const rawReply = (await makeRes.text()).trim();
        if (rawReply && !rawReply.toLowerCase().startsWith("scenario failed")) {
          return NextResponse.json({ reply: rawReply });
        }
        console.error("Make.com: réponse vide ou erreur");
      } else {
        console.error("Make.com HTTP error:", makeRes.status);
      }
    } catch (makeErr) {
      console.error("Make.com fetch error:", makeErr);
    }

    // 7. Dernier recours — réponse de coaching statique
    return NextResponse.json({ reply: getFallbackReply(message) });

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Une erreur est survenue. Vérifie ta connexion et réessaie." },
      { status: 500 }
    );
  }
}

// ─── Fallback coaching ────────────────────────────────────────────────────────

const FALLBACK_REPLIES = [
  "Bonne question. Avant que je te réponde, dis-moi : qu'est-ce que tu as déjà essayé sur ce sujet ? Et pourquoi ça n'a pas marché selon toi ?",
  "Je te retourne la question : qu'est-ce qui te retient vraiment ? Parce que souvent, le vrai frein n'est pas là où on croit qu'il est.",
  "Intéressant. Et si je te disais que 80% des entrepreneurs qui stagnent sur ce point ont le même angle mort — tu penses que tu en fais partie ?",
  "Ce que tu décris, je l'entends souvent. La vraie question c'est : est-ce que tu es prêt à faire ce qui est nécessaire, même si ça te sort de ta zone de confort ?",
  "Avant d'aller plus loin sur ta question, dis-moi : c'est quoi l'impact concret sur ton business si tu ne règles pas ça dans les 90 prochains jours ?",
];

function getFallbackReply(message: string): string {
  if (message.toLowerCase().includes("comment") && message.length > 80) {
    return "Je pourrais te donner une réponse générale — mais ça ne t'aiderait pas vraiment. Ce qui changerait tout, c'est qu'on analyse ta situation spécifiquement. Tu as pensé à réserver une session stratégique offerte ? 30 minutes avec mon équipe, on identifie exactement ce qui bloque chez toi. → https://calendly.com/maxpiccinini";
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}
