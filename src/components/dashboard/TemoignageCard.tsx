"use client";

import type { Temoignage } from "@/lib/types";

interface TemoignageCardProps {
  temoignage: Temoignage;
}

export function TemoignageCard({ temoignage }: TemoignageCardProps) {
  return (
    <div className="bg-white border border-[#E2E4EA] rounded-2xl overflow-hidden shadow-sm">
      {/* Vimeo player */}
      {temoignage.video_url && (
        <div className="w-full aspect-video bg-[#F0F1F5]">
          <iframe
            src={temoignage.video_url}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`Témoignage ${temoignage.prenom}`}
          />
        </div>
      )}

      {/* Infos */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {!temoignage.video_url && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2E4EA] to-[#D1D5E0] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#555B6E]">
                {temoignage.prenom[0]}
              </span>
            </div>
          )}
          <div>
            <p className="font-bold text-[#0A0A0F] text-sm">{temoignage.prenom}</p>
            <p className="text-[#9096A5] text-xs">{temoignage.secteur_display}</p>
          </div>
        </div>
        <p className="text-[#0046FF] font-black text-lg mb-2">
          {temoignage.resultat_chiffre}
        </p>
        <p className="text-[#3A3F52] text-sm italic leading-relaxed">
          &ldquo;{temoignage.citation}&rdquo;
        </p>
      </div>
    </div>
  );
}
