"use client";

import { Sidebar, MobileTopBar } from "./Sidebar";
import type { SessionData, Progression } from "@/lib/types";

interface AppLayoutProps {
  session: SessionData;
  sessionId: string;
  progression?: Progression | null;
  children: React.ReactNode;
}

export function AppLayout({ session, sessionId, progression, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      {/* Sidebar desktop */}
      <Sidebar session={session} sessionId={sessionId} progression={progression} />

      {/* Main content — avec marge gauche sur desktop */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <MobileTopBar session={session} sessionId={sessionId} />

        {/* Page content */}
        <main className="flex-1 flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
