"use client";

import type { Newsletter } from "@/lib/types";

interface LectureCardProps {
  newsletter: Newsletter;
  locked: boolean;
}

export function LectureCard({ newsletter, locked }: LectureCardProps) {
  if (locked) {
    return (
      <div className="relative bg-white border border-[#E2E4EA] rounded-2xl p-5 overflow-hidden shadow-sm">
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/80 rounded-2xl flex flex-col items-center justify-center z-10 gap-1">
          <div className="text-2xl">🔒</div>
          <p className="text-[#0A0A0F] font-bold text-sm">
            Disponible après la vidéo
          </p>
          <p className="text-[#555B6E] text-xs text-center px-4">
            Regarde d&apos;abord la formation pour débloquer
          </p>
        </div>
        <p className="text-[#9096A5] text-xs uppercase tracking-widest font-bold mb-2">
          Lecture
        </p>
        <h3 className="text-[#0A0A0F] font-black text-base mb-2">
          {newsletter.titre}
        </h3>
        <p className="text-[#555B6E] text-sm leading-relaxed line-clamp-3">
          {newsletter.extrait}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E4EA] rounded-2xl p-5 shadow-sm">
      <p className="text-[#0046FF] text-xs uppercase tracking-widest font-bold mb-2">
        Lecture
      </p>
      <h3 className="text-[#0A0A0F] font-black text-base mb-2">
        {newsletter.titre}
      </h3>
      <p className="text-[#555B6E] text-sm leading-relaxed mb-4">
        {newsletter.extrait}
      </p>
      <a
        href={newsletter.lien}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#0046FF] hover:text-[#0033CC] transition-colors"
      >
        Lire l&apos;article complet <span>→</span>
      </a>
    </div>
  );
}
