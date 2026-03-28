"use client";

const STEP_LABELS = ["Accès", "Chiffre d'affaires", "Frein principal", "Secteur"];

interface StepperProps {
  step: number;
  totalSteps: number;
}

export function Stepper({ step, totalSteps }: StepperProps) {
  return (
    <div className="bg-white border-b border-zinc-100 px-4 py-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-0">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-zinc-900 text-white"
                      : i === step
                      ? "bg-[#0046FF] text-white"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {i < step ? (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === step ? "text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${
                    i < step ? "bg-zinc-900" : "bg-zinc-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
