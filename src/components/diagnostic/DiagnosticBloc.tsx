"use client";

interface DiagnosticBlocProps {
  text: string;
  index: number;
  visible: boolean;
}

export function DiagnosticBloc({ text, index, visible }: DiagnosticBlocProps) {
  // p4 (index 3) : insight personnalisé - fond légèrement teinté
  // p5 (index 4) : possibilité - accent bleu plus fort
  const isInsight = index === 3;
  const isPossibilite = index === 4;

  if (isPossibilite) {
    return (
      <div
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: visible ? `${index * 200}ms` : "0ms" }}
      >
        <div className="flex gap-4 items-start bg-[#0046FF]/5 border border-[#0046FF]/20 rounded-2xl p-5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0046FF] flex items-center justify-center">
            <span className="text-white text-sm">✦</span>
          </div>
          <p className="text-[#0046FF] text-base font-semibold leading-relaxed pt-1">{text}</p>
        </div>
      </div>
    );
  }

  if (isInsight) {
    return (
      <div
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: visible ? `${index * 200}ms` : "0ms" }}
      >
        <div className="flex gap-4 items-start bg-[#F7F8FA] border border-[#E2E4EA] rounded-2xl p-5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#555B6E]/10 border border-[#555B6E]/20 flex items-center justify-center">
            <span className="text-[#555B6E] text-sm">◈</span>
          </div>
          <p className="text-[#3A3F52] text-base italic leading-relaxed pt-1">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: visible ? `${index * 200}ms` : "0ms" }}
    >
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0046FF]/10 border border-[#0046FF]/30 flex items-center justify-center">
          <span className="text-[#0046FF] text-sm font-bold">{index + 1}</span>
        </div>
        <p className="text-[#3A3F52] text-base leading-relaxed pt-1">{text}</p>
      </div>
    </div>
  );
}
