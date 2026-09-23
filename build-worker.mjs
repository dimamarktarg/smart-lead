import {readFile,mkdir,writeFile,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const assets={};
const assetFiles=new Set(await readdir('public/assets'));
function superseded(file){const name=path.basename(file);return (name.endsWith('.ttf')&&assetFiles.has(name.replace(/\.ttf$/,'.woff2')))||(name.endsWith('.jpg')&&assetFiles.has(name.replace(/\.jpg$/,'.webp')));}
async function collect(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await collect(file);else{if(superseded(file))continue;const data=await readFile(file);const url='/'+path.relative('dist/client',file);assets[url]=[mime[path.extname(file)]||'application/octet-stream',data.toString('base64')];}}}
await collect('dist/client');
assets['/']=assets['/index.html'];delete assets['/index.html'];
assets['/privacy-policy/']=assets['/privacy-policy/index.html'];delete assets['/privacy-policy/index.html'];
const publicOrigin='https://smart-lead-clean.dimamarktarg.chatgpt.site';
const previewImage=publicOrigin+'/assets/social-preview.jpg?v=20260920';
let homeHtml=Buffer.from(assets['/'][1],'base64').toString('utf8');
homeHtml=homeHtml
 .replace('<meta content="ru_RU" property="og:locale"/>','<link href="'+publicOrigin+'/" rel="canonical"/><meta content="uk_UA" property="og:locale"/>')
 .replace('<meta content="website" property="og:type"/>','<meta content="website" property="og:type"/><meta content="'+publicOrigin+'/" property="og:url"/>')
 .replace('<meta content="/assets/social-preview.jpg" property="og:image"/>','<meta content="'+previewImage+'" property="og:image"/><meta content="'+previewImage+'" property="og:image:secure_url"/>')
 .replace('<meta content="image/jpeg" property="og:image:type"/>','<meta content="image/jpeg" property="og:image:type"/><meta content="summary_large_image" name="twitter:card"/><meta content="Smart-Lead - клієнти вже у перший день запуску реклами!" name="twitter:title"/><meta content="Рекомендації та розробка стратегії БЕЗКОШТОВНО! Реклама INST &amp; FB • Google ads • SMM • Створення сайту" name="twitter:description"/><meta content="'+previewImage+'" name="twitter:image"/>');
assets['/']=[assets['/'][0],Buffer.from(homeHtml).toString('base64')];
const socialHtml='<!doctype html><html lang="uk"><head><meta charset="utf-8"><title>Smart-Lead - клієнти вже у перший день запуску реклами!</title><meta name="description" content="Рекомендації та розробка стратегії БЕЗКОШТОВНО! Реклама INST &amp; FB • Google ads • SMM • Створення сайту • Брендінг • Створення скриптів з продажу"><link rel="canonical" href="'+publicOrigin+'/"><meta property="og:locale" content="uk_UA"><meta property="og:type" content="website"><meta property="og:url" content="'+publicOrigin+'/"><meta property="og:site_name" content="Smart Lead"><meta property="og:title" content="Smart-Lead - клієнти вже у перший день запуску реклами!"><meta property="og:description" content="Рекомендації та розробка стратегії БЕЗКОШТОВНО! Реклама INST &amp; FB • Google ads (Контекстна реклама) • SMM • Створення сайту • Брендінг • Створення скриптів з продажу"><meta property="og:image" content="'+previewImage+'"><meta property="og:image:secure_url" content="'+previewImage+'"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="800"><meta property="og:image:height" content="800"><meta property="og:image:alt" content="Smart Lead"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Smart-Lead - клієнти вже у перший день запуску реклами!"><meta name="twitter:description" content="Рекомендації та розробка стратегії БЕЗКОШТОВНО! Реклама INST &amp; FB • Google ads • SMM • Створення сайту"><meta name="twitter:image" content="'+previewImage+'"></head><body></body></html>';
const contact=await readFile('contact.js','utf8');
const worker=contact+'\nconst socialHtml='+JSON.stringify(socialHtml)+';\nconst assets='+JSON.stringify(assets)+';\n'+`export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.pathname==='/api/contact')return contact(request,env);
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const userAgent=request.headers.get('user-agent')||'';
 // Resolve the plain Telegram URL to the same URL with a confirmed working card.
 // Never redirect browsers, tracked links, assets, or the destination itself.
 if(url.pathname==='/'&&!url.search&&/TelegramBot/i.test(userAgent)){
  return new Response(null,{status:302,headers:{'Location':'https://smart-lead-clean.dimamarktarg.chatgpt.site/?v=20260920','Cache-Control':'no-store','Vary':'User-Agent'}});
 }
 if(url.pathname==='/'&&/(TelegramBot|Twitterbot|facebookexternalhit|LinkedInBot|WhatsApp)/i.test(userAgent)){
  const previewBytes=new TextEncoder().encode(socialHtml);
  return new Response(request.method==='HEAD'?null:previewBytes,{headers:{'Content-Type':'text/html; charset=utf-8','Content-Length':String(previewBytes.byteLength),'Cache-Control':'no-store','Vary':'User-Agent','X-Content-Type-Options':'nosniff'}});
 }
 if(url.pathname==='/privacy-policy')return Response.redirect(url.origin+'/privacy-policy/',301);
 const asset=assets[url.pathname];if(!asset)return new Response('Not found',{status:404});
 const headers={'Content-Type':asset[0],'X-Content-Type-Options':'nosniff','Cache-Control':url.pathname.startsWith('/assets/')?'public,max-age=31536000,immutable':'no-cache'};
 if(url.pathname==='/')headers['Vary']='User-Agent';
 const binary=atob(asset[1]);const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers});
}};`;
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',worker);
await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
await rm('dist/client',{recursive:true});
console.log('Worker generated with '+Object.keys(assets).length+' local resources.');
