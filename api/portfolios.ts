import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../pkg/db.js';

type Portfolio = {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const start = Date.now();
  const method = (req.method || 'GET').toUpperCase();
  console.log(`[portfolios] ${method} ${req.url}`);

  try {
    const sql = process.env.DATABASE_URL ? getDb() : null;
    if (method === 'GET') {
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      const q = await sql`SELECT id, name, description, cover_url, owner_id, created_at, updated_at FROM portfolios`;
      const rows: any[] = Array.isArray(q) ? q : (q as any).rows;
      const result: Portfolio[] = rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? undefined,
        coverUrl: p.cover_url ?? undefined,
        ownerId: p.owner_id ?? undefined,
        createdAt: new Date(p.created_at).toISOString(),
        updatedAt: new Date(p.updated_at).toISOString()
      }));
      console.log(`[portfolios] GET db count=${result.length}`);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(result));
      return;
    }

    if (method === 'POST') {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve) => { req.on('data', (c: Buffer) => chunks.push(c)); req.on('end', () => resolve()); });
      const bodyStr = Buffer.concat(chunks).toString('utf-8');
      const payload = bodyStr ? JSON.parse(bodyStr) : [];
      const items: Portfolio[] = Array.isArray(payload) ? payload : [payload];
      console.log(`[portfolios] POST upsert count=${items.length}`);
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      for (const p of items) {
        await sql`INSERT INTO portfolios (id, name, description, cover_url, owner_id, created_at, updated_at)
                  VALUES (${p.id}, ${p.name}, ${p.description ?? null}, ${p.coverUrl ?? null}, ${p.ownerId ?? null}, ${p.createdAt}, ${p.updatedAt})
                  ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    cover_url = EXCLUDED.cover_url,
                    owner_id = EXCLUDED.owner_id,
                    created_at = EXCLUDED.created_at,
                    updated_at = EXCLUDED.updated_at`;
      }
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.statusCode = 405;
    res.end('Method Not Allowed');
  } catch (e: any) {
    console.error('[portfolios] error:', e?.message || e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  } finally {
    console.log(`[portfolios] done in ${Date.now() - start}ms`);
  }
}
