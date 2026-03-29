"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "@/lib/session";
import { AppLayout } from "@/components/layout/AppLayout";
import type { SessionData } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Levier {
  id: number;
  emoji: string;
  titre: string;
  accroche: string;
  contenu: React.ReactNode;
}

// ─── Données des leviers ───────────────────────────────────────────────────────

const LEVIERS: Levier[] = [
  {
    id: 1,
    emoji: "💰",
    titre: "Augmentation des prix",
    accroche: "Le levier le plus rapide — et le plus sous-utilisé",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Le prix est l&apos;un des moyens les plus rapides pour augmenter votre rentabilité et votre flux de trésorerie. Malheureusement, trop peu l&apos;activent — par peur de perdre des clients.
        </p>
        <p>
          Avec une inflation à 5% en moyenne, si vous n&apos;avez pas augmenté vos prix depuis 3 ans, vos marges se sont sérieusement réduites. Voire, vous ne gagnez plus d&apos;argent du tout.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-1">L&apos;exemple chiffré qui change tout</p>
          <p className="text-sm text-[#3A3F52]">
            CA de 1M€ — Marges de 200K€. Vous augmentez vos prix de 10%. Les coûts restent identiques.
            Résultat : votre CA monte à 1,1M€ et vos <span className="font-bold">marges passent à 300K€ — soit +50%</span>.
          </p>
        </div>
        <p>
          J&apos;ai recommandé à des centaines de chefs d&apos;entreprise d&apos;augmenter leurs prix. Dans <strong>97% des cas</strong>, cela n&apos;a eu aucun impact sur leurs ventes — mais un impact majeur sur leurs marges.
        </p>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action immédiate : augmentez vos prix de 10% dès ce mois. Vos clients ne le ressentiront probablement pas — mais vous, si.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    emoji: "📈",
    titre: "Augmentation du volume de vente",
    accroche: "Croître sans se noyer — le secret de l'effet ciseau",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Le volume de vente, c&apos;est le nombre total d&apos;unités vendues sur une période. Si vous augmentez vos ventes et que vos marges restent intactes, votre profit monte — ainsi que votre flux de trésorerie.
        </p>
        <p>
          L&apos;objectif ultime : augmenter vos ventes tout en réduisant votre coût de production et de livraison par unité. Cela vous permet d&apos;augmenter vos marges et donc l&apos;argent qui vous reste en poche.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-700 text-sm mb-1">⚠️ L&apos;effet ciseau : le piège classique</p>
          <p className="text-sm text-red-600">
            Quand vous appuyez sur la pédale de la croissance, surveillez absolument que vos marges ne s&apos;effondrent pas. Doubler son CA mais multiplier ses charges par 6, c&apos;est avoir <strong>moins d&apos;argent</strong> qu&apos;avant.
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : calculez votre marge par unité vendue aujourd&apos;hui. Avant tout plan de croissance, assurez-vous qu&apos;elle ne baissera pas.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    emoji: "✂️",
    titre: "Réduction des coûts directs",
    accroche: "Chaque euro économisé va directement dans votre poche",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Les coûts directs sont les charges directement liées à la production de votre produit ou service : matières premières, sous-traitants, fournisseurs, logistique.
        </p>
        <p>
          Contrairement à votre CA, chaque euro économisé sur vos coûts directs va <strong>intégralement dans votre marge</strong>. C&apos;est un levier puissant car il n&apos;exige pas de trouver de nouveaux clients.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Questions à vous poser :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Avez-vous renégocié vos contrats fournisseurs cette année ?</li>
            <li>→ Pouvez-vous regrouper des achats pour obtenir des remises de volume ?</li>
            <li>→ Y a-t-il des postes de coûts que vous payez par habitude sans les challenger ?</li>
            <li>→ Des prestataires moins chers offrent-ils la même qualité ?</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : listez vos 10 principaux postes de coûts directs et challengez-en au moins 3 cette semaine. Une réduction de 5% peut transformer votre rentabilité.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    emoji: "👥",
    titre: "Réduction de la masse salariale",
    accroche: "La décision difficile qui a multiplié mon bénéfice par 10",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Je suis le premier à encourager à bien payer les bons membres d&apos;une équipe. Mais il fut un temps où j&apos;avais trop de personnes que je payais trop, par rapport à leurs compétences et aux besoins réels de l&apos;entreprise.
        </p>
        <p>
          Mon expert-comptable m&apos;a dit un jour : <em>&quot;Max, avec la taille de ton entreprise, il y a trop de monde.&quot;</em> J&apos;avais un CFO et un CEO à plus de 10 000€/mois chacun — alors que mon entreprise ne le nécessitait pas.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-bold text-emerald-800 text-sm mb-1">🚀 Le résultat concret</p>
          <p className="text-sm text-emerald-700">
            Après avoir pris les décisions difficiles, mon bénéfice a fait <strong>×10 en 12 mois</strong>. Je suis passé de 150 000€ à plus de 1,5 million € de bénéfices. Et pour la première fois, j&apos;ai vu + d&apos;1 million€ sur mon compte d&apos;entreprise.
          </p>
        </div>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Astuces pratiques :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Certains collaborateurs seront ravis de réduire leur temps de travail</li>
            <li>→ Faites appel à des freelances pour les postes non critiques à plein temps</li>
            <li>→ Analysez chaque ligne de coûts : est-ce vraiment nécessaire à ce niveau-là ?</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : faites l&apos;audit de votre masse salariale. Posez-vous la question : &quot;Est-ce que cette personne est payée au juste mérite de ce qu&apos;elle génère ?&quot;
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    emoji: "📊",
    titre: "Augmentation des marges par produit",
    accroche: "Les amateurs supposent, les pros mesurent",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          En tant que Chef d&apos;entreprise, il est essentiel que vous ayez un <strong>tableau de marge</strong>. Vous devez connaître précisément quelles sont vos marges par produit ou service.
        </p>
        <div className="bg-[#000D2B] rounded-xl p-4">
          <p className="text-white/90 text-sm italic">
            &quot;Max, si tu ne connais pas tes marges, comment tu sais où te focaliser pour les augmenter ?&quot;
          </p>
          <p className="text-white/40 text-xs mt-2">— Le mentor américain qui a changé ma vie</p>
        </div>
        <p>
          Le jour où j&apos;ai eu mon tableau de marge, j&apos;ai découvert que 80% de mon énergie allait sur un produit à 15% de marge — alors qu&apos;on consacrait 5% d&apos;énergie à un produit à <strong>85% de marge</strong>.
        </p>
        <p>
          Une seule décision : se concentrer sur le produit à forte marge. Résultat : ma trésorerie a explosé et je me suis retrouvé avec + d&apos;1 million€ sur mon compte d&apos;entreprise.
        </p>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : créez votre tableau de marge par produit/service. Identifiez votre produit le plus rentable et doublez vos efforts dessus cette semaine.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    emoji: "⏱️",
    titre: "Diminuer les créances",
    accroche: "550 000€ envolés — la leçon la plus coûteuse de ma vie",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Vos créances désignent les sommes d&apos;argent que vos clients vous doivent — des factures envoyées mais pas encore réglées. Quand les créances montent, c&apos;est de l&apos;argent <strong>dehors</strong> qui n&apos;est pas sur votre compte.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-700 text-sm mb-1">💸 Ma leçon à 400 000€</p>
          <p className="text-sm text-red-600">
            À mes débuts, personne ne surveillait mes créances. Elles ont gonflé à plus de 550 000€ en moins d&apos;un an. J&apos;en ai récupéré 150 000€ au total. Une leçon douloureuse que je n&apos;ai jamais oubliée.
          </p>
        </div>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Système à mettre en place :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Nommez un responsable dont la mission est de surveiller les créances</li>
            <li>→ Mesurez l&apos;évolution chaque semaine (monte ou descend ?)</li>
            <li>→ Relancez systématiquement à J+3 après l&apos;échéance</li>
            <li>→ Mettez des pénalités de retard claires dans vos contrats</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : vérifiez maintenant le montant total de vos créances. Si vous n&apos;avez pas de processus de relance automatique, mettez-en un en place aujourd&apos;hui.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    emoji: "📦",
    titre: "Réduction des stocks",
    accroche: "Chaque euro qui dort dans un entrepôt est un euro qui ne travaille pas",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Si vous êtes dans une société de service, ce levier ne vous concerne pas directement. Mais si vous stockez des produits, tout stock non vendu, c&apos;est de l&apos;argent qui n&apos;est <strong>pas sur votre compte en banque</strong>.
        </p>
        <p>
          Vous avez payé pour cette marchandise. Tant que vous ne la revendez pas, cet argent dort. Certains membres de mon Mastermind ont ajouté <strong>+ de 100 000€</strong> sur leur compte simplement en optimisant leurs niveaux de stocks.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">2 indicateurs à mesurer en permanence :</p>
          <ul className="text-sm text-[#3A3F52] space-y-2">
            <li>
              <span className="font-bold">1. La valeur totale de vos stocks</span>
              <br />Combien d&apos;argent dort dans votre entrepôt en ce moment ?
            </li>
            <li>
              <span className="font-bold">2. Le taux de rotation des stocks</span>
              <br />En combien de jours revendez-vous votre stock moyen ?
            </li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : nommez un responsable des stocks avec pour mission de réduire ces deux indicateurs chaque mois. Vous verrez l&apos;impact sur votre trésorerie immédiatement.
          </p>
        </div>
      </div>
    ),
  },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function LevierCard({ levier, index }: { levier: Levier; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${open ? "border-[#0046FF]/30" : "border-[#E2E4EA]"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F7F8FA] flex items-center justify-center text-xl">
          {levier.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-[#0046FF] uppercase tracking-widest">
              Levier {levier.id}
            </span>
          </div>
          <h3 className="font-black text-[#0A0A0F] text-sm sm:text-base leading-tight truncate">
            {levier.titre}
          </h3>
          <p className="text-[#9096A5] text-xs mt-0.5 hidden sm:block">{levier.accroche}</p>
        </div>
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open ? "bg-[#0046FF] text-white" : "bg-[#F7F8FA] text-[#9096A5]"}`}>
          <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[#F0F1F4]">
          <p className="text-[#555B6E] text-xs font-medium italic mb-4 pt-4">{levier.accroche}</p>
          {levier.contenu}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function GuideTrsoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    if (sessionId) {
      setSession(getSession(sessionId));
    }
  }, [sessionId]);

  const content = (
    <div className="min-h-screen bg-[#F7F8FA] pb-12">
      <main className="max-w-2xl mx-auto px-4 pt-8">

        {/* Header article */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-[#0046FF] rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-[#0046FF] uppercase tracking-widest">Guide Trésorerie — MentorMax</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0F] leading-tight mb-3">
            Les 7 moyens d&apos;augmenter votre rentabilité et votre flux de trésorerie dès maintenant
          </h1>
          <p className="text-[#555B6E] text-sm leading-relaxed mb-4">
            Par <strong className="text-[#0A0A0F]">Max Piccinini</strong> · Entrepreneur, 15M€ de CA annuel, 5M€ de bénéfice
          </p>

          {/* Alerte intro */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="text-amber-800 font-bold text-sm mb-1">La vérité que personne ne vous dit</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  80% des entreprises qui font faillite sont <em>rentables</em> sur le papier — mais elles meurent par manque de cash. La trésorerie, c&apos;est l&apos;oxygène de votre entreprise. Sans cash, pas de survie.
                </p>
              </div>
            </div>
          </div>

          {/* Intro éditoriale */}
          <div className="prose prose-sm max-w-none text-[#3A3F52] leading-relaxed space-y-3 mb-6">
            <p>
              Chez nous, on fait et on maîtrise avant d&apos;enseigner. Ce que vous allez découvrir n&apos;est pas de la théorie : c&apos;est ce qui a transformé des entreprises réelles.
            </p>
            <p>
              J&apos;ai vécu deux fois la situation où il n&apos;y avait plus d&apos;argent sur le compte. C&apos;est parmi les périodes les plus stressantes qu&apos;un chef d&apos;entreprise puisse vivre. Depuis, je me suis promis de maîtriser mes marges et mon cashflow — et de transmettre ce savoir.
            </p>
          </div>

          {/* Définitions clés */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { label: "Rentabilité", def: "Capacité à générer un bénéfice par rapport aux ressources engagées" },
              { label: "Trésorerie", def: "L'argent disponible immédiatement sur votre compte d'entreprise" },
              { label: "Flux de trésorerie", def: "Les mouvements d'argent entrant et sortant sur une période donnée" },
            ].map((d) => (
              <div key={d.label} className="bg-white border border-[#E2E4EA] rounded-xl p-3">
                <p className="text-[#0046FF] font-bold text-xs uppercase tracking-wider mb-1">{d.label}</p>
                <p className="text-[#3A3F52] text-xs leading-relaxed">{d.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leviers */}
        <div className="space-y-3 mb-10">
          <h2 className="text-lg font-black text-[#0A0A0F] mb-4">Les 7 leviers — cliquez pour développer</h2>
          {LEVIERS.map((levier, i) => (
            <LevierCard key={levier.id} levier={levier} index={i} />
          ))}
        </div>

        {/* Conclusion */}
        <div className="bg-white border border-[#E2E4EA] rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-[#0046FF] font-bold text-xs uppercase tracking-widest mb-2">En résumé</p>
          <p className="text-[#0A0A0F] font-black text-base mb-3">
            Implémentez au moins 1 levier cette semaine.
          </p>
          <p className="text-[#555B6E] text-sm leading-relaxed">
            Vous n&apos;avez pas besoin d&apos;activer les 7 d&apos;un coup. Choisissez le levier le plus accessible dans votre situation, passez à l&apos;action, mesurez le résultat — puis passez au suivant.
          </p>
          <div className="mt-4 pt-4 border-t border-[#E2E4EA]">
            <p className="text-[#9096A5] text-xs">
              <span className="font-bold text-[#0A0A0F]">Rappel :</span> le tableau le plus important dans mon entreprise est le TFT — le Tableau de Flux de Trésorerie. Mettez-le en place si ce n&apos;est pas déjà fait.
            </p>
          </div>
        </div>

        {/* Télécharger PDF */}
        <div className="flex justify-center mb-6">
          <a
            href="/guides/guide-tresorerie.pdf"
            download="Guide-7-Moyens-Tresorerie.pdf"
            className="flex items-center gap-2 bg-white border border-[#E2E4EA] hover:border-[#0046FF]/40 text-[#3A3F52] hover:text-[#0046FF] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger le guide complet (PDF)
          </a>
        </div>

        {/* CTA */}
        <div className="bg-[#000D2B] rounded-2xl p-6">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Pour aller plus loin</p>
          <h3 className="text-white font-black text-lg mb-2">
            Votre trésorerie mérite une attention personnalisée.
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            En 30 minutes, nos experts identifient les failles dans votre gestion de trésorerie et vous donnent un plan d&apos;action immédiat.
          </p>
          <a
            href="https://calendly.com/maxpiccinini"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0046FF] hover:bg-[#2563FF] text-white font-black text-sm px-5 py-3 rounded-xl transition-all"
          >
            Réserver un appel gratuit →
          </a>
          <p className="text-white/30 text-xs mt-3">Gratuit · Sans engagement · 30 minutes</p>
        </div>
      </main>
    </div>
  );

  if (!session) return content;

  return (
    <AppLayout session={session} sessionId={sessionId}>
      {content}
    </AppLayout>
  );
}

export default function GuideTrsoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GuideTrsoContent />
    </Suspense>
  );
}
