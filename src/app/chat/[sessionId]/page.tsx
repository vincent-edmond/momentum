"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getSession, getSessionAsync, getChatHistory, saveChatMessage } from "@/lib/session";
import { AppLayout } from "@/components/layout/AppLayout";
import type { SessionData, ChatMessage } from "@/lib/types";

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface MessageBubble {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  loading?: boolean;
}

// ─── Message d'accueil contextuel ─────────────────────────────────────────────

function buildWelcomeMessage(session: SessionData): string {
  const freinLabels: Record<string, string> = {
    "Acquisition clients": "l'acquisition de nouveaux clients",
    "Rentabilité": "la rentabilité de ton activité",
    "Équipe & délégation": "la délégation et la gestion d'équipe",
    "Systèmes & organisation": "l'organisation et les systèmes",
  };

  const freinLabel = freinLabels[session.frein] ?? session.frein;

  return `Bonjour ${session.prenom}. Je suis Max — ou plutôt mon clone IA, entraîné avec mes méthodes et ma façon de penser.\n\nD'après ton diagnostic, ton principal frein de croissance est ${freinLabel}. C'est un sujet que je connais bien.\n\nQu'est-ce que tu veux résoudre en priorité ? Pose-moi ta question directement.`;
}

// ─── Composants ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#0046FF] flex-shrink-0 flex items-center justify-center text-white font-black text-xs">
        M
      </div>
      <div className="bg-white border border-[#E2E4EA] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#9096A5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-[#9096A5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-[#9096A5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// Détecte si le message contient un lien Calendly → affiche une CTA card
function extractCtaUrl(content: string): string | null {
  const match = content.match(/https:\/\/calendly\.com\/[^\s)]+/);
  return match ? match[0] : null;
}

function stripCtaUrl(content: string): string {
  return content.replace(/→?\s*https:\/\/calendly\.com\/[^\s)]+/, "").trim();
}

function CtaCard() {
  return (
    <a
      href="https://calendly.com/maxpiccinini"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block bg-[#000D2B] rounded-xl p-4 hover:bg-[#001144] transition-all"
    >
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Session offerte</p>
      <p className="text-white font-black text-sm mb-2">Réserver 30 min avec l&apos;équipe →</p>
      <p className="text-white/60 text-xs">Gratuit · Sans engagement · Analyse de votre situation</p>
    </a>
  );
}

function ChatBubble({ msg }: { msg: MessageBubble }) {
  const isUser = msg.role === "user";

  if (msg.loading) {
    return <TypingIndicator />;
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-[#0046FF] text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </div>
      </div>
    );
  }

  const ctaUrl = extractCtaUrl(msg.content);
  const displayContent = ctaUrl ? stripCtaUrl(msg.content) : msg.content;

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#0046FF] flex-shrink-0 flex items-center justify-center text-white font-black text-xs mt-0.5">
        M
      </div>
      <div className="max-w-[85%]">
        <div className="bg-white border border-[#E2E4EA] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-sm text-[#0A0A0F] leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </div>
        {ctaUrl && <CtaCard />}
      </div>
    </div>
  );
}

// ─── Suggestions rapides ──────────────────────────────────────────────────────

const QUICK_SUGGESTIONS = [
  "Je stagne depuis 3 mois, je ne sais plus quoi faire.",
  "J'ai du mal à trouver des clients régulièrement.",
  "Mon équipe ne performe pas comme je le voudrais.",
  "Je travaille trop pour ce que je gagne.",
];

// ─── Page principale ──────────────────────────────────────────────────────────

export default function ChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Chargement initial
  useEffect(() => {
    const init = async () => {
      const s = getSession(sessionId) ?? await getSessionAsync(sessionId);
      if (!s) return;
      setSession(s);

      // Charger l'historique persisté
      const history = getChatHistory(sessionId);
      if (history.length > 0) {
        setMessages(history.map((m) => ({ ...m, loading: false })));
      } else {
        // Message d'accueil généré à la première visite
        const welcome: MessageBubble = {
          role: "assistant",
          content: buildWelcomeMessage(s),
          timestamp: new Date().toISOString(),
        };
        setMessages([welcome]);
        saveChatMessage(sessionId, { role: "assistant", content: welcome.content, timestamp: welcome.timestamp });
      }
      setInitialized(true);
    };
    init();
  }, [sessionId]);

  // Scroll auto vers le bas
  useEffect(() => {
    if (initialized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, initialized]);

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;

    const userMsg: MessageBubble = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const loadingMsg: MessageBubble = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setSending(true);

    // Sauvegarder le message utilisateur
    saveChatMessage(sessionId, { role: userMsg.role, content: userMsg.content, timestamp: userMsg.timestamp });

    try {
      const history = getChatHistory(sessionId);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text.trim(),
          history,
          profil: session
            ? { prenom: session.prenom, ca: session.ca, frein: session.frein, secteur: session.secteur }
            : undefined,
        }),
      });

      const data = await res.json() as { reply?: string; error?: string };
      const reply = data.reply ?? "Je n'ai pas pu répondre à cette question. Reformule-la différemment.";

      const assistantMsg: MessageBubble = {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
      saveChatMessage(sessionId, { role: "assistant", content: reply, timestamp: assistantMsg.timestamp });
    } catch {
      const errorMsg: MessageBubble = {
        role: "assistant",
        content: "Une erreur est survenue. Vérifie ta connexion et réessaie.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMsg]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0046FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showSuggestions = messages.length <= 1 && !sending;

  return (
    <AppLayout session={session} sessionId={sessionId}>
      <div className="flex flex-col flex-1 min-h-0 bg-[#F7F8FA]">

        {/* Header chat */}
        <div className="bg-white border-b border-[#E2E4EA] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#0046FF] flex items-center justify-center text-white font-black text-sm">
            M
          </div>
          <div>
            <p className="text-[#0A0A0F] font-bold text-sm">Max Piccinini</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[#9096A5] text-xs">Clone IA disponible</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-[#0046FF]/10 text-[#0046FF] font-bold px-2.5 py-1 rounded-full">
              IA
            </span>
          </div>
        </div>

        {/* Zone de messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}

            {/* Suggestions rapides */}
            {showSuggestions && (
              <div className="mt-4 mb-2">
                <p className="text-xs text-[#9096A5] mb-3 text-center">Suggestions pour commencer</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left bg-white border border-[#E2E4EA] hover:border-[#0046FF]/40 hover:bg-[#0046FF]/5 text-[#3A3F52] text-xs font-medium px-3 py-2.5 rounded-xl transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="bg-white border-t border-[#E2E4EA] px-4 py-3 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question à Max…"
              rows={1}
              className="flex-1 resize-none border border-[#E2E4EA] rounded-xl px-4 py-3 text-sm text-[#0A0A0F] placeholder-[#9096A5] focus:outline-none focus:ring-2 focus:ring-[#0046FF]/30 focus:border-[#0046FF] transition-all max-h-32 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !sending
                  ? "bg-[#0046FF] hover:bg-[#0033CC] text-white"
                  : "bg-[#E2E4EA] text-[#9096A5] cursor-not-allowed"
              }`}
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-[#9096A5] mt-2">
            Entrée pour envoyer · Maj+Entrée pour un saut de ligne
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
