"use client";

import { useState, useEffect } from "react";

const STEPS = [
  "Analyse de ton profil entrepreneur",
  "Identification de ton frein de croissance",
  "Benchmarking avec ton secteur d'activité",
  "Construction de ton plan d'action personnalisé",
];

// Timing : chaque étape se "coche" successivement
const STEP_TIMINGS = [800, 2200, 3600, 5000];

// Progression simulée (s'arrête à 90%, attend la vraie réponse)
const PROGRESS_STEPS = [
  { at: 300,  value: 18 },
  { at: 1000, value: 35 },
  { at: 2400, value: 55 },
  { at: 3800, value: 72 },
  { at: 5200, value: 88 },
];

interface DiagnosticLoadingProps {
  prenom: string;
}

export function DiagnosticLoading({ prenom }: DiagnosticLoadingProps) {
  const [doneSteps, setDoneSteps]     = useState<number[]>([]);
  const [activeStep, setActiveStep]   = useState(0);
  const [progress, setProgress]       = useState(0);
  const [dots, setDots]               = useState(".");

  // Animation des points de suspension sur l'étape active
  useEffect(() => {
    const iv = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(iv);
  }, []);

  // Progression de la barre
  useEffect(() => {
    const timers = PROGRESS_STEPS.map(({ at, value }) =>
      setTimeout(() => setProgress(value), at)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Complétion séquentielle des étapes
  useEffect(() => {
    const timers = STEP_TIMINGS.map((delay, i) =>
      setTimeout(() => {
        setDoneSteps((prev) => [...prev, i]);
        setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E4EA] px-4 py-5 flex items-center justify-between">
        <span className="text-[#0046FF] font-black text-lg tracking-tight">MOMENTUM</span>
        <span className="text-xs text-[#9096A5]">par Max Piccinini Coaching</span>
      </header>

      {/* Contenu centré */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Titre */}
          <div className="mb-8">
            <div className="w-10 h-10 rounded-full bg-[#0046FF]/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#0046FF] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#0A0A0F] leading-snug mb-2">
              Nous préparons ton diagnostic,<br />
              <span className="text-[#0046FF]">{prenom}.</span>
            </h1>
            <p className="text-[#555B6E] text-sm leading-relaxed">
              Notre IA analyse ta situation pour te donner un plan d&apos;action concret et personnalisé.
            </p>
          </div>

          {/* Étapes */}
          <div className="space-y-3 mb-8">
            {STEPS.map((label, i) => {
              const isDone   = doneSteps.includes(i);
              const isActive = !isDone && i === activeStep;
              const isPending = !isDone && !isActive;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isPending ? "opacity-30" : "opacity-100"
                  }`}
                >
                  {/* Icône */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? "bg-[#0046FF] text-white"
                        : isActive
                        ? "border-2 border-[#0046FF]"
                        : "border-2 border-[#E2E4EA]"
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-[#0046FF] animate-ping" />
                    ) : null}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isDone
                        ? "text-[#0A0A0F] line-through decoration-[#9096A5]/50"
                        : isActive
                        ? "text-[#0046FF]"
                        : "text-[#9096A5]"
                    }`}
                  >
                    {isActive ? `${label}${dots}` : label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="h-1.5 bg-[#F0F1F5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0046FF] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[#9096A5] text-xs text-right">
              {progress < 90
                ? "Généralement prêt en moins de 30 secondes"
                : "Finalisation en cours..."}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
