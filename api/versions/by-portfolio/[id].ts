import type { IncomingMessage, ServerResponse } from 'http';
import getDb from '../../../pkg/db.js';

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const method = (req.method || 'GET').toUpperCase();
  const u = new URL(req.url || '', 'http://localhost');
  const segs = u.pathname.split('/');
  const id = decodeURIComponent(segs[segs.length - 1] || '');
  console.log(`[versions:by-portfolio] ${method} ${u.pathname} id=${id}`);
  if (!id) { res.statusCode = 400; res.end('Bad Request'); return; }
  if (method !== 'DELETE') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  const sql = process.env.DATABASE_URL ? getDb() : null;
  if (!sql) { res.setHeader('Content-Type', 'application/json'); res.statusCode = 500; res.end(JSON.stringify({ error: 'DATABASE_URL not configured' })); return; }
  try {
    await sql`DELETE FROM portfolio_versions WHERE portfolio_id = ${id}`;
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
