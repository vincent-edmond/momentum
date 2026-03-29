"use client";

import { useState, useRef, useEffect } from "react";
import { parsePhoneNumber, isValidPhoneNumber, type CountryCode } from "libphonenumber-js";

const COUNTRIES: { code: CountryCode; flag: string; label: string; dialCode: string }[] = [
  { code: "FR", flag: "🇫🇷", label: "France", dialCode: "+33" },
  { code: "BE", flag: "🇧🇪", label: "Belgique", dialCode: "+32" },
  { code: "CH", flag: "🇨🇭", label: "Suisse", dialCode: "+41" },
  { code: "LU", flag: "🇱🇺", label: "Luxembourg", dialCode: "+352" },
  { code: "CA", flag: "🇨🇦", label: "Canada", dialCode: "+1" },
  { code: "MA", flag: "🇲🇦", label: "Maroc", dialCode: "+212" },
  { code: "SN", flag: "🇸🇳", label: "Sénégal", dialCode: "+221" },
  { code: "CI", flag: "🇨🇮", label: "Côte d'Ivoire", dialCode: "+225" },
  { code: "US", flag: "🇺🇸", label: "États-Unis", dialCode: "+1" },
  { code: "GB", flag: "🇬🇧", label: "Royaume-Uni", dialCode: "+44" },
];

interface QuestionTelephoneProps {
  value: string;
  onChange: (e164: string, isValid: boolean) => void;
  prenom?: string;
}

export function QuestionTelephone({ value, onChange, prenom }: QuestionTelephoneProps) {
  const [countryCode, setCountryCode] = useState<CountryCode>("FR");
  const [rawInput, setRawInput] = useState("");
  const [touched, setTouched] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  // Validation en temps réel
  const getValidation = (raw: string, cc: CountryCode): { valid: boolean; e164: string } => {
    if (!raw.trim()) return { valid: false, e164: "" };
    try {
      const parsed = parsePhoneNumber(raw, cc);
      if (parsed && parsed.isValid()) {
        return { valid: true, e164: parsed.format("E.164") };
      }
    } catch { /* ignore */ }
    // Tentative avec indicatif préfixé
    try {
      const withCode = selectedCountry.dialCode + raw.replace(/^0/, "");
      if (isValidPhoneNumber(withCode)) {
        const parsed = parsePhoneNumber(withCode);
        return { valid: true, e164: parsed.format("E.164") };
      }
    } catch { /* ignore */ }
    return { valid: false, e164: "" };
  };

  const { valid, e164 } = getValidation(rawInput, countryCode);

  useEffect(() => {
    onChange(e164, valid);
  }, [e164, valid, onChange]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showError = touched && rawInput.length > 3 && !valid;
  const showSuccess = valid;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-zinc-900 mb-2">
          {prenom ? `${prenom}, votre` : "Votre"} numéro de téléphone professionnel
        </h2>
        <p className="text-zinc-500 text-sm">
          Pour personnaliser votre accompagnement et vous contacter si besoin.
        </p>
      </div>

      {/* Input téléphone */}
      <div className="relative" ref={dropdownRef}>
        <div
          className={`flex items-stretch border-2 rounded-xl bg-white transition-all overflow-hidden ${
            showError
              ? "border-red-400"
              : showSuccess
              ? "border-green-500"
              : "border-zinc-200 focus-within:border-[#0046FF]"
          }`}
        >
          {/* Sélecteur pays */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-3.5 bg-zinc-50 border-r border-zinc-200 hover:bg-zinc-100 transition-colors flex-shrink-0"
          >
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-sm font-semibold text-zinc-600">{selectedCountry.dialCode}</span>
            <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Input numéro */}
          <input
            type="tel"
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value);
              setTouched(true);
            }}
            onBlur={() => setTouched(true)}
            placeholder="6 12 34 56 78"
            autoFocus
            className="flex-1 px-4 py-3.5 bg-transparent outline-none text-zinc-900 placeholder-zinc-300 text-base"
          />

          {/* Icône de validation */}
          {showSuccess && (
            <div className="flex items-center pr-4">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown pays */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden w-64">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountryCode(c.code);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-50 transition-colors text-left ${
                  c.code === countryCode ? "bg-blue-50 text-[#0046FF] font-semibold" : "text-zinc-700"
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="flex-1">{c.label}</span>
                <span className="text-zinc-400">{c.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      {showError && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Numéro invalide pour {selectedCountry.label}. Vérifiez le format.
        </p>
      )}
      {showSuccess && e164 && (
        <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Numéro valide · {e164}
        </p>
      )}

      <p className="mt-4 text-xs text-zinc-400">
        🔒 Votre numéro reste confidentiel. Utilisé uniquement pour votre accompagnement.
      </p>
    </div>
  );
}
