# Momentum — État du projet (référence persistante)

> Mis à jour : 2026-03-29. Ce fichier est la mémoire du projet. À relire au début de chaque session.

---

## 🎯 Vue d'ensemble

**Momentum** est un SaaS de coaching business pour Max Piccinini.
Un prospect s'inscrit, complète un onboarding de qualification, et accède à un dashboard personnalisé (vidéos, diagnostic IA, plan d'action).

- **Production** : https://momentum-diagnostic-ia.netlify.app
- **GitHub** : https://github.com/vincent-edmond/momentum (branche `main`)
- **Stack** : Next.js 16 (App Router, Turbopack) · TypeScript · MongoDB Atlas · Clerk v7 · Netlify

---

## 🔑 Variables d'environnement

### Netlify (production) — déjà configurées
| Variable | Note |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_ZW5vdWdoLXRvYWQtOS5jbGVyay5hY2NvdW50cy5kZXYk` |
| `CLERK_SECRET_KEY` | `sk_test_wQLgjSVQp9S0kRVGoOJr2AfeT5R8JtOOz9GNxnV24e` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-in` |
| `MONGODB_URI` | Configurée (Atlas cluster) |
| `ANTHROPIC_API_KEY` | Configurée |
| `PINECONE_API_KEY` | Configurée |
| `WISTIA_ACCESS_TOKEN` | Configurée |

### Local — `.env.local`
Même variables que Netlify. Fichier présent et fonctionnel.

### ⚠️ Instance Clerk : DEV (`pk_test_`)
Clerk est en instance de développement. Pas de domaine custom → impossible de passer en prod Clerk pour l'instant. Comportement : le middleware utilise un redirect explicite (pas `auth.protect()`) pour éviter le bug `dev-browser-missing`.

---

## 🗺️ Architecture des routes

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Landing page opt-in (dark navy, inspiré mc-maxpiccinini-lp.netlify.app) |
| `/sign-in` | Public | Clerk auth (Google OAuth + email/password) |
| `/qualify` | Auth requis → redirect `/sign-in` | Onboarding qualification (4 étapes) |
| `/dashboard/[sessionId]` | Auth requis | Dashboard personnalisé |
| `/diagnostic/[sessionId]` | Auth requis | Diagnostic IA |
| `/chat/[sessionId]` | Auth requis | Chat IA |
| `/guide-ca` | Auth requis | Guide CA |
| `/guide-trso` | Auth requis | Guide TRSO |
| `/api/session` | Public (API) | CRUD sessions MongoDB |
| `/api/chat` | Public (API) | Chat IA (Anthropic) |
| `/api/progression` | Public (API) | Progression utilisateur |

---

## 🔐 Middleware (`src/middleware.ts`)

```typescript
// Routes publiques : "/", "/sign-in(.*)", "/api(.*)"
// Pour les routes protégées : redirect explicite vers /sign-in?redirect_url=...
// ⚠️ Ne PAS utiliser auth.protect() — bug dev-browser-missing en instance Clerk dev
```

---

## 👤 Flow utilisateur complet

```
1. Landing page (/)
   └── CTA → /sign-in (Clerk : Google OAuth ou email/password)

2. /sign-in
   └── Après auth → redirect vers /qualify

3. /qualify — Onboarding obligatoire (4 étapes)
   ├── Step 0 : Téléphone (QuestionTelephone, libphonenumber-js, E.164)
   ├── Step 1 : CA (< 200K / 200K-500K / 500K-1M / > 1M)
   ├── Step 2 : Frein (Acquisition / Rentabilité / Équipe / Systèmes)
   └── Step 3 : Secteur (15 options)

   Règles :
   - Prenom + email récupérés depuis Clerk (useUser())
   - Si session existante WITH telephone → redirect dashboard (skip onboarding)
   - Si session existante WITHOUT telephone → step 0 obligatoire (migration users anciens)
   - Sans téléphone validé → impossible d'avancer

4. /dashboard/[sessionId] — Accès plateforme
```

---

## 📁 Fichiers clés et leur rôle

### Types (`src/lib/types.ts`)
```typescript
ProfilProspect { prenom, email, telephone?, ca, frein, secteur }
SessionData extends ProfilProspect { sessionId, clerkUserId?, createdAt }
Video, Temoignage, Newsletter, Progression, ContentData, Chemin...
```

### Session (`src/lib/session.ts`)
- `saveSession(profil)` → localStorage + fetch POST /api/session (fire-and-forget)
- `getSessionByClerkUserIdAsync(clerkUserId)` → localStorage puis MongoDB
- `getSessionByEmailAsync(email)` → localStorage puis MongoDB
- Includes `telephone` via spread de ProfilProspect

### API Session (`src/app/api/session/route.ts`)
- **GET** `?id=xxx` | `?email=xxx` | `?clerkUserId=xxx`
  - clerkUserId lookup : `sort: { createdAt: -1 }` (session la plus récente)
- **POST** body : `{ prenom, email, telephone?, ca, frein, secteur, sessionId?, clerkUserId? }`
  - Upsert par sessionId dans MongoDB

### Composants qualify (`src/components/qualify/`)
- `QuestionTelephone.tsx` — Sélecteur pays (🇫🇷🇧🇪🇨🇭🇱🇺🇨🇦🇲🇦🇸🇳🇨🇮🇺🇸🇬🇧) + validation `libphonenumber-js` temps réel, sortie E.164, checkmark vert
- `QuestionCA.tsx`, `QuestionFrein.tsx`, `QuestionSecteur.tsx` — Steps 1-3

### Landing page (`src/app/page.tsx`)
Page full opt-in, design dark navy inspiré du modèle Max. Sections :
Topbar → Hero → Stats → Pain (4 cards) → How it works (3 steps) → What you get (6 items) → For who (❌/✅) → About Max → Final CTA → Footer
- **Mobile** : sticky bottom bar → bottom-sheet modal (slide-up) → CTA `/sign-in`
- **Scroll reveal** : IntersectionObserver + `.reveal` / `.is-visible`

### Personnalisation (`src/lib/personalisation.ts`)
- Sélectionne 3 vidéos par pertinence (ca + frein)
- **Filtre Q&R** : regex `/q\s*[&\/]\s*r|questions?\s*[&\/—-]?\s*r[eé]ponses?/i` — exclut les vidéos Q&R/Q&A
- 190 vidéos dans `content.json`, descriptions synthétiques générées via `claude-haiku-4-5`

### HubSpot (`src/lib/providers/hubspot.ts`)
Actuellement **stub** (no-op). Le webhook N8N est prêt (`https://n8n.agent-ia-max-p.com/webhook/momentum-hubspot`) mais non branché.

---

## 📦 Dépendances notables
- `@clerk/nextjs` v7 — Auth
- `libphonenumber-js` — Validation téléphone (format E.164, pas SMS)
- `mongodb` — Sessions, progressions
- `@pinecone-database/pinecone` — Embeddings RAG
- `@anthropic-ai/sdk` — Chat IA + génération descriptions

---

## 🚀 Commandes de déploiement

```bash
# TypeScript check
npx tsc --noEmit

# Build local
npm run build

# Deploy Netlify production
npx netlify deploy --build --prod

# Variables env Netlify
npx netlify env:list
npx netlify env:set NOM_VAR "valeur"
```

---

## 📋 Tâches en suspens / futures

### Court terme
- [ ] **HubSpot sync** : brancher `createOrUpdateContact()` sur le webhook N8N pour syncer prenom, email, telephone, ca, frein, secteur
- [ ] **Vérification téléphone Layer 2** : optionnel — Twilio Lookup API pour valider que le numéro est réellement attribué (carrier check, pas SMS)
- [ ] **Instance Clerk production** : nécessite un domaine custom. Actuellement `pk_test_` (dev). Fonctionnel mais quelques limitations (dev-browser).

### Moyen terme
- [ ] **Tableau de bord admin** : voir les sessions/prospects dans MongoDB
- [ ] **Email séquences** : brancher `triggerEmailSequence()` HubSpot via N8N
- [ ] **Analytics** : tracker conversion landing → sign-in → qualify → dashboard

---

## 🐛 Bugs corrigés (historique)

| Bug | Fix |
|---|---|
| MongoDB `findOne` par clerkUserId retournait session ancienne | Ajout `sort: { createdAt: -1 }` |
| Step 0 onboarding redemandait prénom+email (déjà dans Clerk) | Suppression step prénom/email, prénom/email récupérés depuis `useUser()` |
| Videos Q&R affichées dans la sélection | Filtre regex dans `selectVideos()` |
| Descriptions vidéos = extraits de transcription | Régénérées via `claude-haiku-4-5` (script `scripts/generate-descriptions.mjs`) |
| Landing page `/` retournait 404 | Route `"/"` ajoutée aux routes publiques Clerk middleware |
| `auth.protect()` retournait 404 (dev-browser-missing) | Remplacé par `NextResponse.redirect()` explicite |
| `CLERK_SECRET_KEY` absent de Netlify | Clé ajoutée via `npx netlify env:set` |
| `telephone` non persisté en MongoDB | Extrait du body POST et inclus dans `sessionData` |
