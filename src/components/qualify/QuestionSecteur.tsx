"use client";

import type { Secteur } from "@/lib/types";

const SECTEUR_OPTIONS: { value: Secteur; label: string }[] = [
  { value: "Dentiste", label: "Dentiste" },
  { value: "Médecin-Santé", label: "Médecin / Santé" },
  { value: "Avocat-Notaire", label: "Avocat / Notaire" },
  { value: "Expert-comptable", label: "Expert-comptable" },
  { value: "Architecte", label: "Architecte" },
  { value: "BTP", label: "BTP" },
  { value: "Plombier-Électricien", label: "Plombier / Électricien" },
  { value: "Promoteur immobilier", label: "Promoteur immobilier" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Commerce physique", label: "Commerce physique" },
  { value: "Franchise", label: "Franchise" },
  { value: "Coach-Formateur", label: "Coach / Formateur" },
  { value: "Consultant", label: "Consultant" },
  { value: "Agence marketing", label: "Agence marketing" },
  { value: "Autre", label: "Autre" },
];

interface QuestionSecteurProps {
  selected: Secteur | "";
  onSelect: (value: Secteur) => void;
}

export function QuestionSecteur({ selected, onSelect }: QuestionSecteurProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 mb-2">
          Votre secteur d&apos;activité ?
        </h2>
        <p className="text-zinc-500 text-sm">
          Pour vous montrer des résultats concrets dans votre domaine.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SECTEUR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
              selected === option.value
                ? "border-zinc-900 bg-zinc-900 text-white font-bold"
                : "border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700 font-medium"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
