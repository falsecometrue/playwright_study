import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const items = new Map();
const messages = new Map();
const send = (res, code, data, headers = {}) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(data === undefined ? undefined : JSON.stringify(data));
};
async function body(req) {
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 100_000) throw new Error('Body too large');
  }
  return JSON.parse(text || '{}');
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const p = url.pathname;
    if (p === '/api/search' && req.method === 'GET') {
      await delay(650);
      const q = url.searchParams.get('q') || '';
      const items = ['Playwright入門動画', 'Playwright実践動画', 'JavaScript基礎動画'].filter(x => q && x.toLowerCase().includes(q.toLowerCase()));
      return send(res, 200, { items });
    }
    if (p === '/api/recommendations' && req.method === 'GET') return send(res, 200, { videos: [{ name: 'Playwright入門動画', views: 500 }, { name: '音楽ライブ', views: 100 }] });
    if (p === '/api/export' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="captions.csv"' });
      return res.end('time,text\n00:00,こんにちは\n00:05,動画へようこそ\n');
    }
    if (p === '/api/login' && req.method === 'POST') {
      const data = await body(req);
      if (data.email !== 'user@example.com' || data.password !== 'training123') return send(res, 401, { error: 'Invalid credentials' });
      return send(res, 200, { email: data.email }, { 'Set-Cookie': 'training_session=demo-user; HttpOnly; SameSite=Lax; Path=/' });
    }
    if (p === '/api/me' && req.method === 'GET') {
      const authenticated = (req.headers.cookie || '').split(';').some(x => x.trim() === 'training_session=demo-user');
      return send(res, authenticated ? 200 : 401, authenticated ? { email: 'user@example.com' } : { error: 'Unauthorized' });
    }
    if (p === '/api/logout' && req.method === 'POST') return send(res, 204, undefined, { 'Set-Cookie': 'training_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax' });
    if (p === '/api/playlist-items' || p.startsWith('/api/playlist-items/')) {
      if (req.method === 'POST' && p === '/api/playlist-items') {
        const data = await body(req);
        if (!data.playlist || !data.title) return send(res, 400, { error: 'playlist and title required' });
        const item = { id: randomUUID(), title: data.title };
        const list = items.get(data.playlist) || [];
        list.push(item); items.set(data.playlist, list);
        return send(res, 201, { item });
      }
      const playlist = url.searchParams.get('playlist');
      if (!playlist) return send(res, 400, { error: 'playlist required' });
      if (req.method === 'GET' && p === '/api/playlist-items') return send(res, 200, { items: items.get(playlist) || [] });
      if (req.method === 'DELETE') {
        if (p === '/api/playlist-items') items.delete(playlist);
        else items.set(playlist, (items.get(playlist) || []).filter(x => x.id !== p.split('/').at(-1)));
        return send(res, 204);
      }
    }
    if (p === '/api/messages') {
      if (req.method === 'POST') {
        const data = await body(req);
        if (!data.room || !data.user || !data.text) return send(res, 400, { error: 'room, user and text required' });
        const message = { user: data.user, text: data.text };
        const list = messages.get(data.room) || [];
        list.push(message); messages.set(data.room, list);
        return send(res, 201, { message });
      }
      const room = url.searchParams.get('room');
      if (!room) return send(res, 400, { error: 'room required' });
      if (req.method === 'GET') return send(res, 200, { messages: messages.get(room) || [] });
      if (req.method === 'DELETE') { messages.delete(room); return send(res, 204); }
    }
    if (p.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
    if (p === '/' || p === '/assets/theme.css') {
      const file = p === '/' ? 'index.html' : 'assets/theme.css';
      res.writeHead(200, { 'Content-Type': p === '/' ? 'text/html; charset=utf-8' : 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(await readFile(path.join(root, file)));
    }
    let relative = decodeURIComponent(p).replace(/^\/+/, '');
    if (p.endsWith('/')) relative += 'index.html';
    // 公開対象は教材ページのみ。ソース・認証状態は配信しない。
    if (!/^(01_low|02_midium|03_high)\/[\w-]+\/(index|frame|receipt)\.html$/.test(relative)) return send(res, 404, { error: 'Not found' });
    const content = await readFile(path.join(root, relative));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(content);
  } catch (error) {
    send(res, error.code === 'ENOENT' ? 404 : 400, { error: 'Invalid request or missing file' });
  }
});
server.listen(4173, '127.0.0.1', () => console.log('練習サーバー: http://127.0.0.1:4173'));
