// Minimalni statički server za MSP Provjeru — bez dependency-ja.
// Railway postavlja PORT; lokalno: node server.js (default 3000).
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;

// Ruta → {fajl, content-type}. Sve se učita i gzipuje jednom pri startu.
const ROUTES = {
  '/':                 { file: 'index.html',       type: 'text/html; charset=utf-8' },
  '/index.html':       { file: 'index.html',       type: 'text/html; charset=utf-8' },
  '/minesweeper':      { file: 'minesweeper.html', type: 'text/html; charset=utf-8' },
  '/minesweeper.html': { file: 'minesweeper.html', type: 'text/html; charset=utf-8' },
  '/msp_data.json':    { file: 'msp_data.json',    type: 'application/json; charset=utf-8' },
};

for (const route of Object.values(ROUTES)) {
  route.raw = fs.readFileSync(path.join(__dirname, route.file));
  route.gz = zlib.gzipSync(route.raw, { level: 9 });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  const route = ROUTES[req.url.split('?')[0]];
  if (!route) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404');
  }

  const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const body = acceptsGzip ? route.gz : route.raw;
  const headers = {
    'Content-Type': route.type,
    'Content-Length': body.length,
    'Cache-Control': 'public, max-age=3600',
    'Vary': 'Accept-Encoding',
  };
  if (acceptsGzip) headers['Content-Encoding'] = 'gzip';

  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
});

server.listen(PORT, () => {
  console.log(`MSP Provjera sluša na portu ${PORT}`);
});
