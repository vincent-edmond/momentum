import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-4 py-12">
      {/* Header branding */}
      <div className="text-center mb-8">
        <span className="text-[#0046FF] font-black text-2xl tracking-tight">MOMENTUM</span>
        <p className="text-[#9096A5] text-sm mt-1">par Max Piccinini</p>
        <p className="text-[#0A0A0F] font-semibold text-base mt-4">
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
    </div>
  );
}
