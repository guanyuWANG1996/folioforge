import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../pkg/db.js';
 
type Template = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags?: string[];
  style?: string;
  repoUrl?: string;
  distPath?: string;
  engine?: string;
  schema?: Record<string, any>;
  demoData?: Record<string, any>;
  isActive?: boolean;
  visibility?: string;
};

let memory: Template[] = [];

 

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const start = Date.now();
  const method = (req.method || 'GET').toUpperCase();
  console.log(`[templates] ${method} ${req.url}`);

  try {
    const sql = process.env.DATABASE_URL ? getDb() : null;
    if (method === 'GET') {
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      const q = await sql`SELECT id, name, description, thumbnail, tags, style, repo_url, dist_path, engine, schema, demo_data, is_active, visibility FROM templates`;
      const rows: any[] = Array.isArray(q) ? q : (q as any).rows;
      const result: Template[] = rows.map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        thumbnail: t.thumbnail,
        tags: t.tags || undefined,
        style: t.style || undefined,
        repoUrl: t.repo_url || undefined,
        distPath: t.dist_path || undefined,
        engine: t.engine || undefined,
        schema: t.schema || undefined,
        demoData: t.demo_data || undefined,
        isActive: typeof t.is_active === 'boolean' ? t.is_active : undefined,
        visibility: t.visibility || undefined
      }));
      console.log(`[templates] GET db count=${result.length}`);
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
      const items: Template[] = Array.isArray(payload) ? payload : [payload];
      console.log(`[templates] POST upsert count=${items.length}`);
      if (!sql) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
      for (const t of items) {
        await sql`INSERT INTO templates (id, name, description, thumbnail, tags, style, repo_url, dist_path, engine, schema, demo_data, is_active, visibility)
                  VALUES (${t.id}, ${t.name}, ${t.description}, ${t.thumbnail}, ${t.tags ?? null}, ${t.style ?? null}, ${t.repoUrl ?? null}, ${t.distPath ?? null}, ${t.engine ?? null}, ${t.schema ?? null}, ${t.demoData ?? null}, ${typeof t.isActive === 'boolean' ? t.isActive : null}, ${t.visibility ?? null})
                  ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    thumbnail = EXCLUDED.thumbnail,
                    tags = EXCLUDED.tags,
                    style = EXCLUDED.style,
                    repo_url = EXCLUDED.repo_url,
                    dist_path = EXCLUDED.dist_path,
                    engine = EXCLUDED.engine,
                    schema = EXCLUDED.schema,
                    demo_data = EXCLUDED.demo_data,
                    is_active = EXCLUDED.is_active,
                    visibility = EXCLUDED.visibility`;
      }
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.statusCode = 405;
    res.end('Method Not Allowed');
  } catch (e: any) {
    console.error('[templates] error:', e?.message || e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  } finally {
    console.log(`[templates] done in ${Date.now() - start}ms`);
  }
}
