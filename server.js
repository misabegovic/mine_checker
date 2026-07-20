// Minimalni statički server za MSP Provjeru — bez dependency-ja.
// Railway postavlja PORT; lokalno: node server.js (default 3000).
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// index.html se učita i gzipuje jednom pri startu (2,2 MB → ~stotinjak KB)
const raw = fs.readFileSync(INDEX);
const gzipped = zlib.gzipSync(raw, { level: 9 });

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const body = acceptsGzip ? gzipped : raw;
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
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
