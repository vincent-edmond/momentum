"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "@/lib/session";
import { AppLayout } from "@/components/layout/AppLayout";
import type { SessionData } from "@/lib/types";

function GuideTrsoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";
  const [session, setSession] = useState<SessionData | null>(null);
  const [pdfView, setPdfView] = useState<"embed" | "download">("embed");

  useEffect(() => {
    if (sessionId) {
      setSession(getSession(sessionId));
    }
  }, [sessionId]);

  const content = (
    <div className="min-h-screen bg-[#F7F8FA] pb-6">
      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-[#0046FF] rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-[#0046FF] uppercase tracking-widest">Guide Trésorerie</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0F] leading-tight mb-1">
                7 moyens d&apos;augmenter votre flux de trésorerie
              </h1>
              <p className="text-[#555B6E] text-sm">
                Pilotez votre cash flow avec confiance — par Max Piccinini Coaching.
              </p>
            </div>
            <a
              href="/guides/guide-tresorerie.pdf"
              download="Guide-7-Moyens-Tresorerie.pdf"
              className="flex-shrink-0 flex items-center gap-2 bg-white border border-[#E2E4EA] hover:border-[#0046FF]/40 text-[#3A3F52] hover:text-[#0046FF] font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger
            </a>
          </div>
        </div>

        {/* Alerte pédagogique */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <div className="flex gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-amber-800 font-bold text-sm mb-1">Le nerf de la guerre</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                80% des entreprises qui font faillite sont rentables mais manquent de liquidités.
                La trésorerie se pilote en avance, pas en réaction.
              </p>
            </div>
          </div>
        </div>

        {/* Sélecteur de vue */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPdfView("embed")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              pdfView === "embed"
                ? "bg-[#0046FF] text-white"
                : "bg-white border border-[#E2E4EA] text-[#555B6E] hover:border-[#0046FF]/30"
            }`}
          >
            Lire en ligne
          </button>
          <button
            onClick={() => setPdfView("download")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              pdfView === "download"
                ? "bg-[#0046FF] text-white"
                : "bg-white border border-[#E2E4EA] text-[#555B6E] hover:border-[#0046FF]/30"
            }`}
          >
            Télécharger
          </button>
        </div>

        {/* Lecteur PDF */}
        {pdfView === "embed" ? (
          <div className="bg-white rounded-2xl border border-[#E2E4EA] overflow-hidden shadow-sm">
            <iframe
              src="/guides/guide-tresorerie.pdf#toolbar=1&navpanes=0"
              className="w-full"
              style={{ height: "80vh", minHeight: "600px" }}
              title="7 moyens d'augmenter votre flux de trésorerie"
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E4EA] p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#0046FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0046FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-[#0A0A0F] font-black text-lg mb-2">Guide Trésorerie</h3>
            <p className="text-[#555B6E] text-sm mb-6">
              Téléchargez le guide complet pour le consulter hors ligne sur tous vos appareils.
            </p>
            <a
              href="/guides/guide-tresorerie.pdf"
              download="Guide-7-Moyens-Tresorerie.pdf"
              className="inline-flex items-center gap-2 bg-[#0046FF] hover:bg-[#0033CC] text-white font-black text-sm px-6 py-3 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le PDF (8 Mo)
            </a>
            <p className="text-[#9096A5] text-xs mt-3">Format PDF · Compatible tous appareils</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-[#000D2B] rounded-2xl p-6">
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">
            Pour aller plus loin
          </p>
          <h3 className="text-white font-black text-lg mb-2">
            Votre trésorerie mérite une attention personnalisée.
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            En 30 minutes, nos experts identifient les failles dans votre gestion de trésorerie
            et vous donnent un plan d&apos;action immédiat.
          </p>
          <a
            href="https://calendly.com/maxpiccinini"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0046FF] hover:bg-[#2563FF] text-white font-black text-sm px-5 py-3 rounded-xl transition-all"
          >
            Réserver un appel gratuit →
          </a>
          <p className="text-white/30 text-xs mt-3">Gratuit. Sans engagement. 30 minutes.</p>
        </div>
      </main>
    </div>
  );

  if (!session) {
    return content;
  }

  return (
    <AppLayout session={session} sessionId={sessionId}>
      {content}
    </AppLayout>
  );
}

export default function GuideTrsoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GuideTrsoContent />
    </Suspense>
  );
}
