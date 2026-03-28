"use client";

import Script from "next/script";
import type { Video } from "@/lib/types";

function extractWistiaId(url: string): string | null {
  const match = url.match(/medias\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function isPlaceholder(url: string): boolean {
  return url.includes("placeholder");
}

interface VideoCardProps {
  video: Video;
  watched: boolean;
  onWatched: () => void;
}

export function VideoCard({ video, watched, onWatched }: VideoCardProps) {
  const wistiaId = extractWistiaId(video.wistia_url);
  const placeholder = isPlaceholder(video.wistia_url);

  const player =
    placeholder || !wistiaId ? (
      <div className="relative w-full aspect-video bg-[#F0F1F5] rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E2E4EA] to-[#D1D5E0]" />
        <div className="relative z-10 text-center px-6">
          <div className="w-14 h-14 rounded-full bg-[#0046FF]/10 border-2 border-[#0046FF]/30 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[#0046FF] ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-[#3A3F52] text-sm font-medium">{video.titre}</p>
          <p className="text-[#9096A5] text-xs mt-1">Vidéo disponible prochainement</p>
        </div>
      </div>
    ) : (
      <>
        <Script
          src="https://fast.wistia.com/assets/external/E-v1.js"
          strategy="afterInteractive"
        />
        <div className="w-full aspect-video rounded-2xl overflow-hidden">
          <div
            className={`wistia_embed wistia_async_${wistiaId} w-full h-full`}
            style={{ position: "relative" }}
          />
        </div>
      </>
    );

  return (
    <div className="space-y-4">
      {player}
      <div className="bg-white border border-[#E2E4EA] rounded-xl p-4 shadow-sm">
        <h3 className="text-[#0A0A0F] font-bold text-sm mb-1">{video.titre}</h3>
        <p className="text-[#555B6E] text-xs leading-relaxed mb-4">
          {video.description}
        </p>
        {!watched ? (
          <button
            onClick={onWatched}
            className="w-full sm:w-auto bg-[#0046FF] hover:bg-[#0033CC] text-white font-black text-sm px-6 py-3 rounded-xl transition-all"
          >
            ✓ Marquer comme vu
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span>✓</span>
            <span className="font-semibold">Vidéo regardée, bien joué !</span>
          </div>
        )}
      </div>
    </div>
  );
}
