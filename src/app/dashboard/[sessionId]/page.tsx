"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getSession,
  getSessionAsync,
  getProgression,
  getProgressionAsync,
  saveProgression,
  updateProgression,
} from "@/lib/session";
import { personalise } from "@/lib/personalisation";
import { AppLayout } from "@/components/layout/AppLayout";
import { VideoCard } from "@/components/dashboard/VideoCard";
import { TemoignageCard } from "@/components/dashboard/TemoignageCard";
import { LectureCard } from "@/components/dashboard/LectureCard";
import { ProgressionBar } from "@/components/dashboard/ProgressionBar";
import { CTASticky } from "@/components/dashboard/CTASticky";
import type {
  SessionData,
  Progression,
  PersonalisationResult,
  Etape,
  Video,
} from "@/lib/types";

// ─── EtapeCard ────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, string> = {
  video: "▶",
  lecture: "📖",
  action: "⚡",
};

const TYPE_LABEL: Record<string, string> = {
  video: "Vidéo",
  lecture: "Lecture",
  action: "Action",
};

function EtapeCard({
  etape,
  index,
  unlocked,
  active,
  done,
  onClick,
}: {
  etape: Etape;
  index: number;
  unlocked: boolean;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative flex gap-4 p-4 rounded-xl border transition-all ${
        done
          ? "bg-white border-[#E2E4EA] opacity-70"
          : active
          ? "bg-white border-[#0046FF]/40 cursor-pointer hover:border-[#0046FF]/60 shadow-sm"
          : unlocked
          ? "bg-white border-[#E2E4EA] cursor-pointer hover:border-[#D1D5E0] shadow-sm"
          : "bg-[#F7F8FA] border-[#E2E4EA] cursor-not-allowed opacity-50"
      }`}
      onClick={unlocked ? onClick : undefined}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
          done
            ? "bg-[#F0F1F5] border-[#E2E4EA] text-[#9096A5]"
            : active
            ? "bg-[#0046FF]/10 border-[#0046FF]/40 text-[#0046FF]"
            : "bg-[#F0F1F5] border-[#E2E4EA] text-[#9096A5]"
        }`}
      >
        {done ? "✓" : index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[#9096A5] uppercase tracking-wide">
            {TYPE_ICON[etape.type]} {TYPE_LABEL[etape.type]}
          </span>
          {!unlocked && (
            <span className="text-xs text-[#9096A5]">🔒 Verrouillé</span>
          )}
        </div>
        <p className="text-[#0A0A0F] font-semibold text-sm">{etape.titre}</p>
        <p className="text-[#555B6E] text-xs mt-1 leading-relaxed">
          {etape.description}
        </p>
      </div>
    </div>
  );
}

// ─── VideoMiniCard (vidéo supplémentaire) ─────────────────────────────────────

function VideoMiniCard({ video }: { video: Video }) {
  const match = video.wistia_url.match(/medias\/([a-zA-Z0-9]+)/);
  const wistiaId = match ? match[1] : null;
  const isPlaceholder = video.wistia_url.includes("placeholder");

  return (
    <div className="bg-white border border-[#E2E4EA] rounded-xl overflow-hidden shadow-sm">
      {wistiaId && !isPlaceholder ? (
        <div className="aspect-video w-full">
          <div
            className={`wistia_embed wistia_async_${wistiaId} w-full h-full`}
            style={{ position: "relative" }}
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-[#E2E4EA] to-[#D1D5E0] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-[#0046FF]/10 border-2 border-[#0046FF]/30 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-[#0046FF] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-[#9096A5] text-xs">Bientôt disponible</p>
          </div>
        </div>
      )}
      <div className="p-3">
        <p className="text-[#0A0A0F] font-semibold text-xs leading-snug">{video.titre}</p>
        <p className="text-[#9096A5] text-xs mt-1 leading-relaxed line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}

// ─── Plan color helpers ───────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, { badge: string; ring: string }> = {
  "1": {
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
    ring: "border-blue-200",
  },
  "2": {
    badge: "bg-[#0046FF]/10 text-[#0046FF] border border-[#0046FF]/20",
    ring: "border-[#0046FF]/20",
  },
  "3": {
    badge: "bg-purple-50 text-purple-600 border border-purple-200",
    ring: "border-purple-200",
  },
};

// ─── Page principale ──────────────────────────────────────────────────────────

function DashboardContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const planParam = searchParams.get("plan");
  const planNum = ([1, 2, 3].includes(Number(planParam))
    ? Number(planParam)
    : 2) as 1 | 2 | 3;

  const [session, setSession] = useState<SessionData | null>(null);
  const [result, setResult] = useState<PersonalisationResult | null>(null);
  const [progression, setProgression] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Essaie localStorage d'abord, puis serveur si autre device
      const s = getSession(sessionId) ?? await getSessionAsync(sessionId);
      if (!s) {
        setLoading(false);
        return;
      }
      setSession(s);

      const r = await personalise(s, planNum, sessionId);
      setResult(r);

      let prog = getProgression(sessionId) ?? await getProgressionAsync(sessionId);
      if (!prog) {
        prog = saveProgression(sessionId, planNum);
      }
      setProgression(prog);
      setLoading(false);
    };

    load();
  }, [sessionId, planNum]);

  function handleVideoWatched() {
    const updated = updateProgression(sessionId, { video_watched: true });
    if (updated) setProgression(updated);
  }

  function handleEtapeClick(index: number) {
    if (!progression) return;
    if (index <= progression.etape_courante) {
      const updated = updateProgression(sessionId, {
        etape_courante: index + 1,
      });
      if (updated) setProgression(updated);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !result || !progression) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#555B6E] text-lg mb-4">Session introuvable.</p>
          <a href="/qualify" className="text-[#0046FF] font-bold underline">
            Refaire le diagnostic
          </a>
        </div>
      </div>
    );
  }

  const planKey = `plan${planNum}` as "plan1" | "plan2" | "plan3";
  const chemin = result.chemins[planKey];
  const planColor = PLAN_COLORS[String(planNum)];
  const videoWatched = progression.video_watched;
  const etapeCourante = progression.etape_courante;
  const videosSupp = result.contenu.videos_supplementaires ?? [];

  return (
    <AppLayout session={session} sessionId={sessionId} progression={progression}>
      <div className="min-h-screen bg-[#F7F8FA] text-[#0A0A0F] pb-24">
        <main className="max-w-3xl mx-auto px-4 pt-8 space-y-10">
          {/* Greeting + progression */}
          <section>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0F]">
                Bienvenue, {session.prenom}. 👋
              </h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${planColor.badge}`}>
                {chemin.icon} {chemin.titre}
              </span>
            </div>
            <p className="text-[#555B6E] text-sm mb-6">
              Horizon : <span className="text-[#0A0A0F] font-semibold">{chemin.horizon}</span>
            </p>
            <ProgressionBar score={progression.score} />
          </section>

          {/* Résultat attendu */}
          <section
            className={`bg-white border rounded-2xl p-5 shadow-sm ${planColor.ring}`}
          >
            <p className="text-xs font-bold text-[#9096A5] uppercase tracking-widest mb-2">
              Résultat visé
            </p>
            <p className="text-[#3A3F52] text-sm leading-relaxed">
              {chemin.resultat}
            </p>
          </section>

          {/* Étape 1 : Vidéo principale */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#0046FF] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                1
              </div>
              <h2 className="text-lg font-black text-[#0A0A0F]">Ta formation recommandée</h2>
            </div>

            {result.contenu.video_principale ? (
              <VideoCard
                video={result.contenu.video_principale}
                watched={videoWatched}
                onWatched={handleVideoWatched}
              />
            ) : (
              <div className="bg-white border border-[#E2E4EA] rounded-2xl p-6 text-center shadow-sm">
                <p className="text-[#555B6E] text-sm">
                  Vidéo disponible prochainement.
                </p>
              </div>
            )}
          </section>

          {/* Vidéos supplémentaires */}
          {videosSupp.length > 0 && (
            <section>
              <h2 className="text-base font-black text-[#0A0A0F] mb-1">
                Formations complémentaires
              </h2>
              <p className="text-[#9096A5] text-xs mb-4">
                Sélectionnées selon ton profil pour aller plus loin.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videosSupp.map((v) => (
                  <VideoMiniCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          )}

          {/* Plan d'action : étapes */}
          {result.contenu.etapes.length > 0 && (
            <section>
              <h2 className="text-lg font-black text-[#0A0A0F] mb-4">
                Ton plan d&apos;action
              </h2>
              <div className="space-y-3">
                {result.contenu.etapes.map((etape, i) => {
                  const done = i < etapeCourante;
                  const active = i === etapeCourante;
                  return (
                    <EtapeCard
                      key={i}
                      etape={etape}
                      index={i}
                      unlocked={true}
                      active={active}
                      done={done}
                      onClick={() => handleEtapeClick(i)}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Témoignages */}
          {result.contenu.temoignages.length > 0 && (
            <section>
              <h2 className="text-lg font-black text-[#0A0A0F] mb-1">
                Ils ont fait le même chemin
              </h2>
              <p className="text-[#9096A5] text-xs mb-4">
                Même frein. Même point de départ. Résultats différents parce qu&apos;ils ont eu le bon accompagnement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.contenu.temoignages.map((t) => (
                  <TemoignageCard key={t.id} temoignage={t} />
                ))}
              </div>
            </section>
          )}

          {/* Bloc accélération */}
          <section className="bg-[#000D2B] rounded-2xl p-6">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
              La prochaine étape
            </p>
            <h3 className="text-white font-black text-lg mb-2 leading-snug">
              Tu peux avancer seul. Certains vont 3x plus vite avec un expert.
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Nos conseillers travaillent avec des entrepreneurs dans ta situation chaque semaine.
              Un appel de 30 minutes suffit pour savoir si un accompagnement peut accélérer ta trajectoire.
            </p>
            <a
              href="https://calendly.com/maxpiccinini"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0046FF] hover:bg-[#2563FF] text-white font-black text-sm px-5 py-3 rounded-xl transition-all"
            >
              Voir si je suis éligible
              <span>→</span>
            </a>
            <p className="text-white/30 text-xs mt-3">
              Gratuit. Sans engagement. 30 minutes.
            </p>
          </section>

          {/* Lecture */}
          {result.contenu.lecture && (
            <section>
              <h2 className="text-lg font-black text-[#0A0A0F] mb-4">
                Approfondis ta réflexion
              </h2>
              <LectureCard
                newsletter={result.contenu.lecture}
                locked={false}
              />
            </section>
          )}
        </main>

        <CTASticky prenom={session.prenom} />
      </div>
    </AppLayout>
  );
}

// ─── Export avec Suspense (requis par useSearchParams en App Router) ───────────

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
