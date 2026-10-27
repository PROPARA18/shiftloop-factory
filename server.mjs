import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('./public',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
export function createServer(){return http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://www.gstatic.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.google.com; img-src 'self' data:; frame-src https://*.firebaseapp.com; object-src 'none'; base-uri 'self'; form-action 'self'");
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return;}
 if(url==='/healthz'){res.writeHead(200,{'Content-Type':'text/plain'});res.end('ok');return;}
 if(url==='/config.json'){
  let config=null;try{config=JSON.parse(process.env.FIREBASE_CONFIG||'null')}catch{}
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({firebase:config}));return;
 }
 const file=path.resolve(root,'.'+(url==='/'?'/index.html':url));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data)}catch{res.writeHead(404);res.end('Not found')}
});}
if(process.argv[1]===fileURLToPath(import.meta.url)){createServer().listen(Number(process.env.PORT)||8080,'0.0.0.0',()=>console.log('ShiftLoop ready: http://localhost:'+(process.env.PORT||8080)));}
