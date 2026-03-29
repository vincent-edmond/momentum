'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CTA_URL = '/sign-in';

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,13,43,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', width: '100%', maxWidth: 520,
          borderRadius: '24px 24px 0 0',
          padding: '32px 28px 40px',
          animation: 'slideUp 0.3s cubic-bezier(.22,.61,.36,1)',
          position: 'relative',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, background: '#E2E4EA', borderRadius: 2, margin: '0 auto 24px' }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: '#F0F1F5', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#555B6E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0046FF', marginBottom: 8 }}>
          Diagnostic 100% Gratuit
        </p>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22, color: '#00194C', lineHeight: 1.25, marginBottom: 16 }}>
          Obtenez votre plan personnalisé en 2 minutes
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {[
            'Diagnostic IA selon votre profil exact',
            '3 vidéos sélectionnées pour vous',
            'Plan de progression actionnable',
            '100% gratuit — résultat immédiat',
          ].map((item) => (
            <li key={item} style={{ display: 'flex', gap: 10, fontSize: 15, color: '#2A2D35', alignItems: 'flex-start' }}>
              <span style={{ color: '#0046FF', flexShrink: 0 }}>✅</span> {item}
            </li>
          ))}
        </ul>
        <Link
          href={CTA_URL}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#0046FF', color: '#fff', borderRadius: 100,
            padding: '18px 32px', fontWeight: 700, fontSize: 17, textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(0,70,255,0.35)',
          }}
        >
          Commencer mon diagnostic →
        </Link>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#9096A5', marginTop: 14 }}>
          🔒 Sans carte bancaire · Vos données restent confidentielles
        </p>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) {
            el.target.classList.add('is-visible');
            observer.unobserve(el.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-root">
      <style>{`
        /* ── Reset & Base ── */
        .landing-root *, .landing-root *::before, .landing-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .landing-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0A0A0F; background: #fff; line-height: 1.6; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');

        /* ── Variables ── */
        :root {
          --blue: #0046FF;
          --blue-hover: #0033CC;
          --navy: #00194C;
          --navy-deep: #000D2B;
          --white: #FFFFFF;
          --off-white: #F7F8FA;
          --gray-50: #F8F9FB;
          --gray-100: #F0F1F5;
          --gray-200: #E2E4EA;
          --gray-500: #9096A5;
          --gray-600: #555B6E;
          --gray-800: #2A2D35;
          --radius-xl: 20px;
          --radius-lg: 16px;
          --radius-md: 12px;
          --radius-sm: 8px;
          --radius-pill: 100px;
        }

        /* ── Scroll Reveal ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s cubic-bezier(.22,.61,.36,1), transform 0.6s cubic-bezier(.22,.61,.36,1); }
        .reveal.is-visible { opacity: 1; transform: none; }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        /* ── Topbar ── */
        .topbar {
          position: sticky; top: 0; z-index: 100;
          background: var(--blue);
          color: #fff;
          text-align: center;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .topbar strong { font-weight: 700; }

        /* ── Container ── */
        .container { max-width: 1120px; margin: 0 auto; padding: 0 40px; }
        @media (max-width: 768px) { .container { padding: 0 20px; } }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--blue); color: #fff;
          padding: 18px 36px; border-radius: var(--radius-pill);
          font-size: 17px; font-weight: 700; font-family: 'Inter', sans-serif;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 24px rgba(0,70,255,0.35);
          white-space: nowrap;
        }
        .btn-primary:hover { background: var(--blue-hover); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,70,255,0.45); }
        .btn-primary.btn-lg { padding: 20px 48px; font-size: 18px; }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12); color: #fff;
          padding: 16px 32px; border-radius: var(--radius-pill);
          font-size: 16px; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.25);
          transition: background 0.25s ease, transform 0.2s ease;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }

        /* ── HERO ── */
        .hero {
          background: var(--navy-deep);
          padding: 72px 0 80px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,70,255,0.3) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,25,76,0.8) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px),
                            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px);
          pointer-events: none;
        }
        .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 28px; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,70,255,0.15); border: 1px solid rgba(0,70,255,0.4);
          color: #6B9FFF; border-radius: var(--radius-pill);
          padding: 8px 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .hero-badge-dot {
          width: 7px; height: 7px; background: var(--blue); border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero h1 {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 800; color: #fff; line-height: 1.15;
          max-width: 800px;
        }
        .hero h1 .accent { color: #6B9FFF; display: block; }

        .hero-sub {
          font-size: clamp(16px, 2vw, 19px); color: rgba(255,255,255,0.7);
          max-width: 640px; line-height: 1.65;
        }

        .hero-author {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg); padding: 14px 20px;
          backdrop-filter: blur(12px);
        }
        .hero-author img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .hero-author-name { font-weight: 700; color: #fff; font-size: 15px; }
        .hero-author-title { color: rgba(255,255,255,0.55); font-size: 13px; }

        .hero-mini-stats {
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center;
        }
        .hero-mini-stat { text-align: center; }
        .hero-mini-stat-num { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 22px; color: #fff; }
        .hero-mini-stat-label { font-size: 12px; color: rgba(255,255,255,0.5); }
        .hero-mini-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.15); }

        .hero-cta-group { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .hero-reassurance { font-size: 13px; color: rgba(255,255,255,0.45); }

        /* ── STATS BAR ── */
        .stats-bar { background: #fff; padding: 48px 0; border-bottom: 1px solid var(--gray-200); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
        .stat-item { text-align: center; padding: 16px; }
        .stat-num { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: clamp(28px, 4vw, 40px); color: var(--navy); }
        .stat-num span { color: var(--blue); }
        .stat-label { font-size: 14px; color: var(--gray-600); margin-top: 4px; }

        /* ── PAIN ── */
        .pain-section { background: var(--navy); padding: 80px 0; }
        .section-label { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 16px; text-align: center; }
        .pain-section .section-label { color: rgba(255,255,255,0.45); }
        .pain-section h2 {
          font-family: 'Poppins', sans-serif; font-size: clamp(26px, 4vw, 42px);
          font-weight: 800; color: #fff; text-align: center; max-width: 680px;
          margin: 0 auto 52px; line-height: 1.2;
        }
        .pain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .pain-grid { grid-template-columns: 1fr; } }
        .pain-card {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg); padding: 28px;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .pain-card:hover { border-color: rgba(0,70,255,0.4); transform: translateY(-3px); }
        .pain-icon { font-size: 28px; margin-bottom: 12px; }
        .pain-card h3 { font-weight: 700; color: #fff; font-size: 17px; margin-bottom: 8px; }
        .pain-card p { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6; }

        /* ── HOW IT WORKS ── */
        .how-section { background: var(--off-white); padding: 80px 0; }
        .section-title { font-family: 'Poppins', sans-serif; font-size: clamp(26px, 4vw, 40px); font-weight: 800; color: var(--navy); text-align: center; margin-bottom: 12px; }
        .section-sub { text-align: center; color: var(--gray-600); font-size: 17px; max-width: 560px; margin: 0 auto 52px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr; } }
        .step-card {
          background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-xl);
          padding: 36px 28px; text-align: center;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .step-card:hover { border-color: var(--blue); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,70,255,0.1); }
        .step-num {
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--blue); color: #fff;
          font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .step-icon { font-size: 36px; margin-bottom: 16px; }
        .step-card h3 { font-weight: 700; font-size: 18px; color: var(--navy); margin-bottom: 10px; }
        .step-card p { color: var(--gray-600); font-size: 15px; line-height: 1.65; }
        .step-time { display: inline-block; margin-top: 14px; font-size: 12px; font-weight: 600; color: var(--blue); background: rgba(0,70,255,0.08); padding: 4px 12px; border-radius: var(--radius-pill); }

        /* ── WHAT YOU GET ── */
        .get-section { background: #fff; padding: 80px 0; }
        .get-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 900px; margin: 0 auto; }
        @media (max-width: 768px) { .get-grid { grid-template-columns: 1fr; } }
        .get-item {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-lg);
          padding: 24px; transition: border-color 0.25s, transform 0.25s;
        }
        .get-item:hover { border-color: var(--blue); transform: translateY(-2px); }
        .get-check { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
        .get-item h4 { font-weight: 700; font-size: 16px; color: var(--navy); margin-bottom: 4px; }
        .get-item p { font-size: 14px; color: var(--gray-600); line-height: 1.55; }

        /* ── FOR WHO ── */
        .who-section { background: var(--off-white); padding: 80px 0; }
        .who-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 860px; margin: 0 auto; }
        @media (max-width: 768px) { .who-grid { grid-template-columns: 1fr; } }
        .who-card { background: #fff; border: 1px solid var(--gray-200); border-radius: var(--radius-xl); padding: 32px 28px; }
        .who-card-title { font-weight: 700; font-size: 18px; margin-bottom: 20px; }
        .who-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .who-list li { display: flex; gap: 10px; font-size: 15px; color: var(--gray-800); line-height: 1.5; }
        .who-list.no li::before { content: '❌'; flex-shrink: 0; }
        .who-list.yes li::before { content: '✅'; flex-shrink: 0; }

        /* ── ABOUT MAX ── */
        .about-section { background: #fff; padding: 80px 0; }
        .about-inner { display: flex; flex-direction: column; align-items: center; gap: 32px; text-align: center; }
        .about-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--blue); }
        .about-label { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
        .about-name { font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 800; color: var(--navy); }
        .about-name em { color: var(--blue); font-style: normal; }
        .about-bio { max-width: 600px; color: var(--gray-600); font-size: 16px; line-height: 1.7; }
        .about-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; max-width: 500px; }
        .about-stat { background: var(--off-white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 20px; }
        .about-stat-num { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 28px; color: var(--navy); }
        .about-stat-label { font-size: 13px; color: var(--gray-600); margin-top: 2px; }
        .media-bar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .media-tag { background: var(--gray-100); border-radius: var(--radius-sm); padding: 8px 18px; font-size: 13px; font-weight: 600; color: var(--gray-800); }

        /* ── FINAL CTA ── */
        .final-section {
          background: var(--navy-deep); padding: 88px 0;
          position: relative; overflow: hidden; text-align: center;
        }
        .final-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,70,255,0.25) 0%, transparent 70%);
        }
        .final-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .final-section h2 { font-family: 'Poppins', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 800; color: #fff; line-height: 1.2; max-width: 680px; }
        .final-section p { color: rgba(255,255,255,0.65); font-size: 18px; max-width: 520px; line-height: 1.65; }
        .final-checklist { list-style: none; display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .final-checklist li { color: rgba(255,255,255,0.8); font-size: 16px; display: flex; gap: 10px; align-items: flex-start; }

        /* ── FOOTER ── */
        .footer { background: var(--navy-deep); border-top: 1px solid rgba(255,255,255,0.06); padding: 32px 0; }
        .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: 'Poppins', sans-serif; font-weight: 800; color: #fff; font-size: 18px; letter-spacing: 0.05em; }
        .footer-logo span { color: var(--blue); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { color: rgba(255,255,255,0.4); font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { color: rgba(255,255,255,0.3); font-size: 13px; }

        /* ── STICKY BOTTOM BAR (mobile) ── */
        .sticky-cta {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: var(--blue); padding: 14px 20px;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.2);
        }
        .sticky-cta a {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          color: #fff; font-weight: 700; font-size: 16px; text-decoration: none;
        }
        @media (max-width: 768px) {
          .sticky-cta { display: block; }
          .hero .btn-primary { width: 100%; justify-content: center; }
          .about-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <div className="topbar">
        ✦ <strong>Diagnostic IA offert</strong> — Découvrez votre levier de croissance en 2 minutes · 100% gratuit
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-badge reveal">
              <span className="hero-badge-dot" />
              Diagnostic 100% Gratuit
            </div>

            <h1 className="reveal reveal-delay-1">
              Découvrez en 2 minutes exactement<br />ce qui bloque votre croissance
              <span className="accent">— et le plan personnalisé pour le débloquer.</span>
            </h1>

            <p className="hero-sub reveal reveal-delay-2">
              Notre IA analyse votre profil d&apos;entrepreneur et sélectionne parmi +190 ressources
              celles qui correspondent précisément à votre situation, votre secteur et votre niveau de CA.
            </p>

            <div className="hero-author reveal reveal-delay-2">
              <img
                src="https://mc-maxpiccinini-lp.netlify.app/max-portrait.webp"
                alt="Max Piccinini"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <div className="hero-author-name">Max Piccinini</div>
                <div className="hero-author-title">Nommé « Meilleur Coach Français » — Magazine Entreprendre</div>
              </div>
            </div>

            <div className="hero-mini-stats reveal reveal-delay-3">
              <div className="hero-mini-stat">
                <div className="hero-mini-stat-num">170K+</div>
                <div className="hero-mini-stat-label">entrepreneurs</div>
              </div>
              <div className="hero-mini-divider" />
              <div className="hero-mini-stat">
                <div className="hero-mini-stat-num">190+</div>
                <div className="hero-mini-stat-label">modules</div>
              </div>
              <div className="hero-mini-divider" />
              <div className="hero-mini-stat">
                <div className="hero-mini-stat-num">100M€+</div>
                <div className="hero-mini-stat-label">CA généré</div>
              </div>
            </div>

            <div className="hero-cta-group reveal reveal-delay-4">
              <Link href={CTA_URL} className="btn-primary btn-lg">
                Obtenir mon diagnostic gratuit →
              </Link>
              <p className="hero-reassurance">100% gratuit · Résultat immédiat · Sans carte bancaire</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal">
              <div className="stat-num">170 000<span>+</span></div>
              <div className="stat-label">Entrepreneurs accompagnés</div>
            </div>
            <div className="stat-item reveal reveal-delay-1">
              <div className="stat-num">190<span>+</span></div>
              <div className="stat-label">Modules de formation</div>
            </div>
            <div className="stat-item reveal reveal-delay-2">
              <div className="stat-num">100M€<span>+</span></div>
              <div className="stat-label">CA généré pour les clients</div>
            </div>
            <div className="stat-item reveal reveal-delay-3">
              <div className="stat-num">25<span>+</span></div>
              <div className="stat-label">Pays dans le monde</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN ── */}
      <section className="pain-section">
        <div className="container">
          <p className="section-label reveal">Vous vous reconnaissez ?</p>
          <h2 className="reveal">
            Vous faites déjà un beau chiffre d&apos;affaires.<br />
            Mais quelque chose freine votre prochain palier.
          </h2>
          <div className="pain-grid">
            <div className="pain-card reveal">
              <div className="pain-icon">📈</div>
              <h3>Vous savez que vous pouvez faire 2x, 3x</h3>
              <p>Mais vous ne savez pas par où commencer ni quel levier actionner en premier.</p>
            </div>
            <div className="pain-card reveal reveal-delay-1">
              <div className="pain-icon">📚</div>
              <h3>Trop de contenu, pas assez de clarté</h3>
              <p>Podcasts, formations, conseils... Rien n&apos;est calibré pour là où vous en êtes vraiment.</p>
            </div>
            <div className="pain-card reveal reveal-delay-2">
              <div className="pain-icon">🎯</div>
              <h3>Vos vrais freins ne sont jamais adressés</h3>
              <p>Acquisition, rentabilité, équipe, systèmes — les solutions génériques ne fonctionnent pas pour votre profil.</p>
            </div>
            <div className="pain-card reveal reveal-delay-3">
              <div className="pain-icon">🧭</div>
              <h3>Vous avancez sans plan structuré</h3>
              <p>À l&apos;instinct, sans feuille de route adaptée à votre niveau et à votre secteur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <p className="section-label" style={{color: 'var(--blue)'}}>Comment ça fonctionne</p>
          <h2 className="section-title reveal">3 étapes. 2 minutes. 1 plan qui vous ressemble.</h2>
          <p className="section-sub reveal">
            Pas un quiz générique. Un moteur de personnalisation qui sélectionne parmi 190 ressources
            celles qui correspondent à votre situation réelle.
          </p>
          <div className="steps-grid">
            <div className="step-card reveal">
              <div className="step-icon">❓</div>
              <div className="step-num">1</div>
              <h3>3 questions sur votre profil</h3>
              <p>Votre CA actuel, votre frein principal, votre secteur. Direct, sans formulaire interminable.</p>
              <span className="step-time">⏱ 60 secondes</span>
            </div>
            <div className="step-card reveal reveal-delay-1">
              <div className="step-icon">🤖</div>
              <div className="step-num">2</div>
              <h3>Notre IA analyse votre profil</h3>
              <p>Elle croise vos données avec +190 modules issus des programmes MentorMax et MaxMastermind.</p>
              <span className="step-time">⚡ Instantané</span>
            </div>
            <div className="step-card reveal reveal-delay-2">
              <div className="step-icon">🎯</div>
              <div className="step-num">3</div>
              <h3>Votre diagnostic personnalisé</h3>
              <p>Un plan d&apos;action structuré, les vidéos exactes pour vous, et la prochaine étape concrète à exécuter.</p>
              <span className="step-time">📊 Résultat immédiat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="get-section">
        <div className="container">
          <p className="section-label" style={{color: 'var(--blue)'}}>Ce que vous obtenez</p>
          <h2 className="section-title reveal">Votre tableau de bord personnalisé inclut</h2>
          <div className="get-grid">
            <div className="get-item reveal">
              <span className="get-check">🔍</span>
              <div>
                <h4>Votre diagnostic IA</h4>
                <p>Les 3 points précis qui freinent votre croissance, analysés selon votre profil exact.</p>
              </div>
            </div>
            <div className="get-item reveal reveal-delay-1">
              <span className="get-check">🎬</span>
              <div>
                <h4>3 vidéos sélectionnées pour vous</h4>
                <p>Choisies selon votre frein, votre CA et votre programme. Pas aléatoires — pertinentes.</p>
              </div>
            </div>
            <div className="get-item reveal reveal-delay-2">
              <span className="get-check">🗺️</span>
              <div>
                <h4>Votre chemin de progression</h4>
                <p>Les étapes dans le bon ordre, pas dans le désordre. Un plan actionnable dès aujourd&apos;hui.</p>
              </div>
            </div>
            <div className="get-item reveal reveal-delay-3">
              <span className="get-check">📖</span>
              <div>
                <h4>Une ressource lecture ciblée</h4>
                <p>La newsletter la plus pertinente pour votre situation parmi 80+ contenus disponibles.</p>
              </div>
            </div>
            <div className="get-item reveal">
              <span className="get-check">🔄</span>
              <div>
                <h4>Accès permanent à votre dashboard</h4>
                <p>Retrouvez votre diagnostic à chaque connexion. Il vous attend, cross-device.</p>
              </div>
            </div>
            <div className="get-item reveal reveal-delay-1">
              <span className="get-check">💰</span>
              <div>
                <h4>100% gratuit, sans engagement</h4>
                <p>Aucune carte bancaire. Aucun abonnement caché. Juste de la valeur, immédiatement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section className="who-section">
        <div className="container">
          <p className="section-label" style={{color: 'var(--blue)'}}>Pour qui ?</p>
          <h2 className="section-title reveal">Ce diagnostic est-il<br />fait pour vous ?</h2>
          <div className="who-grid">
            <div className="who-card reveal">
              <div className="who-card-title" style={{color: '#CC0000'}}>❌ Ce n&apos;est pas pour vous si...</div>
              <ul className="who-list no">
                <li>Vous n&apos;avez pas encore d&apos;entreprise active</li>
                <li>Vous êtes en dessous de 50K€ de CA annuel</li>
                <li>Vous cherchez des recettes miracles sans action</li>
                <li>Vous n&apos;êtes pas prêt à remettre en question vos habitudes</li>
              </ul>
            </div>
            <div className="who-card reveal reveal-delay-1">
              <div className="who-card-title" style={{color: '#007A3D'}}>✅ C&apos;est pour vous si...</div>
              <ul className="who-list yes">
                <li>Vous dirigez une entreprise à +100K€ (idéalement +300K€)</li>
                <li>Vous voulez identifier votre vrai levier de croissance</li>
                <li>Vous en avez assez du contenu générique qui ne s&apos;applique pas à vous</li>
                <li>Vous êtes prêt à passer à l&apos;action avec un plan clair</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT MAX ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-inner">
            <img
              className="about-img reveal"
              src="https://mc-maxpiccinini-lp.netlify.app/max-portrait.webp"
              alt="Max Piccinini"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%2300194C'/%3E%3Ctext x='60' y='75' text-anchor='middle' fill='white' font-size='42' font-family='Poppins,sans-serif' font-weight='800'%3EM%3C/text%3E%3C/svg%3E`;
              }}
            />
            <div>
              <p className="about-label reveal">À propos de</p>
              <h2 className="about-name reveal"><em>Max</em> Piccinini</h2>
            </div>
            <p className="about-bio reveal">
              Nommé « Meilleur Coach Français » par le magazine Entreprendre, Max accompagne
              les chefs d&apos;entreprise francophones depuis plus de 15 ans à scaler leur business,
              mieux déléguer et retrouver une qualité de vie compatible avec leurs ambitions.
            </p>
            <div className="about-stats reveal">
              <div className="about-stat">
                <div className="about-stat-num">170 000+</div>
                <div className="about-stat-label">Entrepreneurs accompagnés</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">25+ pays</div>
                <div className="about-stat-label">Dans le monde</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">100M€+</div>
                <div className="about-stat-label">CA généré pour ses clients</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">7M+</div>
                <div className="about-stat-label">Personnes touchées / mois</div>
              </div>
            </div>
            <div className="media-bar reveal">
              <span style={{fontSize: 13, color: 'var(--gray-500)', marginRight: 4}}>Vu sur</span>
              {['Forbes', 'France 2', 'BFM TV', 'France Inter', 'Entreprendre'].map((m) => (
                <span key={m} className="media-tag">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-section">
        <div className="container">
          <div className="final-inner">
            <h2 className="reveal">
              Prêt à débloquer<br />votre prochain palier ?
            </h2>
            <p className="reveal reveal-delay-1">
              Votre diagnostic prend 2 minutes. Votre plan est prêt immédiatement.
              Vos prochains 12 mois peuvent changer de trajectoire.
            </p>
            <ul className="final-checklist reveal reveal-delay-2">
              <li>✅ Diagnostic IA personnalisé selon votre profil exact</li>
              <li>✅ 3 vidéos sélectionnées pour votre situation</li>
              <li>✅ Plan de progression structuré et actionnable</li>
              <li>✅ 100% gratuit — résultat immédiat</li>
            </ul>
            <Link href={CTA_URL} className="btn-primary btn-lg reveal reveal-delay-3">
              Obtenir mon diagnostic gratuit →
            </Link>
            <p className="reveal" style={{color: 'rgba(255,255,255,0.4)', fontSize: 14}}>
              🔒 Vos données restent confidentielles. Sans engagement.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">MOMENTUM<span>.</span></div>
            <div className="footer-links">
              <a href="https://www.maxpiccinini.com/politique-de-vie-privee/" target="_blank" rel="noopener noreferrer">Vie privée</a>
              <a href="https://www.maxpiccinini.com/mentionslegales-impressum/" target="_blank" rel="noopener noreferrer">Mentions légales</a>
            </div>
            <p className="footer-copy">© 2026 Max Piccinini — Tous droits réservés</p>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="sticky-cta">
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: '#fff', fontWeight: 700, fontSize: 16,
            background: 'none', border: 'none', cursor: 'pointer', width: '100%',
          }}
        >
          Obtenir mon diagnostic gratuit →
        </button>
      </div>

      {/* ── MODAL ── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
