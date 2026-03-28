"use client";

import { useRouter } from "next/navigation";
import type { Chemin } from "@/lib/types";

const COULEUR_MAP = {
  blue: {
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
    icon: "text-blue-500",
    hover: "hover:border-blue-300 hover:shadow-md",
  },
  gold: {
    border: "border-[#0046FF]/20",
    badge: "bg-[#0046FF]/10 text-[#0046FF] border border-[#0046FF]/20",
    icon: "text-[#0046FF]",
    hover: "hover:border-[#0046FF]/40 hover:shadow-md",
  },
  purple: {
    border: "border-purple-200",
    badge: "bg-purple-50 text-purple-600 border border-purple-200",
    icon: "text-purple-500",
    hover: "hover:border-purple-300 hover:shadow-md",
  },
};

interface CheminCardProps {
  plan: Chemin;
  index: 1 | 2 | 3;
  sessionId: string;
  visible: boolean;
}

export function CheminCard({ plan, index, sessionId, visible }: CheminCardProps) {
  const router = useRouter();
  const colors = COULEUR_MAP[plan.couleur];

  function handleChoose() {
    if (plan.rdv) {
      // TODO: remplacer par le lien Calendly réel
      window.open("https://calendly.com/maxpiccinini", "_blank");
      return;
    }
    router.push(`/dashboard/${sessionId}?plan=${index}`);
  }

  // Plan RDV : rendu spécial "accompagnement"
  if (plan.rdv) {
    return (
      <div
        className={`relative flex flex-col bg-[#000D2B] border-2 border-[#000D2B] rounded-2xl p-6 shadow-lg transition-all duration-500 cursor-pointer group hover:shadow-xl hover:scale-[1.01] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: visible ? `${(index - 1) * 100}ms` : "0ms" }}
        onClick={handleChoose}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{plan.icon}</span>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 bg-white/10 text-white border border-white/20">
              {plan.horizon}
            </span>
            <h3 className="text-white font-black text-lg leading-tight">
              {plan.titre}
            </h3>
          </div>
        </div>

        {/* Bullets */}
        <ul className="space-y-2 mb-5 flex-1">
          {plan.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/80">
              <span className="mt-0.5 flex-shrink-0 text-white/60">→</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Résultat */}
        <div className="text-xs text-white/60 italic border-t border-white/10 pt-4 mb-4">
          {plan.resultat}
        </div>

        {/* CTA */}
        <button className="w-full py-3.5 rounded-xl font-black text-sm transition-all bg-[#0046FF] text-white hover:bg-[#2563FF] shadow-lg">
          Réserver mon appel gratuit →
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col bg-white border-2 ${colors.border} ${colors.hover} rounded-2xl p-6 shadow-sm transition-all duration-500 cursor-pointer group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: visible ? `${(index - 1) * 100}ms` : "0ms" }}
      onClick={handleChoose}
    >
      {plan.recommande && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#0046FF] text-white text-xs font-black px-3 py-1 rounded-full tracking-wide uppercase">
            Recommandé
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{plan.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${colors.badge}`}>
            {plan.horizon}
          </span>
          <h3 className="text-[#0A0A0F] font-black text-lg leading-tight">
            {plan.titre}
          </h3>
        </div>
      </div>

      {/* Bullets */}
      <ul className="space-y-2 mb-5 flex-1">
        {plan.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#3A3F52]">
            <span className={`mt-0.5 flex-shrink-0 ${colors.icon}`}>→</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Résultat */}
      <div className="text-xs text-[#555B6E] italic border-t border-[#E2E4EA] pt-4 mb-4">
        {plan.resultat}
      </div>

      {/* CTA */}
      <button
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
          plan.recommande
            ? "bg-[#0046FF] text-white hover:bg-[#0033CC]"
            : "bg-[#F0F1F5] text-[#0A0A0F] hover:bg-[#E2E4EA]"
        }`}
      >
        Choisir ce chemin →
      </button>
    </div>
  );
}
