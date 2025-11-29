import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../pkg/db.js';

type PortfolioVersion = {
  id: string;
  portfolioId: string;
  templateId: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
  lastModified: string;
};

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const start = Date.now();
  const method = (req.method || 'GET').toUpperCase();
  console.log(`[versions] ${method} ${req.url}`);

  try {
    const sql = process.env.DATABASE_URL ? getDb() : null;
    if (method === 'GET') {
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      const q = await sql`SELECT id, portfolio_id, template_id, data, status, created_at, last_modified FROM portfolio_versions`;
      const rows: any[] = Array.isArray(q) ? q : (q as any).rows;
      const result: PortfolioVersion[] = rows.map((v: any) => ({
        id: v.id,
        portfolioId: v.portfolio_id,
        templateId: v.template_id,
        data: v.data || {},
        status: v.status,
        createdAt: new Date(v.created_at).toISOString(),
        lastModified: new Date(v.last_modified).toISOString()
      }));
      console.log(`[versions] GET db count=${result.length}`);
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
      const items: PortfolioVersion[] = Array.isArray(payload) ? payload : [payload];
      console.log(`[versions] POST upsert count=${items.length}`);
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      for (const v of items) {
        await sql`INSERT INTO portfolio_versions (id, portfolio_id, template_id, data, status, created_at, last_modified)
                  VALUES (${v.id}, ${v.portfolioId}, ${v.templateId}, ${v.data ?? {}}, ${v.status}, ${v.createdAt}, ${v.lastModified})
                  ON CONFLICT (id) DO UPDATE SET
                    portfolio_id = EXCLUDED.portfolio_id,
                    template_id = EXCLUDED.template_id,
                    data = EXCLUDED.data,
                    status = EXCLUDED.status,
                    created_at = EXCLUDED.created_at,
                    last_modified = EXCLUDED.last_modified`;
      }
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.statusCode = 405;
    res.end('Method Not Allowed');
  } catch (e: any) {
    console.error('[versions] error:', e?.message || e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  } finally {
    console.log(`[versions] done in ${Date.now() - start}ms`);
  }
}
