import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../pkg/db.js';

type Deployment = {
  id: string;
  portfolioVersionId: string;
  triggeredBy?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  vercelProjectId?: string;
  vercelDeploymentId?: string;
  url?: string;
};

 


export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const start = Date.now();
  const method = (req.method || 'GET').toUpperCase();
  console.log(`[deployments] ${method} ${req.url}`);

  try {
    const sql = process.env.DATABASE_URL ? getDb() : null;
    if (method === 'GET') {
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      const q = await sql`SELECT id, portfolio_version_id, triggered_by, created_at, updated_at, status, vercel_project_id, vercel_deployment_id, url FROM deployments`;
      const rows: any[] = Array.isArray(q) ? q : (q as any).rows;
      const result: Deployment[] = rows.map((d: any) => ({
        id: d.id,
        portfolioVersionId: d.portfolio_version_id,
        triggeredBy: d.triggered_by ?? undefined,
        createdAt: new Date(d.created_at).toISOString(),
        updatedAt: new Date(d.updated_at).toISOString(),
        status: d.status,
        vercelProjectId: d.vercel_project_id ?? undefined,
        vercelDeploymentId: d.vercel_deployment_id ?? undefined,
        url: d.url ?? undefined
      }));
      console.log(`[deployments] GET db count=${result.length}`);
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
      const items: Deployment[] = Array.isArray(payload) ? payload : [payload];
      console.log(`[deployments] POST upsert count=${items.length}`);
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      for (const d of items) {
        await sql`INSERT INTO deployments (id, portfolio_version_id, triggered_by, created_at, updated_at, status, vercel_project_id, vercel_deployment_id, url)
                  VALUES (${d.id}, ${d.portfolioVersionId}, ${d.triggeredBy ?? null}, ${d.createdAt}, ${d.updatedAt}, ${d.status}, ${d.vercelProjectId ?? null}, ${d.vercelDeploymentId ?? null}, ${d.url ?? null})
                  ON CONFLICT (id) DO UPDATE SET
                    portfolio_version_id = EXCLUDED.portfolio_version_id,
                    triggered_by = EXCLUDED.triggered_by,
                    created_at = EXCLUDED.created_at,
                    updated_at = EXCLUDED.updated_at,
                    status = EXCLUDED.status,
                    vercel_project_id = EXCLUDED.vercel_project_id,
                    vercel_deployment_id = EXCLUDED.vercel_deployment_id,
                    url = EXCLUDED.url`;
      }
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.statusCode = 405;
    res.end('Method Not Allowed');
  } catch (e: any) {
    console.error('[deployments] error:', e?.message || e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  } finally {
    console.log(`[deployments] done in ${Date.now() - start}ms`);
  }
}
