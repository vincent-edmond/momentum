import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes publiques (pas besoin d'être connecté)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/api(.*)", // Les API routes utilisent sessionId, pas Clerk
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
