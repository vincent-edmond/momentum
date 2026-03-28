"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDiagnosticEtChemins } from "@/lib/personalisation";
import { DiagnosticBloc } from "@/components/diagnostic/DiagnosticBloc";
import { CheminCard } from "@/components/diagnostic/CheminCard";
import { DiagnosticLoading } from "@/components/diagnostic/DiagnosticLoading";
import type { SessionData, Chemin, DiagnosticPoints } from "@/lib/types";

export default function DiagnosticPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticPoints | null>(null);
  const [chemins, setChemins] = useState<{
    plan1: Chemin;
    plan2: Chemin;
    plan3: Chemin;
  } | null>(null);

  const [pointsVisible, setPointsVisible] = useState([false, false, false, false, false]);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const s = getSession(sessionId);
      if (!s) return;
      setSession(s);

      const { diagnostic: diag, chemins: ch } = await getDiagnosticEtChemins(s);
      setDiagnostic(diag);
      setChemins(ch);

      // Séquence d'animation
      const t0 = setTimeout(() => setTitleVisible(true), 100);
      const t1 = setTimeout(() => setPointsVisible([true, false, false, false, false]), 600);
      const t2 = setTimeout(() => setPointsVisible([true, true, false, false, false]), 1200);
      const t3 = setTimeout(() => setPointsVisible([true, true, true, false, false]), 1800);
      const t4 = setTimeout(() => setPointsVisible([true, true, true, true, false]), 2400);
      const t5 = setTimeout(() => setPointsVisible([true, true, true, true, true]), 3000);
      const t6 = setTimeout(() => setCardsVisible(true), 3800);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
      };
    };

    load();
  }, [sessionId]);

  // Phase 1 : session pas encore lue depuis localStorage (quasi-instantané)
  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Phase 2 : session chargée, N8N génère le diagnostic
  if (!diagnostic || !chemins) {
    return <DiagnosticLoading prenom={session.prenom} />;
  }

  const points = [
    diagnostic.p1,
    diagnostic.p2,
    diagnostic.p3,
    ...(diagnostic.p4 ? [diagnostic.p4] : []),
    ...(diagnostic.p5 ? [diagnostic.p5] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0A0A0F]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E4EA] px-4 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-[#0046FF] font-black text-lg tracking-tight">MOMENTUM</span>
        <span className="text-xs text-[#9096A5]">par Max Piccinini Coaching</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        {/* Titre */}
        <div
          className={`pt-8 pb-12 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-[#0046FF] text-sm font-semibold tracking-widest uppercase mb-3">
            Diagnostic personnalisé
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A0A0F] leading-tight">
            {session.prenom}, voici ce que j&apos;ai compris
            <br />
            <span className="text-[#555B6E]">de ta situation.</span>
          </h1>
        </div>

        {/* Points de diagnostic */}
        <div className="space-y-6 mb-16">
          {points.map((text, i) => (
            <DiagnosticBloc
              key={i}
              text={text}
              index={i}
              visible={pointsVisible[i]}
            />
          ))}
        </div>

        {/* Séparation + appel aux chemins */}
        <div
          ref={cardsRef}
          className={`transition-all duration-700 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-10">
            <div className="inline-block w-8 h-px bg-[#0046FF]/40 mb-6" />
            <h2 className="text-2xl font-black text-[#0A0A0F] mb-2">
              Maintenant, choisis ton chemin.
            </h2>
            <p className="text-[#555B6E] text-sm">
              3 approches différentes selon ton horizon et ton niveau d&apos;engagement.
            </p>
          </div>

          {/* Cartes plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {([
              { plan: chemins.plan1, index: 1 as const },
              { plan: chemins.plan2, index: 2 as const },
              { plan: chemins.plan3, index: 3 as const },
            ] as const).map(({ plan, index }) => (
              <CheminCard
                key={index}
                plan={plan}
                index={index}
                sessionId={sessionId}
                visible={cardsVisible}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
