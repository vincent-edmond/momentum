import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center px-4 pt-10 pb-12">
      {/* Header branding */}
      <div className="text-center mb-7">
        <Link href="/">
          <span className="text-[#0046FF] font-black text-2xl tracking-tight">MOMENTUM</span>
        </Link>
        <p className="text-[#9096A5] text-sm mt-1">par Max Piccinini</p>
        <p className="text-[#0A0A0F] font-semibold text-base mt-3">
          Accède à ton espace personnalisé
        </p>
      </div>

      {/* Clerk sign-in component */}
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-none border border-[#E2E4EA] rounded-2xl bg-white",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "border border-[#E2E4EA] rounded-xl font-semibold text-sm hover:bg-[#F7F8FA] transition-all",
            formButtonPrimary:
              "bg-[#0046FF] hover:bg-[#0033CC] rounded-xl font-bold text-sm transition-all",
            footerActionLink: "text-[#0046FF] font-semibold",
            formFieldInput:
              "border border-[#E2E4EA] rounded-xl focus:ring-2 focus:ring-[#0046FF]/30 focus:border-[#0046FF]",
          },
        }}
      />

      {/* Note mode dev Clerk */}
      <p className="text-[#9096A5] text-xs text-center mt-5 max-w-xs">
        Si Google ne fonctionne pas sur mobile, utilise l&apos;email + mot de passe ci-dessus.
      </p>
    </div>
  );
}
