import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
publicRoutes:[
    '/',
    'events/:id',
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing',
    '/favicon.ico',
  '/assets/images/logo.svg',
  '/admin/__webpack_hmr',
  'assets/images/hero.png',
  'assets/icons/search.svg'
],
ignoredRoutes:[
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing'
]
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};