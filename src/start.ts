import { createMiddleware, createStart } from "@tanstack/react-start";
import { redirectFor } from "~/lib/redirects";

/** One canonical host: www.nischal-dahal.com.np 301s to the bare domain. */
const canonicalHost = createMiddleware().server(({ request, next }) => {
  const host = request.headers.get("host") ?? new URL(request.url).host;
  if (host.startsWith("www.")) {
    const url = new URL(request.url);
    url.host = host.slice(4);
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return next();
});

/** Old URLs and trailing slashes 301 to their current page in one hop. */
const oldUrls = createMiddleware().server(({ request, next }) => {
  const url = new URL(request.url);
  const to = redirectFor(url.pathname);
  if (to) {
    const target = new URL(to, url);
    if (!target.search) target.search = url.search;
    return Response.redirect(target.toString(), 301);
  }
  return next();
});

// Every page is content for readers and crawlers, so every route renders in
// full on the server. Slow, non-critical data streams in through <Await>.
export const startInstance = createStart(() => ({
  defaultSsr: true,
  requestMiddleware: [canonicalHost, oldUrls],
}));
