import { defineConfig } from 'vite';
import { contact } from './contact.js';

function inlineStyles(){
 return{name:'inline-styles',enforce:'post',transformIndexHtml(html){
  return html.replaceAll('2014-2025','2014-2026');
 },generateBundle(_options,bundle){
  const styles=Object.values(bundle).filter(item=>item.type==='asset'&&item.fileName.endsWith('.css'));
  if(!styles.length)return;
  for(const page of Object.values(bundle)){
   if(page.type!=='asset'||!page.fileName.endsWith('.html'))continue;
   let source=String(page.source);
   for(const style of styles){
    const escaped=style.fileName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    source=source.replace(new RegExp(`<link[^>]+href=["']/?${escaped}["'][^>]*>`),`<style>${style.source}</style>`);
   }
   page.source=source;
  }
  for(const style of styles)delete bundle[style.fileName];
 }};
}

export default defineConfig({
 server:{host:'0.0.0.0',allowedHosts:['terminal.local']},
 build:{outDir:'dist/client',emptyOutDir:true,rollupOptions:{input:{main:'index.html',privacy:'privacy-policy/index.html'}}},
 plugins:[inlineStyles(),{name:'contact-preview',configureServer(server){server.middlewares.use('/api/contact',async(req,res)=>{
  try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>4096){res.statusCode=413;res.end();return}chunks.push(chunk)}
   const request=new Request('http://'+req.headers.host+'/api/contact',{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
   const response=await contact(request,{});res.statusCode=response.status;response.headers.forEach((v,k)=>res.setHeader(k,v));res.end(await response.text());
  }catch{res.statusCode=500;res.end('{"success":false}')}
 })}}]
});
