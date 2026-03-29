"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveSession, getSessionByEmailAsync, getCurrentSessionId } from "@/lib/session";
import type { ChiffreAffaires, FreinCroissance, Secteur } from "@/lib/types";
import { Stepper } from "@/components/qualify/Stepper";
import { QuestionCA } from "@/components/qualify/QuestionCA";
import { QuestionFrein } from "@/components/qualify/QuestionFrein";
import { QuestionSecteur } from "@/components/qualify/QuestionSecteur";
import { Sidebar, MobileTopBar } from "@/components/layout/Sidebar";

export default function QualifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [ca, setCa] = useState<ChiffreAffaires | "">("");
  const [frein, setFrein] = useState<FreinCroissance | "">("");
  const [secteur, setSecteur] = useState<Secteur | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returningUser, setReturningUser] = useState<{ sessionId: string; prenom: string } | null>(null);

  // Détection utilisateur de retour (session courante dans localStorage)
  useEffect(() => {
    const currentId = getCurrentSessionId();
    if (currentId) {
      router.push(`/dashboard/${currentId}`);
    }
  }, [router]);

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

  async function handleEmailBlur() {
    if (!email.includes("@")) return;
    const existing = await getSessionByEmailAsync(email.trim().toLowerCase());
    if (existing) {
      setReturningUser({ sessionId: existing.sessionId, prenom: existing.prenom });
    } else {
      setReturningUser(null);
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
    <div className="min-h-screen flex bg-zinc-50">
      {/* ── Sidebar verrouillé (desktop) ─────────────────── */}
      <Sidebar locked prenomOnboarding={prenom} />

      {/* ── Contenu principal ────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-60">

        {/* Mobile top bar verrouillé */}
        <MobileTopBar locked />

        {/* ── Barre de progression des étapes ─────────────── */}
        <Stepper step={step} totalSteps={totalSteps} />

        {/* ── Formulaire ───────────────────────────────────── */}
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
                      onBlur={handleEmailBlur}
                      placeholder="jean@entreprise.com"
                      className="w-full px-4 py-3.5 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0046FF]/40 focus:border-[#0046FF] transition-all text-zinc-900 placeholder-zinc-300"
                    />
                  </div>

                  {/* Bannière utilisateur de retour */}
                  {returningUser && (
                    <div className="bg-[#0046FF]/5 border border-[#0046FF]/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-[#0046FF] mb-1">
                        Bienvenue de retour, {returningUser.prenom} !
                      </p>
                      <p className="text-xs text-zinc-500 mb-3">
                        Ton espace personnalisé est prêt. Reprends où tu en étais.
                      </p>
                      <button
                        onClick={() => router.push(`/dashboard/${returningUser.sessionId}`)}
                        className="bg-[#0046FF] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#0033CC] transition-all"
                      >
                        Reprendre mon espace →
                      </button>
                    </div>
                  )}

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

            {/* ── Navigation ───────────────────────────────── */}
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}
