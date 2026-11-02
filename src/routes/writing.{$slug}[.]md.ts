import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "~/lib/seo";
import { getPostMarkdown } from "~/server/posts.server";

/** /writing/<slug>.md: the post as plain Markdown, for agents and curl. */
export const Route = createFileRoute("/writing/{$slug}.md")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const markdown = getPostMarkdown(params.slug);
        if (markdown === undefined) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(markdown, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            // Same post as the HTML page; point search engines there.
            Link: `<${SITE_URL}/writing/${params.slug}>; rel="canonical"`,
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
