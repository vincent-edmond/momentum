"use client";

import type { FreinCroissance } from "@/lib/types";

const FREIN_OPTIONS: {
  value: FreinCroissance;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: "Acquisition clients",
    label: "Acquisition clients",
    desc: "Générer plus de prospects et convertir davantage",
    icon: "🎯",
  },
  {
    value: "Rentabilité",
    label: "Rentabilité",
    desc: "Améliorer mes marges et piloter ma trésorerie",
    icon: "💰",
  },
  {
    value: "Équipe & délégation",
    label: "Équipe & délégation",
    desc: "Recruter, manager et libérer mon temps",
    icon: "👥",
  },
  {
    value: "Systèmes & organisation",
    label: "Systèmes & organisation",
    desc: "Structurer mes process pour scaler",
    icon: "⚙️",
  },
];

interface QuestionFreinProps {
  selected: FreinCroissance | "";
  onSelect: (value: FreinCroissance) => void;
}

export function QuestionFrein({ selected, onSelect }: QuestionFreinProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 mb-2">
          Quel est votre principal frein de croissance ?
        </h2>
        <p className="text-zinc-500 text-sm">
          Soyez honnête : c&apos;est la clé d&apos;un diagnostic utile.
        </p>
      </div>
      <div className="space-y-2.5">
        {FREIN_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
              selected === option.value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:border-zinc-900 text-zinc-900"
            }`}
          >
            <span className="text-2xl flex-shrink-0">{option.icon}</span>
            <div>
              <span className="font-bold block">{option.label}</span>
              <span className="text-xs mt-0.5 block text-zinc-400">
                {option.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
