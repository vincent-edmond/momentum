/**
 * Script de génération des descriptions vidéo via Anthropic.
 * Génère des descriptions synthétiques basées sur le titre de chaque vidéo.
 * Usage : node scripts/generate-descriptions.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.join(__dirname, "../src/data/content.json");
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY manquant");
  process.exit(1);
}

async function generateDescription(titre) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `Tu es copywriter pour une formation business haut de gamme.
Écris une description courte (2-3 phrases max, 60-80 mots) pour cette vidéo de formation : "${titre}"

La description doit :
- Expliquer concrètement ce que l'entrepreneur va découvrir ou apprendre
- Être orientée bénéfice (ce qu'il va gagner, éviter, améliorer)
- Être directe, sans introduction ("Dans cette vidéo...")
- Ne PAS commencer par "Cette vidéo", "Dans ce module" ou similaire

Réponds uniquement avec la description, rien d'autre.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

async function main() {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  const content = JSON.parse(raw);
  const videos = content.videos;

  console.log(`📹 ${videos.length} vidéos à traiter\n`);

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const desc = video.description || "";

    // Patterns qui indiquent une transcription (à remplacer)
    const isTranscript =
      /^(Hello|Là,|Alors |Allô|Bonjour|Ça va|Salut|Coucou|Donc,|Bienvenue|Bonsoir|Je vais|On va|Aujourd|dans le cadre|ent |niversel|r semaine|OK |Joseph|Après Kyo|Autre question|On voit l'|[A-Z][a-z]+,\s+[a-z]+)/i.test(desc) ||
      desc.length < 20;

    if (!isTranscript) {
      console.log(`⏭️  [${i + 1}/${videos.length}] SKIP — ${video.titre.slice(0, 60)}`);
      skipped++;
      continue;
    }

    console.log(`✍️  [${i + 1}/${videos.length}] ${video.titre.slice(0, 70)}...`);

    try {
      const newDesc = await generateDescription(video.titre);
      video.description = newDesc;
      updated++;
      console.log(`   ✅ ${newDesc.slice(0, 80)}...`);
    } catch (err) {
      console.error(`   ❌ Erreur: ${err.message}`);
    }

    // Pause pour éviter le rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  // Sauvegarder
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");

  console.log(`\n✅ Terminé — ${updated} descriptions générées, ${skipped} skippées`);
}

main().catch(console.error);
