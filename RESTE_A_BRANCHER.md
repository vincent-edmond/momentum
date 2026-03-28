# RESTE A BRANCHER - Momentum App

## 1. Donnees a remplacer

### Videos (content.json)
- Les 10 videos mock doivent etre remplacees par les 213 videos reelles
- Source : Google Sheet `1Pm3_aUZqOrlcJmxGYPGk6-O6RaXVFbWaP0YRjjsmvUc`
- Les `wistia_url` sont tous des placeholders (format : `https://fast.wistia.com/embed/medias/placeholder-*`)
- Ajouter/ajuster le champ `plan: [1,2,3]` pour chaque video reelle selon son horizon

### Temoignages (content.json)
- Les 9 temoignages mock doivent etre remplaces par les temoignages reels
- Les `video_url` sont des placeholders
- Les citations et resultats chiffres sont fictifs
- A sourcer depuis : CRM HubSpot ou base interne Max Piccinini

### Newsletters (content.json)
- Les 4 newsletters mock doivent etre remplacees par les 80+ newsletters reelles
- Source : Notion/Cowork (newsletters loguees)
- Les extraits actuels sont des approximations du style Max Piccinini

### Diagnostics (diagnostics.json)
- Les 16 combinaisons (4 freins x 4 CA) sont du contenu redactionnel - a valider avec Max
- Aucun branchement API requis : c'est du contenu statique editorial

### Chemins (chemins.json)
- Les 12 plans (4 freins x 3 horizons) sont du contenu statique - a valider avec Max
- Les etapes et descriptions sont editoriaux

## 2. Connexions API a activer

Chaque API a son point d'entree dedié dans `src/lib/providers/`. Les providers retournent `null`
tant qu'ils ne sont pas branchés — le moteur `personalisation.ts` bascule automatiquement sur le
fallback mock.

### HubSpot (priorite haute)
- **Provider** : `src/lib/providers/hubspot.ts` — fonctions `createOrUpdateContact()`, `syncProgression()`, `triggerEmailSequence()`
- **Route API** : `src/app/api/session/route.ts` (POST/GET)
- **Action** : Creer/mettre a jour le contact HubSpot a chaque qualification + tracker la progression
- **Proprietes a mapper** : prenom, email, ca, frein, secteur, plan_choisi, progression_score, etape_courante
- **API key** : deja disponible

### Pinecone (priorite haute)
- **Provider** : `src/lib/providers/pinecone.ts` — fonction `searchVideos()`
- **Route API** : `src/app/api/contenu/route.ts` (POST)
- **Action** : Remplacer le filtrage statique par une recherche semantique
- **Namespace** : `transcripts-formations` (deja configure)
- **Query** : Utiliser le profil prospect (frein + secteur + CA + plan) comme vecteur de recherche

### Wistia (priorite haute)
- **Provider** : `src/lib/providers/wistia.ts` — fonctions `resolveWistiaId()`, `buildEmbedUrl()`
- **Composant** : `src/components/dashboard/VideoCard.tsx`
- **Action** : Remplacer les placeholders par les vrais hash Wistia
- **Format** : Utiliser les endpoints JSON deja utilises dans le pipeline transcript
- **Evenement** : Brancher le callback `onEnd` Wistia pour marquer automatiquement "Marquer comme vu"

### Calendly / Prise de RDV (priorite haute)
- **Composant** : `src/components/dashboard/CTASticky.tsx` — bouton "Parler a un conseiller"
- **Action** : Remplacer le bouton par l'embed ou le lien Calendly reel

### Anthropic/Claude API (priorite moyenne)
- **Provider** : `src/lib/providers/anthropic.ts` — fonction `generateDiagnostic()`
- **Route API** : `src/app/api/diagnostic/route.ts` (POST)
- **Action** : Remplacer les templates statiques par une generation dynamique Claude
- **Input** : Profil complet + historique Pinecone pour contexte enrichi
- **Style** : Voix de coach Max Piccinini (direct, phrases courtes, tutoiement)
- **Modele** : `claude-sonnet-4-6`

### Hyros (priorite basse)
- **Route API** : `src/app/api/session/route.ts` et `src/app/api/progression/route.ts`
- **Action** : Envoyer evenements qualification et progression pour tracking attribution
- **API key** : `API_6111391a3167e337967c34b37169a56b5cfe892f9da448be6cf9d01315f440ae`

## 3. TODO dans le code

| Fichier | Fonction | TODO |
|---------|----------|------|
| `src/lib/providers/pinecone.ts` | `searchVideos()` | Brancher Pinecone namespace transcripts-formations |
| `src/lib/providers/anthropic.ts` | `generateDiagnostic()` | Brancher claude-sonnet-4-6, voix coach |
| `src/lib/providers/hubspot.ts` | `createOrUpdateContact()` | Creer/MAJ contact HubSpot |
| `src/lib/providers/hubspot.ts` | `syncProgression()` | Synchro proprietes HubSpot |
| `src/lib/providers/hubspot.ts` | `triggerEmailSequence()` | Declencher sequences n8n |
| `src/lib/providers/wistia.ts` | `resolveWistiaId()` | Resoudre hash Wistia depuis internal ID |
| `src/lib/personalisation.ts` | `selectVideoPrincipale()` | Fallback → Google Sheet 213 videos |
| `src/lib/personalisation.ts` | `selectTemoignages()` | Brancher temoignages reels depuis HubSpot |
| `src/lib/personalisation.ts` | `selectLecture()` | Brancher 80+ newsletters depuis Notion |
| `src/lib/personalisation.ts` | `personalise()` | Logging HubSpot + tracking Hyros |
| `src/app/api/session/route.ts` | POST | HubSpot contact + Hyros qualification |
| `src/app/api/diagnostic/route.ts` | POST | Anthropic API + enrichissement Pinecone |
| `src/app/api/contenu/route.ts` | POST | Pinecone + Google Sheet + Wistia + Notion |
| `src/app/api/progression/route.ts` | POST/GET | HubSpot properties + n8n webhook + Hyros |
| `src/components/dashboard/CTASticky.tsx` | bouton | Remplacer href par lien Calendly reel |

## 4. Prochaines evolutions

### Migration localStorage → base de donnees
- Actuellement : toute la progression est en localStorage (perte si changement d'appareil)
- Migration : HubSpot comme source de verite unique pour session + progression
- Format cle : `momentum_prog_{sessionId}` → propriete HubSpot sur le contact

### Sequences emails automatiques (n8n)
- J+1 : Email "As-tu regarde la video ?" avec lien direct vers dashboard
- J+3 : Email temoignage selon secteur + rappel CTA conseiller
- J+7 : Email diagnostic approfondi si score < 50%
- Trigger : Evenement HubSpot `plan_choisi` → n8n webhook

### Tracking Wistia → progression automatique
- Brancher l'event `wistia:end` pour mettre a jour automatiquement `video_watched: true`
- Eviter de dependre du clic manuel "Marquer comme vu"
- Code : `window._wq.push({ id: wistiaId, onEnd: () => handleVideoWatched() })`

### Diagnostic IA dynamique (Claude API)
- Remplacer les 16 templates statiques de `diagnostics.json` par un prompt Claude
- Input : prenom, ca, frein, secteur + RAG Pinecone sur les transcripts
- Output : 3 paragraphes coach voice, variables p1/p2/p3
- Avantage : personnalisation fine par secteur exact, pas de bucket

## 5. Architecture actuelle

```
src/
  app/
    page.tsx                        → Redirect vers /qualify
    layout.tsx                      → Layout global (meta, fonts)
    globals.css                     → Theme Max Piccinini (noir/blanc/or)
    qualify/
      page.tsx                      → Stepper 4 etapes (optin + qualification)
    diagnostic/
      [sessionId]/
        page.tsx                    → Page plein ecran noir, diagnostic + 3 plans
    dashboard/
      [sessionId]/
        page.tsx                    → Dashboard plan-aware (progression + deverrouillage)
    api/
      session/route.ts              → POST/GET session (TODO: HubSpot + Hyros)
      diagnostic/route.ts           → POST diagnostic (TODO: Anthropic + Pinecone)
      contenu/route.ts              → POST contenu (TODO: Pinecone + GSheet + Wistia + Notion)
      progression/route.ts          → POST/GET progression (TODO: HubSpot + n8n + Hyros)
  components/
    qualify/
      Stepper.tsx                   → Barre de progression 4 etapes
      QuestionCA.tsx                → Question chiffre d'affaires
      QuestionFrein.tsx             → Question frein principal
      QuestionSecteur.tsx           → Question secteur d'activite
    diagnostic/
      DiagnosticBloc.tsx            → Bloc diagnostic (fade-in anime)
      CheminCard.tsx                → Carte plan (3 horizons)
    dashboard/
      VideoCard.tsx                 → Lecteur video + "Marquer comme vu"
      TemoignageCard.tsx            → Carte temoignage client
      LectureCard.tsx               → Carte newsletter (verrouillee si video non vue)
      ProgressionBar.tsx            → Barre de progression 0→100%
      CTASticky.tsx                 → Bandeau sticky "Parler a un conseiller"
  lib/
    types.ts                        → Types TypeScript (ProfilProspect, Chemin, Progression, etc.)
    personalisation.ts              → Orchestrateur (providers → fallback mock)
    session.ts                      → Gestion sessions + progression localStorage
    providers/
      pinecone.ts                   → Stub recherche video semantique (retourne null)
      anthropic.ts                  → Stub generation diagnostic (retourne null)
      hubspot.ts                    → Stub sync CRM (no-op)
      wistia.ts                     → Stub resolution hash video (retourne null)
  data/
    content.json                    → Mock videos (plan[]), temoignages (plan[]), newsletters
    diagnostics.json                → 16 diagnostics editoriaux (4 freins x 4 CA)
    chemins.json                    → 12 plans (4 freins x 3 horizons, avec etapes)
```

## 6. Parcours utilisateur

```
/qualify
  → Etape 0 : Prenom + Email
  → Etape 1 : CA (auto-advance)
  → Etape 2 : Frein principal (auto-advance)
  → Etape 3 : Secteur + "Voir mon diagnostic"
  → saveSession() → redirect /diagnostic/[sessionId]

/diagnostic/[sessionId]
  → Chargement session localStorage
  → Diagnostic 3 points (fade-in sequentiel)
  → 3 cartes plan (plan2 = recommande)
  → Clic plan → /dashboard/[sessionId]?plan=1|2|3

/dashboard/[sessionId]?plan=1|2|3
  → Chargement session + progression localStorage
  → Header sticky : plan + score
  → Progression bar 0→33→66→100%
  → Section 1 : Video principale + "Marquer comme vu"
  → Plan d'action : 3 etapes (2 et 3 verrouillee jusqu'a video vue)
  → Temoignages par secteur
  → Lecture verrouillee jusqu'a video vue
  → Sticky CTA : Parler a un conseiller
```

## 7. Pour lancer

```bash
npm run dev
# Ouvrir http://localhost:3000
# Parcours : / → /qualify → /diagnostic/[id] → /dashboard/[id]?plan=X
```
