"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "@/lib/session";
import { AppLayout } from "@/components/layout/AppLayout";
import type { SessionData } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: number;
  emoji: string;
  categorie: "mindset" | "strategie";
  titre: string;
  accroche: string;
  contenu: React.ReactNode;
}

// ─── Données des sections ──────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: 1,
    emoji: "🎯",
    categorie: "mindset",
    titre: "Voyez bien plus grand !",
    accroche: "80% de votre réussite est fondée sur votre psychologie",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          C&apos;est la partie la plus importante : la partie psychologique. 80% de votre réussite est fondée sur votre psychologie — la manière dont vous vous percevez, votre conviction d&apos;y arriver, vos conflits intérieurs sur l&apos;argent.
        </p>
        <div className="bg-[#000D2B] rounded-xl p-4">
          <p className="text-white/90 text-sm italic">
            &quot;Cela ne prend pas plus d&apos;efforts de penser GRAND que de penser petit.&quot;
          </p>
          <p className="text-white/40 text-xs mt-2">— Max Piccinini</p>
        </div>
        <p>
          Quand vous changez votre <strong>point de focalisation</strong>, votre esprit commence à chercher des solutions qu&apos;il ne voyait pas auparavant. Tout d&apos;un coup, faire ×3 paraît facile parce que vous visez ×10.
        </p>
        <p>
          Les grands objectifs sont souvent plus faciles à atteindre que les petits — parce qu&apos;ils vous forcent à vous réinventer totalement et à puiser une énergie extraordinaire. C&apos;est ce que j&apos;appelle <em>activer son turbo intérieur</em>.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Questions de transformation :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Quel est votre GRAND rêve d&apos;entrepreneur ?</li>
            <li>→ Si tout était possible, quel objectif vous exciterait vraiment ?</li>
            <li>→ Qu&apos;est-ce que vous atteignez si vous visez ×10 plutôt que ×2 ?</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : écrivez un objectif ×10 pour les 3 prochaines années. Votre concurrence ne le fait pas — c&apos;est déjà un avantage sur eux.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    emoji: "💪",
    categorie: "mindset",
    titre: "Développez vos muscles de résilience",
    accroche: "La vitesse à laquelle vous vous relevez fait toute la différence",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          La résilience, c&apos;est votre capacité à prendre un coup, tomber par terre — et la vitesse à laquelle vous vous relevez pour continuer. En tant qu&apos;entrepreneur, les difficultés sont <strong>obligatoires</strong>. Pas optionnelles.
        </p>
        <p>
          Dès que les choses ne vont pas comme vous le voulez, posez-vous ces deux questions :
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <ul className="text-sm text-[#0046FF] font-bold space-y-2">
            <li>&quot;Qu&apos;est-ce que je peux apprendre de cette situation ?&quot;</li>
            <li>&quot;Comment vais-je surmonter cet obstacle ? Où est le cadeau ?&quot;</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-bold text-emerald-800 text-sm mb-2">🎯 L&apos;histoire du séminaire Covid</p>
          <p className="text-sm text-emerald-700">
            4 jours avant Destination Réussite — 1 000 personnes attendues — le ministre annonce l&apos;interdiction de tout rassemblement. En 5 minutes, j&apos;avais décidé : on passe en digital. En 3 jours, studio installé, 1 000 participants en ligne. Certains ont dit que c&apos;était le meilleur séminaire auquel ils avaient participé.
          </p>
          <p className="text-sm text-emerald-700 mt-2 font-medium">
            Cette &quot;catastrophe&quot; nous a forcés à inventer le format hybride — qui est devenu un avantage compétitif majeur.
          </p>
        </div>
        <p>
          Il y a <strong>toujours un cadeau dans une difficulté</strong>. Plus grande est la difficulté, plus grand est le cadeau.
        </p>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : identifiez votre plus grande difficulté actuelle. Cherchez le cadeau qu&apos;elle contient. Quelle opportunité vous force-t-elle à saisir ?
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    emoji: "🤝",
    categorie: "strategie",
    titre: "Démultipliez les partenariats stratégiques",
    accroche: "Un super-accélérateur de CA qui ne coûte presque rien",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          La question à 10 millions : <em>&quot;Quelles entreprises ont les clients que vous désirez mais ne vendent pas ce que vous vendez ?&quot;</em>
        </p>
        <p>
          Les partenariats stratégiques permettent d&apos;accéder à des bases de clients que des entreprises ont mis 30 ans à construire — sans budget marketing, en utilisant le levier le plus puissant qui soit : la recommandation.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-3">Processus en 7 étapes :</p>
          <ol className="text-sm text-[#3A3F52] space-y-2">
            <li><span className="font-bold">1.</span> Listez toutes les entreprises complémentaires (pas concurrentes) qui ont vos clients cibles</li>
            <li><span className="font-bold">2.</span> Contactez-les avec une approche &quot;win-win&quot; — ces deux mots ouvrent toutes les portes</li>
            <li><span className="font-bold">3.</span> Callez un RDV physique ou visio</li>
            <li><span className="font-bold">4.</span> Passez 80% du temps à comprendre leurs besoins — pas à vendre les vôtres</li>
            <li><span className="font-bold">5.</span> Préparez 3 options de partenariat différentes</li>
            <li><span className="font-bold">6.</span> Parlez toujours dans l&apos;intérêt de votre partenaire, pas le vôtre</li>
            <li><span className="font-bold">7.</span> Répétez à l&apos;infini — scalable par définition</li>
          </ol>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            { titre: "Option 1 : Recommandations mutuelles", desc: "Vous vous recommandez systématiquement + flyers client" },
            { titre: "Option 2 : Commission sur vente", desc: "Votre partenaire recommande et touche une commission à chaque vente" },
            { titre: "Option 3 : Événement croisé", desc: "Invitez vos 30 meilleurs clients à un évènement privé commun" },
          ].map((o) => (
            <div key={o.titre} className="bg-white border border-[#E2E4EA] rounded-xl p-3">
              <p className="font-bold text-[#0A0A0F] mb-1">{o.titre}</p>
              <p className="text-[#555B6E]">{o.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : identifiez 5 entreprises complémentaires cette semaine. Contactez-en une en proposant un rendez-vous &quot;win-win&quot;.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    emoji: "🛒",
    categorie: "strategie",
    titre: "Vente additionnelle",
    accroche: "McDonald's a augmenté son panier moyen de 25% avec une seule question",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Avez-vous instauré une habitude systématique — sans exception — de proposer un produit ou service additionnel dès qu&apos;un client a décidé d&apos;acheter ?
        </p>
        <div className="bg-[#000D2B] rounded-xl p-4">
          <p className="text-white/90 text-sm italic">
            Quand vous choisissez un menu McDonald&apos;s, le caissier pose toujours : <strong className="text-white">&quot;Et avec ceci ?&quot;</strong> Cette question a augmenté leur panier moyen de 25%. Juste une question.
          </p>
        </div>
        <p>
          La décision d&apos;achat est déjà prise. Le client est en mode &quot;oui&quot;. C&apos;est le meilleur moment pour proposer autre chose — il pose moins de questions, achète plus rapidement.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Exemples de ventes additionnelles :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Un produit complémentaire au même moment (cross-sell)</li>
            <li>→ Une version premium ou supérieure (upsell)</li>
            <li>→ Un service de maintenance, garantie ou suivi</li>
            <li>→ Une formation ou accompagnement à l&apos;utilisation</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-sm text-emerald-700">
            <strong>Résultat observé :</strong> certains de mes clients ont <strong>doublé leur CA en 2 mois</strong> uniquement en systématisant les ventes additionnelles.
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : définissez votre produit/service additionnel et formez votre équipe à poser la question systématiquement, à chaque vente, sans exception.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    emoji: "📞",
    categorie: "strategie",
    titre: "Recontactez vos anciens clients",
    accroche: "Vous avez une mine d'or que vous n'exploitez pas",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Quand avez-vous rappelé pour la dernière fois <strong>tous</strong> vos clients passés ? Il est 10 fois plus facile d&apos;obtenir un achat d&apos;un client passé que d&apos;un nouveau prospect.
        </p>
        <p>
          La raison est simple : il est déjà convaincu. Il vous connaît. Il a confiance. Et la confiance est la monnaie du 21ème siècle.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-700 text-sm mb-1">L&apos;erreur classique</p>
          <p className="text-sm text-red-600">
            Lors de mes séminaires, j&apos;ai rencontré des centaines d&apos;entrepreneurs tellement focalisés sur l&apos;acquisition de nouveaux clients qu&apos;ils oublient leur or en barre : les clients qui achèteraient à nouveau... si on leur demandait.
          </p>
        </div>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Système à mettre en place :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Aucun client ne doit passer + de 6 mois sans être recontacté</li>
            <li>→ Créez une séquence de suivi automatisée dans votre CRM</li>
            <li>→ Appelez avec une intention sincère : comment vont-ils ? Ont-ils des besoins ?</li>
            <li>→ Proposez-leur un nouveau produit, une mise à jour ou une offre spéciale</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-sm text-emerald-700">
            Si vous appeliez maintenant tous vos clients passés et que <strong>15% seulement rachètent</strong>, quel serait l&apos;impact sur votre CA ce mois-ci ?
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : exportez votre liste de clients inactifs depuis + de 6 mois. Contactez-en 10 aujourd&apos;hui avec un message personnalisé.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    emoji: "📱",
    categorie: "strategie",
    titre: "Apprenez à gagner sur le digital",
    accroche: "Réseaux sociaux + Tunnels Comportementaux Automatisés (TCA)",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Le digital a super-accéléré avec la crise Covid. Ceux qui étaient prêts ont vu leur CA exploser. Il y a deux compétences majeures à maîtriser :
        </p>

        <div className="bg-[#0046FF] rounded-xl p-4 text-white">
          <p className="font-black text-sm mb-1">1. Les réseaux sociaux</p>
          <p className="text-white/80 text-xs">Présence constante + contenu D.E.E.E + personal branding</p>
        </div>

        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">La formule D.E.E.E :</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { lettre: "D", mot: "Divertissant", desc: "Le contenu ennuyeux tue l'engagement" },
              { lettre: "E", mot: "Engageant", desc: "Incite à réagir, commenter, partager" },
              { lettre: "E", mot: "Éducatif", desc: "Apporte de la valeur concrète" },
              { lettre: "E", mot: "Émotionnel", desc: "Touche les gens là où ça compte" },
            ].map((d) => (
              <div key={d.lettre + d.mot} className="flex gap-2">
                <span className="w-6 h-6 bg-[#0046FF] text-white rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">{d.lettre}</span>
                <div>
                  <p className="font-bold text-[#0A0A0F] text-xs">{d.mot}</p>
                  <p className="text-[#555B6E] text-xs">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0046FF] rounded-xl p-4 text-white">
          <p className="font-black text-sm mb-1">2. Les Tunnels Comportementaux Automatisés (TCA)</p>
          <p className="text-white/80 text-xs">Obtenez 3x à 10x plus de clients en travaillant 2x à 3x moins</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs text-center">
          {[
            { step: "1", label: "Attirer", desc: "Contacts qualifiés" },
            { step: "2", label: "Capturer", desc: "Email en échange d&apos;un cadeau" },
            { step: "3", label: "Tisser la confiance", desc: "Valeur gratuite" },
            { step: "4", label: "Offre irrésistible", desc: "Prospect → Client" },
            { step: "5", label: "Recommandations", desc: "Effet boule de neige" },
          ].map((s) => (
            <div key={s.step} className="bg-white border border-[#E2E4EA] rounded-xl p-2">
              <div className="w-6 h-6 bg-[#0046FF] text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-1">{s.step}</div>
              <p className="font-bold text-[#0A0A0F]">{s.label}</p>
              <p className="text-[#9096A5]" dangerouslySetInnerHTML={{ __html: s.desc }} />
            </div>
          ))}
        </div>

        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : si vous n&apos;avez pas de présence régulière sur les réseaux, commencez par poster 1 contenu D.E.E.E par jour pendant 30 jours. Mesurez l&apos;impact.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    emoji: "⭐",
    categorie: "strategie",
    titre: "Obtenez des recommandations",
    accroche: "40% de vos achats issus du bouche-à-oreille — le seuil d'une entreprise solide",
    contenu: (
      <div className="space-y-4 text-[#3A3F52] text-sm leading-relaxed">
        <p>
          Il existe des dizaines de moyens d&apos;obtenir des recommandations — mais combien en avez-vous réellement systématisé ? Je sais que mon produit est excellent quand plus de <strong>40% des achats viennent du bouche-à-oreille</strong>.
        </p>
        <p>
          Les clients recommandés sont les meilleurs clients : ils achètent plus rapidement, en plus grande quantité, avec moins de questions. Et ils ne vous coûtent rien à acquérir.
        </p>
        <div className="bg-[#0046FF]/5 border-l-4 border-[#0046FF] rounded-r-xl p-4">
          <p className="font-bold text-[#0046FF] text-sm mb-2">Comment les obtenir :</p>
          <ul className="text-sm text-[#3A3F52] space-y-1.5">
            <li>→ Délivrez un service ou produit exceptionnel — c&apos;est la base</li>
            <li>→ Rappeler systématiquement vos clients 2-3 mois après leur achat</li>
            <li>→ Demandez directement : &quot;Connaissez-vous des entrepreneurs qui pourraient bénéficier de ce que nous faisons ?&quot;</li>
            <li>→ Créez un programme de parrainage avec un avantage tangible</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-sm text-emerald-700">
            Si 30% de vos clients vous recommandent à un seul client chacun — c&apos;est <strong>30% de CA en plus</strong> juste pour avoir demandé.
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
          <span className="text-lg flex-shrink-0">⚡</span>
          <p className="text-amber-800 text-sm font-medium">
            Action : appelez 10 clients satisfaits cette semaine. Demandez-leur deux choses : un témoignage et une recommandation. Mesurez le résultat.
          </p>
        </div>
      </div>
    ),
  },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function SectionCard({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const isMindset = section.categorie === "mindset";

  return (
    <div className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${open ? "border-[#0046FF]/30" : "border-[#E2E4EA]"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F7F8FA] flex items-center justify-center text-xl">
          {section.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold uppercase tracking-widest ${isMindset ? "text-purple-600" : "text-[#0046FF]"}`}>
              {isMindset ? `Mindset ${section.id}` : `Stratégie ${section.id - 2}`}
            </span>
          </div>
          <h3 className="font-black text-[#0A0A0F] text-sm sm:text-base leading-tight">
            {section.titre}
          </h3>
          <p className="text-[#9096A5] text-xs mt-0.5 hidden sm:block">{section.accroche}</p>
        </div>
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open ? "bg-[#0046FF] text-white" : "bg-[#F7F8FA] text-[#9096A5]"}`}>
          <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[#F0F1F4]">
          <p className="text-[#555B6E] text-xs font-medium italic mb-4 pt-4">{section.accroche}</p>
          {section.contenu}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function GuideCaContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    if (sessionId) {
      setSession(getSession(sessionId));
    }
  }, [sessionId]);

  const mindsetSections = SECTIONS.filter((s) => s.categorie === "mindset");
  const strategieSections = SECTIONS.filter((s) => s.categorie === "strategie");

  const content = (
    <div className="min-h-screen bg-[#F7F8FA] pb-12">
      <main className="max-w-2xl mx-auto px-4 pt-8">

        {/* Header article */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-[#0046FF] rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-[#0046FF] uppercase tracking-widest">Guide Pratique — MaxMastermind 3M</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0F] leading-tight mb-3">
            7 stratégies pour accélérer votre chiffre d&apos;affaires
          </h1>
          <p className="text-[#555B6E] text-sm leading-relaxed mb-4">
            Par <strong className="text-[#0A0A0F]">Max Piccinini</strong> · Auteur Best-seller, Coach de 160 000+ entrepreneurs dans 25 pays
          </p>

          {/* Intro éditoriale */}
          <div className="bg-white border border-[#E2E4EA] rounded-xl p-5 mb-6 shadow-sm">
            <p className="text-[#0A0A0F] font-bold text-sm mb-2">Avant de lire ce guide :</p>
            <p className="text-[#555B6E] text-sm leading-relaxed">
              Lisez-le comme si vous aviez payé 10 000€ pour l&apos;obtenir. Car si vous implémentez ne serait-ce qu&apos;une ou deux de ces clés, vous êtes en mesure de générer des centaines de milliers d&apos;euros dans les années qui viennent.
            </p>
            <div className="mt-3 pt-3 border-t border-[#F0F1F4] flex items-center gap-2">
              <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">📊</span>
              </div>
              <p className="text-[#9096A5] text-xs">
                50% des entreprises meurent en moins de 2 ans · 95% en moins de 10 ans. Avec le bon mindset et les bonnes stratégies, vous ne pouvez qu&apos;en ressortir gagnant.
              </p>
            </div>
          </div>

          {/* Structure */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">Partie 1</p>
              <p className="text-purple-900 font-black text-sm">2 clés de Mindset</p>
              <p className="text-purple-600 text-xs mt-1">La fondation psychologique</p>
            </div>
            <div className="bg-[#0046FF]/5 border border-[#0046FF]/20 rounded-xl p-4">
              <p className="text-[#0046FF] font-bold text-xs uppercase tracking-wider mb-1">Partie 2</p>
              <p className="text-[#0A0A0F] font-black text-sm">5 stratégies CA</p>
              <p className="text-[#555B6E] text-xs mt-1">Actions concrètes et mesurables</p>
            </div>
          </div>
        </div>

        {/* Section Mindset */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-purple-200" />
            <span className="text-purple-600 font-black text-xs uppercase tracking-widest">Mindset</span>
            <div className="h-px flex-1 bg-purple-200" />
          </div>
          <div className="space-y-3">
            {mindsetSections.map((s, i) => (
              <SectionCard key={s.id} section={s} index={i} />
            ))}
          </div>
        </div>

        {/* Section Stratégies CA */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#0046FF]/20" />
            <span className="text-[#0046FF] font-black text-xs uppercase tracking-widest">Stratégies CA</span>
            <div className="h-px flex-1 bg-[#0046FF]/20" />
          </div>
          <div className="space-y-3">
            {strategieSections.map((s, i) => (
              <SectionCard key={s.id} section={s} index={i} />
            ))}
          </div>
        </div>

        {/* Effet cumulé */}
        <div className="bg-white border border-[#E2E4EA] rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-[#0046FF] font-bold text-xs uppercase tracking-widest mb-2">L&apos;effet cumulé</p>
          <p className="text-[#0A0A0F] font-black text-base mb-3">
            Implémentez plusieurs leviers → résultats géométriques
          </p>
          <p className="text-[#555B6E] text-sm leading-relaxed">
            En faisant +10% sur les prix, +15% sur le volume, +20% sur les recommandations, +5% sur les ventes additionnelles — vous activez le pouvoir de l&apos;effet cumulé. Il devient rapidement accessible de <strong className="text-[#0A0A0F]">doubler, voire tripler votre CA</strong>.
          </p>
          <div className="mt-4 pt-4 border-t border-[#F0F1F4]">
            <p className="text-[#9096A5] text-xs">
              Savoir ne suffit pas. La magie arrive quand on passe à l&apos;action. L&apos;action est le pont entre le rêve et la réalité.
            </p>
          </div>
        </div>

        {/* Télécharger PDF */}
        <div className="flex justify-center mb-6">
          <a
            href="/guides/guide-ca.pdf"
            download="Guide-Pratique-Entrepreneurs.pdf"
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
            Un accompagnement personnalisé accélère tout.
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            Nos experts analysent votre situation en 30 minutes et identifient les 2-3 actions à fort impact pour votre CA.
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

export default function GuideCaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GuideCaContent />
    </Suspense>
  );
}
