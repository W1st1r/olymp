import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {render,titles} from './view.mjs';
const project=new URL('https://w1st1r.github.io/olymp/');
const config=JSON.parse(await readFile('config.json','utf8'));
const privacy=JSON.parse(await readFile('privacy.json','utf8'));
const routes=Object.keys(titles).filter(s=>s.startsWith('/'));
const publicPath=path=>project.href+path.slice(1)+(path==='/'?'':'/');
const prefix=project.pathname.slice(0,-1);
for(const route of [...routes,'404']){
  const page=route==='404'?'missing':route;
  let html=render(page,project.href.slice(0,-1),config,privacy)
    .replace(/(href|src|srcset)="\/(?!\/)/g,'$1="'+prefix+'/')
    .replace(/, \/media\//g,', '+prefix+'/media/')
    .replace('</head>','<meta name="referrer" content="no-referrer"><meta name="project-root" content="'+project.href+'"><meta name="monitor-source" content="https://api.mcstatus.io/v2/status/java/'+encodeURIComponent(config.javaFallback).replace('%3A',':')+'"></head>');
  for(const path of routes.filter(x=>x!=='/')){
    html=html.replaceAll('href="'+prefix+path+'"','href="'+prefix+path+'/"').replaceAll('"'+project.origin+prefix+path+'"','"'+publicPath(path)+'"');
  }
  const folder=route==='404'?'docs':'docs'+route;
  await mkdir(folder,{recursive:true});
  await writeFile(folder+'/'+(route==='404'?'404':'index')+'.html',html);
}
for(const asset of ['theme.css','interface.js'])await copyFile(asset,'docs/'+asset);
await writeFile('docs/.nojekyll','');
await writeFile('docs/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+publicPath(r)+'</loc></url>').join('')+'</urlset>');
await writeFile('docs/robots.txt','User-agent: *\nAllow: /\nSitemap: '+project.href+'sitemap.xml\n');
