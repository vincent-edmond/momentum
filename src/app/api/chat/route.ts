import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/types";

/**
 * POST /api/chat
 * Envoie un message au clone IA de Max via N8N webhook.
 *
 * Body : { sessionId, message, history: ChatMessage[], profil? }
 * Retour : { reply: string }
 *
 * Le webhook N8N reçoit le contexte complet et répond en tant que Max Piccinini.
 * Fallback statique si N8N non disponible.
 */

const N8N_CHAT_WEBHOOK = process.env.N8N_CHAT_WEBHOOK_URL ?? "";

// Réponses fallback si N8N non connecté
const FALLBACK_RESPONSES = [
  "Bonne question. Pour être direct avec toi : le vrai levier dans ta situation, c'est de clarifier ta proposition de valeur avant de chercher à scaler quoi que ce soit.",
  "Ce que j'ai observé chez des centaines d'entrepreneurs : le problème n'est presque jamais là où on croit qu'il est. Dis-moi en plus sur ta situation concrète.",
  "Voilà ce que je ferais à ta place en ce moment : me concentrer sur les 20% d'actions qui produisent 80% des résultats. Qu'est-ce qui génère le plus de CA chez toi aujourd'hui ?",
  "La réponse courte : oui, c'est possible. La réponse honnête : ça dépend de plusieurs variables dans ton modèle économique. Parle-moi de ton offre principale.",
  "Je vais te donner mon point de vue franc : beaucoup d'entrepreneurs perdent du temps sur des optimisations secondaires. Quel est ton frein numéro 1 en ce moment ?",
];

function getStaticFallback(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

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

    const { sessionId, message, history, profil } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    // Appel N8N si webhook configuré
    if (N8N_CHAT_WEBHOOK) {
      try {
        const res = await fetch(N8N_CHAT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            message,
            history: history.slice(-10), // 10 derniers messages pour le contexte
            profil,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json() as { reply?: string; message?: string; output?: string };
          const reply = data.reply ?? data.message ?? data.output;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch {
        // N8N timeout ou erreur — fallback statique
      }
    }

    // Fallback statique
    const reply = getStaticFallback();
    return NextResponse.json({ reply });

  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
