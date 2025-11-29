import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../../pkg/db.js';

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const method = (req.method || 'GET').toUpperCase();
  const u = new URL(req.url || '', 'http://localhost');
  const segs = u.pathname.split('/');
  const id = decodeURIComponent(segs[segs.length - 1] || '');
  console.log(`[portfolios:id] ${method} ${u.pathname} id=${id}`);
  if (!id) { res.statusCode = 400; res.end('Bad Request'); return; }

  try {
    if (method === 'DELETE') {
      const sql = process.env.DATABASE_URL ? getDb() : null;
      if (sql) {
        await sql`DELETE FROM portfolios WHERE id = ${id}`;
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true }));
        return;
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'DATABASE_URL not configured' }));
        return;
      }
    }
    res.statusCode = 405;
    res.end('Method Not Allowed');
  } catch (e: any) {
    console.error('[portfolios:id] error:', e?.message || e);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
