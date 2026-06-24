// Temporary local test server for GHOST — bypasses `vercel dev` (whose bundled
// ts-node is broken under Homebrew Node 25). Serves the built static site from
// dist/ AND runs the real api/ghost.ts handler on POST /api/ghost, so the chat
// works end-to-end on localhost with the GEMINI_API_KEY from .env.
// Run: `set -a; . ./.env; set +a; npx tsx ghost-local-server.mts`
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import handler from './api/ghost.ts'

const DIST = path.resolve('dist')
const PORT = 8787

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
}

async function resolveFile(urlPath: string): Promise<string | null> {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidates =
    clean === '/'
      ? [path.join(DIST, 'index.html')]
      : [path.join(DIST, clean), path.join(DIST, clean, 'index.html'), path.join(DIST, clean + '.html')]
  for (const c of candidates) {
    if (!c.startsWith(DIST)) continue // path-traversal guard
    try {
      const s = await stat(c)
      if (s.isFile()) return c
    } catch {}
  }
  return null
}

const server = http.createServer(async (req, res) => {
  // GHOST API — call the real Vercel-style handler with a tiny req/res shim.
  if (req.url?.startsWith('/api/ghost')) {
    const chunks: Buffer[] = []
    for await (const c of req) chunks.push(c as Buffer)
    const body = Buffer.concat(chunks).toString('utf8')
    const shim = {
      statusCode: 200,
      status(code: number) {
        this.statusCode = code
        return this
      },
      json(obj: unknown) {
        res.writeHead(this.statusCode, { 'content-type': 'application/json' })
        res.end(JSON.stringify(obj))
        return this
      },
    }
    try {
      await (handler as any)({ method: req.method, headers: req.headers, body }, shim)
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: 'local-handler-threw', detail: String(e) }))
    }
    return
  }

  // Static site from dist/
  const file = await resolveFile(req.url ?? '/')
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('404')
    return
  }
  const buf = await readFile(file)
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  res.end(buf)
})

server.listen(PORT, () => {
  const key = process.env.GEMINI_API_KEY
  console.log(`GHOST local server on http://localhost:${PORT}`)
  console.log(`  /ghost  → chat UI`)
  console.log(`  GEMINI_API_KEY: ${key ? `set (len ${key.length})` : 'MISSING → GHOST will be offline'}`)
})
