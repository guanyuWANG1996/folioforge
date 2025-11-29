import type { IncomingMessage, ServerResponse } from 'http';
import { HBS_TEMPLATES } from '../../../hbsTemplates.js';

export default async function handler(req: IncomingMessage & { method?: string; url?: string }, res: ServerResponse & { setHeader: Function; statusCode: number; end: Function }) {
  const method = (req.method || 'GET').toUpperCase();
  const url = req.url || '';
  const match = url.match(/\/api\/templates\/(.+?)\/source/);
  const id = match ? decodeURIComponent(match[1]) : '';
  console.log(`[templates-source] ${method} ${url} id=${id}`);
  if (method !== 'GET') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  const src = (HBS_TEMPLATES as any)[id];
  if (!src) { res.statusCode = 404; res.end('Not Found'); return; }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.statusCode = 200;
  res.end(src);
}
