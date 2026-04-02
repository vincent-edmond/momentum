"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { SessionData, Progression } from "@/lib/types";

interface SidebarProps {
  session?: SessionData | null;
  progression?: Progression | null;
  sessionId?: string;
  locked?: boolean;
  prenomOnboarding?: string;
}

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Mon espace",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    href: (id: string) => `/dashboard/${id}`,
  },
  {
    key: "plan",
    label: "Mon plan d'action",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    href: (id: string) => `/plan/${id}`,
  },
  {
    key: "diagnostic",
    label: "Mon diagnostic",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: (id: string) => `/diagnostic/${id}`,
  },
  {
    key: "bibliotheque",
    label: "Bibliothèque",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    href: (id: string) => `/bibliotheque/${id}`,
  },
  {
    key: "chat",
    label: "Chat avec Max",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    href: (id: string) => `/chat/${id}`,
  },
];

const FREIN_LABELS: Record<string, string> = {
  "Acquisition clients": "Acquisition",
  "Rentabilité": "Rentabilité",
  "Équipe & délégation": "Équipe",
  "Systèmes & organisation": "Systèmes",
};

const LockIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export function Sidebar({ session, progression, sessionId, locked = false, prenomOnboarding }: SidebarProps) {
  const pathname = usePathname();

  function isActive(key: string) {
    if (locked) return false;
    if (key === "dashboard") return pathname.includes("/dashboard");
    if (key === "plan") return pathname.includes("/plan/");
    if (key === "diagnostic") return pathname.includes("/diagnostic");
    if (key === "bibliotheque") return pathname.includes("/bibliotheque") || pathname.includes("/guide-ca") || pathname.includes("/guide-trso");
    if (key === "chat") return pathname.includes("/chat");
    return false;
  }

  const score = locked ? 0 : (progression?.score ?? 0);
  const displayPrenom = locked
    ? (prenomOnboarding?.trim() || "—")
    : (session?.prenom ?? "—");
  const displayFrein = locked
    ? "Profil en cours…"
    : (FREIN_LABELS[session?.frein ?? ""] ?? session?.frein ?? "");

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#000D2B] min-h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-white font-black text-lg tracking-tight">MOMENTUM</span>
        <span className="block text-white/30 text-xs mt-0.5">par Max Piccinini</span>
      </div>

      {/* Profil utilisateur */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
            locked ? "bg-white/10 text-white/30" : "bg-[#0046FF] text-white"
          }`}>
            {displayPrenom !== "—" ? displayPrenom[0].toUpperCase() : "?"}
          </div>
          <div className="min-w-0">
            <p className={`font-bold text-sm truncate ${locked && !prenomOnboarding ? "text-white/30" : "text-white"}`}>
              {displayPrenom}
            </p>
            <p className="text-white/30 text-xs truncate">{displayFrein}</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Progression</span>
            <span className={`font-bold ${locked ? "text-white/30" : "text-[#0046FF]"}`}>{score}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${locked ? "bg-white/20" : "bg-[#0046FF]"}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {locked ? (
          /* ── Mode verrouillé : items non-cliquables ── */
          <>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.key}
                title="Complète ton profil pour accéder à cette section"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-white/20 cursor-not-allowed select-none"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                <LockIcon />
              </div>
            ))}
            {/* Message d'onboarding */}
            <div className="mt-4 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-xs leading-relaxed">
                Complète ton profil pour débloquer ton espace personnalisé.
              </p>
            </div>
          </>
        ) : (
          /* ── Mode normal : items cliquables ── */
          NAV_ITEMS.map((item) => {
            const active = isActive(item.key);
            const href = item.key === "dashboard" && progression?.plan
              ? `/dashboard/${sessionId ?? ""}?plan=${progression.plan}`
              : item.href(sessionId ?? "");
            return (
              <Link
                key={item.key}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#0046FF] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

      {/* CTA bas */}
      <div className="px-4 pb-6">
        <a
          href="https://calendly.com/maxpiccinini"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#0046FF]/20 hover:bg-[#0046FF]/30 border border-[#0046FF]/30 text-[#4D8AFF] text-xs font-bold px-4 py-3 rounded-xl text-center transition-all"
        >
          Voir si je suis éligible →
        </a>
        <p className="text-white/20 text-xs text-center mt-2">Gratuit · 30 min</p>
      </div>
    </aside>
  );
}

/* ── Mobile top bar (visible sur mobile à la place du sidebar) ── */
export function MobileTopBar({ session, sessionId, locked = false }: { session?: SessionData | null; sessionId?: string; locked?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="md:hidden sticky top-0 z-20 bg-[#000D2B] border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-white font-black text-base tracking-tight">MOMENTUM</span>
        {locked ? (
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <LockIcon />
            <span>Complète ton profil</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.key === "dashboard" ? pathname.includes("/dashboard") :
                item.key === "bibliotheque" ? pathname.includes("/bibliotheque") || pathname.includes("/guide-ca") || pathname.includes("/guide-trso") :
                pathname.includes(`/${item.key}`);
              return (
                <Link
                  key={item.key}
                  href={item.href(sessionId ?? "")}
                  className={`p-2 rounded-lg transition-all ${
                    active ? "bg-[#0046FF] text-white" : "text-white/50 hover:text-white"
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </Link>
              );
            })}

          </div>
        )}
      </div>
    </header>
  );
}
