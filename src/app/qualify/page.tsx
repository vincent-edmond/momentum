"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { saveSession, getSessionByClerkUserIdAsync, getCurrentSessionId } from "@/lib/session";
import type { ChiffreAffaires, FreinCroissance, Secteur } from "@/lib/types";
import { Stepper } from "@/components/qualify/Stepper";
import { QuestionTelephone } from "@/components/qualify/QuestionTelephone";
import { QuestionCA } from "@/components/qualify/QuestionCA";
import { QuestionFrein } from "@/components/qualify/QuestionFrein";
import { QuestionSecteur } from "@/components/qualify/QuestionSecteur";
import { Sidebar, MobileTopBar } from "@/components/layout/Sidebar";

/**
 * Flow onboarding :
 * Step 0 — Téléphone (Clerk fournit prénom + email)
 * Step 1 — Chiffre d'affaires
 * Step 2 — Frein principal
 * Step 3 — Secteur d'activité
 */
export default function QualifyPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // Données Clerk (pré-remplies automatiquement)
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  // Nouvelles données collectées dans l'onboarding
  const [telephone, setTelephone] = useState("");
  const [telephoneValid, setTelephoneValid] = useState(false);
  const [ca, setCa] = useState<ChiffreAffaires | "">("");
  const [frein, setFrein] = useState<FreinCroissance | "">("");
  const [secteur, setSecteur] = useState<Secteur | "">("");

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  const totalSteps = 4; // phone → CA → frein → secteur

  // Pré-remplissage Clerk + détection utilisateur de retour
  useEffect(() => {
    if (!isLoaded) return;

    const checkExistingSession = async () => {
      // Session locale active ?
      const currentId = getCurrentSessionId();
      if (currentId) {
        router.push(`/dashboard/${currentId}`);
        return;
      }

      // Session liée au compte Clerk (cross-device) ?
      if (user?.id) {
        const existing = await getSessionByClerkUserIdAsync(user.id);
        if (existing) {
          // Session complète (avec téléphone) → dashboard
          // Session incomplète (sans téléphone, ancien user) → reprend step 0
          if (existing.telephone) {
            router.push(`/dashboard/${existing.sessionId}`);
            return;
          }
          // Ancien compte sans téléphone : on le laisse compléter l'onboarding
          // Les données CA/frein/secteur déjà renseignées sont conservées
          if (existing.ca) setCa(existing.ca);
          if (existing.frein) setFrein(existing.frein);
          if (existing.secteur) setSecteur(existing.secteur);
        }

        // Pré-remplir depuis Clerk
        setPrenom(user.firstName ?? "");
        setEmail(user.primaryEmailAddress?.emailAddress ?? "");
      }

      setChecking(false);
    };

    checkExistingSession();
  }, [isLoaded, user, router]);

  // Chargement
  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Validation par step ───────────────────────────────────────────────────

  function canAdvance(): boolean {
    switch (step) {
      case 0: return telephoneValid && telephone.length > 0;
      case 1: return ca !== "";
      case 2: return frein !== "";
      case 3: return secteur !== "";
      default: return false;
    }
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

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
    const sessionId = saveSession({
      prenom: prenom.trim() || (user?.firstName ?? ""),
      email: email.trim().toLowerCase() || (user?.primaryEmailAddress?.emailAddress ?? ""),
      telephone,
      ca,
      frein,
      secteur,
      clerkUserId: user?.id,
    });
    router.push(`/diagnostic/${sessionId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && canAdvance()) handleNext();
  }

  // Avancement automatique après sélection (steps 1 et 2)
  function selectCa(value: ChiffreAffaires) {
    setCa(value);
    setTimeout(() => setStep(2), 220);
  }
  function selectFrein(value: FreinCroissance) {
    setFrein(value);
    setTimeout(() => setStep(3), 220);
  }

  // Callback stable pour le composant phone
  const handleTelephoneChange = useCallback((e164: string, isValid: boolean) => {
    setTelephone(e164);
    setTelephoneValid(isValid);
  }, []);

  // ─── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar verrouillé (desktop) */}
      <Sidebar locked prenomOnboarding={prenom} />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-60">
        <MobileTopBar locked />
        <Stepper step={step} totalSteps={totalSteps} />

        <main
          className="flex-1 flex items-start justify-center px-4 pt-6 pb-8"
          onKeyDown={handleKeyDown}
        >
          <div className="w-full max-w-lg">

            {/* Step 0 — Téléphone */}
            {step === 0 && (
              <QuestionTelephone
                value={telephone}
                onChange={handleTelephoneChange}
                prenom={prenom}
              />
            )}

            {/* Step 1 — CA */}
            {step === 1 && <QuestionCA selected={ca} onSelect={selectCa} />}

            {/* Step 2 — Frein */}
            {step === 2 && <QuestionFrein selected={frein} onSelect={selectFrein} />}

            {/* Step 3 — Secteur */}
            {step === 3 && <QuestionSecteur selected={secteur} onSelect={setSecteur} />}

            {/* ─── Navigation ─────────────────────────────────── */}
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

              {/* Bouton visible sur step 0 (phone) et step 3 (dernier) */}
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
