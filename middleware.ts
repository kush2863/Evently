import { authMiddleware } from "@clerk/nextjs";

// Configure Clerk auth middleware so that public pages and static assets are
// not blocked (images, icons, favicon, etc.) when the user isn't signed in.
export default authMiddleware({
  // Routes that should be accessible to signed-in and signed-out users (auth runs, but no redirect)
  publicRoutes: [
    '/',
    '/events/:id', // dynamic event details page
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing',
  ],
  // Routes that should completely bypass Clerk (no auth check at all)
  ignoredRoutes: [
    '/favicon.ico',
    '/assets/:path*',          // all files under public/assets
    '/_next/:path*',           // Next.js build assets
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing'
  ],
});

// Matcher adapted from Clerk docs: exclude _next and any request for a file with an extension.
export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // anything that's not a static file or _next
    '/',
    '/(api|trpc)(.*)'
  ],
};
