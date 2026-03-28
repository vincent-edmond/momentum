"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/session";
import type { ChiffreAffaires, FreinCroissance, Secteur } from "@/lib/types";
import { Stepper } from "@/components/qualify/Stepper";
import { QuestionCA } from "@/components/qualify/QuestionCA";
import { QuestionFrein } from "@/components/qualify/QuestionFrein";
import { QuestionSecteur } from "@/components/qualify/QuestionSecteur";

export default function QualifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [ca, setCa] = useState<ChiffreAffaires | "">("");
  const [frein, setFrein] = useState<FreinCroissance | "">("");
  const [secteur, setSecteur] = useState<Secteur | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  function canAdvance(): boolean {
    switch (step) {
      case 0: return prenom.trim().length > 0 && email.includes("@") && email.includes(".");
      case 1: return ca !== "";
      case 2: return frein !== "";
      case 3: return secteur !== "";
      default: return false;
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!ca || !frein || !secteur) return;
    setIsSubmitting(true);
    const sessionId = saveSession({ prenom: prenom.trim(), email: email.trim().toLowerCase(), ca, frein, secteur });
    router.push(`/diagnostic/${sessionId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canAdvance()) handleNext();
  }

  // Avancement automatique après sélection sur les steps 1–2
  function selectCa(value: ChiffreAffaires) {
    setCa(value);
    setTimeout(() => setStep(2), 220);
  }
  function selectFrein(value: FreinCroissance) {
    setFrein(value);
    setTimeout(() => setStep(3), 220);
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E2E4EA] py-5 px-4 flex items-center justify-between">
        <span className="text-[#0046FF] font-black text-lg tracking-tight">MOMENTUM</span>
        <span className="text-xs text-[#9096A5]">par Max Piccinini Coaching</span>
      </header>

      {/* ── Barre de progression ────────────────────────────── */}
      <Stepper step={step} totalSteps={totalSteps} />

      {/* ── Contenu ─────────────────────────────────────────── */}
      <main className="flex-1 flex items-start justify-center px-4 pt-6 pb-8" onKeyDown={handleKeyDown}>
        <div className="w-full max-w-lg">

          {/* Step 0 : Prénom + Email */}
          {step === 0 && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-2">
                  Obtenez votre diagnostic gratuit
                </h2>
                <p className="text-zinc-500 text-sm">
                  60 secondes. 3 questions. Une expérience 100% personnalisée.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Votre prénom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Ex : Jean"
                    autoFocus
                    className="w-full px-4 py-3.5 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]/40 focus:border-[#0046FF] transition-all text-zinc-900 placeholder-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Votre email professionnel</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@entreprise.com"
                    className="w-full px-4 py-3.5 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]/40 focus:border-[#0046FF] transition-all text-zinc-900 placeholder-zinc-300"
                  />
                </div>
                <p className="text-xs text-zinc-400">
                  Vos données sont confidentielles. Pas de spam.
                </p>
              </div>
            </div>
          )}

          {/* Step 1 : CA */}
          {step === 1 && <QuestionCA selected={ca} onSelect={selectCa} />}

          {/* Step 2 : Frein */}
          {step === 2 && <QuestionFrein selected={frein} onSelect={selectFrein} />}

          {/* Step 3 : Secteur */}
          {step === 3 && <QuestionSecteur selected={secteur} onSelect={setSecteur} />}

          {/* ── Navigation ─────────────────────────────────── */}
          <div className={`flex items-center mt-8 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            )}
            {/* Bouton visible uniquement sur steps 0 et 3, les autres avancent auto */}
            {(step === 0 || step === 3) && (
              <button
                onClick={handleNext}
                disabled={!canAdvance() || isSubmitting}
                className={`flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all ${
                  canAdvance() && !isSubmitting
                    ? "bg-[#0046FF] text-white hover:bg-[#0033CC]"
                    : "bg-[#E2E4EA] text-[#9096A5] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Préparation…
                  </>
                ) : step === 3 ? (
                  <>
                    Voir mon diagnostic
                    <svg className="w-4 h-4 text-[#0046FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continuer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
