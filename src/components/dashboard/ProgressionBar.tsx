"use client";

interface ProgressionBarProps {
  score: number;
}

export function ProgressionBar({ score }: ProgressionBarProps) {
  return (
    <div className="bg-[#F0F1F5] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#9096A5] uppercase tracking-wide">
          Progression
        </span>
        <span className="text-sm font-bold text-[#0046FF]">{score}%</span>
      </div>
      <div className="h-2 bg-[#E2E4EA] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0046FF] rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {["Plan choisi", "Vidéo vue", "Étapes"].map((label, i) => (
          <span key={i} className="text-xs text-[#9096A5]">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
