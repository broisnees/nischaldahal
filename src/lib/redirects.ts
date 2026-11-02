/** Posts I've renamed or moved, old slug to new path, so shared links keep working. */
export const MOVED_POSTS: Record<string, string> = {
  "hosting-mordern-application": "/writing/hosting-modern-applications",
  keyboard: "/projects/keyboard",
};

/** Pages from older versions of the site that have a real successor. */
const OLD_PAGES: Record<string, string> = {
  "/blog": "/writing",
  "/blogs": "/writing",
  "/setup": "/projects?filter=setup",
  "/stack": "/projects?filter=setup",
  "/use": "/projects?filter=setup",
  "/uses": "/projects?filter=setup",
};

/**
 * Where an old URL lives now, in one hop, or undefined when it's current.
 * Crawlers treat chains and redirects to unrelated pages as soft 404s, so
 * every old URL goes straight to its final page or stays a plain 404.
 */
export function redirectFor(pathname: string): string | undefined {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.replace(/\/+$/, "")
      : pathname;
  if (OLD_PAGES[path]) return OLD_PAGES[path];
  // Posts lived under /blog/<slug> and /blogs/<slug> before /writing.
  const post = /^\/(?:blogs?|writing)\/([^/.]+)$/.exec(path);
  if (post) {
    const slug = post[1]!;
    if (MOVED_POSTS[slug]) return MOVED_POSTS[slug];
    if (!path.startsWith("/writing/")) return `/writing/${slug}`;
  }
  return path === pathname ? undefined : path;
}
