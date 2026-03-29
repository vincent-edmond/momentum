"use client";

interface CTAStickyProps {
  prenom: string;
}

export function CTASticky({ prenom }: CTAStickyProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-[#E2E4EA] px-4 py-3 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[#0A0A0F] font-bold text-sm truncate">
            {prenom}, tu veux aller plus vite ?
          </p>
          <p className="text-[#9096A5] text-xs hidden sm:block">
            Un expert analyse ton dossier gratuitement en 30 min.
          </p>
        </div>
        <a
          href="https://calendly.com/maxpiccinini"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-[#0046FF] hover:bg-[#0033CC] text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all whitespace-nowrap"
        >
          Voir si je suis éligible →
        </a>
      </div>
    </div>
  );
}
