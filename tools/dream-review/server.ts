// Serves one dream batch and stores the reviewer's decisions next to it.
// Usage: bun server.ts [path/to/batch.json]
// Decisions go to <batch>.decisions.json so a later step can apply them.
import { join } from "node:path"

const batchPath = Bun.argv[2] ?? join(import.meta.dir, "data/sample-batch.json")
const decisionsPath = batchPath.replace(/\.json$/, "") + ".decisions.json"
const dist = join(import.meta.dir, "dist")
const port = Number(process.env.PORT ?? 3210)

Bun.serve({
  port,
  routes: {
    "/api/batch": () => new Response(Bun.file(batchPath)),
    "/api/decisions": {
      GET: async () => {
        const file = Bun.file(decisionsPath)
        return (await file.exists()) ? new Response(file) : Response.json({})
      },
      PUT: async (req) => {
        await Bun.write(decisionsPath, JSON.stringify(await req.json(), null, 2) + "\n")
        return new Response(null, { status: 204 })
      },
    },
  },
  // Built UI, for running without the Vite dev server
  async fetch(req) {
    const path = new URL(req.url).pathname
    const file = Bun.file(join(dist, path === "/" ? "index.html" : path))
    return (await file.exists()) ? new Response(file) : new Response(Bun.file(join(dist, "index.html")))
  },
})

console.log(`dream-review on http://localhost:${port}\n  batch:     ${batchPath}\n  decisions: ${decisionsPath}`)
