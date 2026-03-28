"use client";

import type { ChiffreAffaires } from "@/lib/types";

const CA_OPTIONS: { value: ChiffreAffaires; label: string; sublabel: string }[] = [
  { value: "< 200K", label: "Moins de 200 000 €", sublabel: "Phase de lancement / développement" },
  { value: "200K-500K", label: "200 000 – 500 000 €", sublabel: "En croissance" },
  { value: "500K-1M", label: "500 000 – 1 000 000 €", sublabel: "Entreprise établie" },
  { value: "> 1M", label: "Plus de 1 000 000 €", sublabel: "Scale-up" },
];

interface QuestionCAProps {
  selected: ChiffreAffaires | "";
  onSelect: (value: ChiffreAffaires) => void;
}

export function QuestionCA({ selected, onSelect }: QuestionCAProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 mb-2">
          Quel est votre chiffre d&apos;affaires annuel ?
        </h2>
        <p className="text-zinc-500 text-sm">
          Pour calibrer les recommandations à votre stade exact.
        </p>
      </div>
      <div className="space-y-2.5">
        {CA_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all group ${
              selected === option.value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:border-zinc-900 text-zinc-900"
            }`}
          >
            <span className="font-bold block">{option.label}</span>
            <span className="text-xs mt-0.5 block text-zinc-400">
              {option.sublabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
