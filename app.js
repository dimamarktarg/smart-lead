// Load embedded players only when they approach the visible part of the page.
const videoObserver=new IntersectionObserver(entries=>{
 for(const {target,isIntersecting} of entries){
  if(!isIntersecting)continue;
  target.src=target.dataset.src;
  videoObserver.unobserve(target);
 }
},{rootMargin:'300px 0px'});
document.querySelectorAll('iframe[data-src]').forEach(frame=>videoObserver.observe(frame));
document.documentElement.classList.add('js');
// Keep the common country codes from the HTML lightweight. The complete list is
// downloaded and rendered only if a visitor actually opens the selector.
let countriesPromise;
async function populateCountries(select){
 if(select.dataset.populated||select.dataset.loading)return;
 select.dataset.loading='true';
 countriesPromise??=import('./countries.json').then(module=>module.default);
 const countries=await countriesPromise;
 const selectedValue=select.value||'+380',seen=new Set();
 select.replaceChildren();
 for(const item of countries){
  if(seen.has(item.country))continue;
  seen.add(item.country);
  const value=`+${item.code}`;
  select.add(new Option(`${item.name} ${value}`,value,false,value===selectedValue));
 }
 select.dataset.populated='true';delete select.dataset.loading;
}
document.querySelectorAll('select[name="country"]').forEach(select=>{
 select.addEventListener('pointerdown',()=>{void populateCountries(select)},{once:true});
 select.addEventListener('focus',()=>{void populateCountries(select)},{once:true});
});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealBlocks=document.querySelectorAll('.accordion-row,.benefit,.extras-grid article,.audience-grid article,.video');
revealBlocks.forEach((element,index)=>{element.classList.add('reveal-block');element.style.setProperty('--reveal-delay',`${(index%6)*70}ms`)});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.reveal,.reveal-text,.reveal-block').forEach(el=>observer.observe(el));

const copyright=document.querySelector('.company p:last-child');
if(copyright)copyright.textContent='© 2014-2026 Smart Lead';

// The carousel itself supports swipe and keyboard arrows. Keep the tiny dots as
// visual position indicators instead of undersized touch controls.
document.querySelectorAll('.carousel-dots button').forEach(button=>{
 const dot=document.createElement('span');
 dot.className='carousel-dot';dot.setAttribute('aria-hidden','true');
 dot.classList.toggle('active',button.getAttribute('aria-pressed')==='true');
 button.replaceWith(dot);
});

const heroNote=document.querySelector('.hero-note');
if(heroNote){
 const message=heroNote.textContent.trim();
 heroNote.replaceChildren();heroNote.classList.add('visible');
 const characterDelay=matchMedia('(max-width: 767px)').matches?55:68;
 let characterIndex=0;
 message.split(' ').forEach((word,wordIndex,words)=>{
  const wordElement=document.createElement('span');
  wordElement.className='hero-word';
  Array.from(word).forEach(character=>{
   const letter=document.createElement('span');
   letter.className='hero-char';
   letter.textContent=character;
   letter.style.setProperty('--char-delay',`${characterIndex++*characterDelay}ms`);
   wordElement.append(letter);
  });
  heroNote.append(wordElement);
  if(wordIndex<words.length-1)heroNote.append(document.createTextNode(' '));
 });
}

document.querySelectorAll('.accordion-toggle').forEach(button=>{
 button.addEventListener('click',()=>{
  const panel=document.getElementById(button.getAttribute('aria-controls'));
  const opening=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(opening));
  if(reducedMotion){panel.hidden=!opening;return}
  panel.style.height=opening?'0px':`${panel.scrollHeight}px`;
  panel.hidden=false;
  requestAnimationFrame(()=>requestAnimationFrame(()=>panel.style.height=opening?`${panel.scrollHeight}px`:'0px'));
  const finish=()=>{panel.hidden=!opening;panel.style.height='';panel.removeEventListener('transitionend',finish)};
  panel.addEventListener('transitionend',finish,{once:true});
 });
 button.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true')button.click()});
});

const contactDialog=document.querySelector('.contact-dialog');
document.querySelectorAll('[data-open-contact]').forEach(button=>button.addEventListener('click',()=>contactDialog.showModal()));
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
});

document.querySelectorAll('.carousel').forEach(carousel=>{
 const track=carousel.querySelector('.carousel-track'),slides=Array.from(track.children),dots=Array.from(carousel.querySelectorAll('.carousel-dot'));
 const clones=slides.slice(0,4).map(slide=>{const clone=slide.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('button,a').forEach(el=>el.tabIndex=-1);if(clone.tagName==='BUTTON')clone.tabIndex=-1;return clone});
 clones.forEach(clone=>track.append(clone));
 let index=0,timer,paused=false,startX=0;
 carousel.style.setProperty('--speed',`${carousel.dataset.speed}ms`);
 function go(next,animate=true){index=(next+slides.length)%slides.length;track.style.transition=animate?'':'none';const width=slides[0].getBoundingClientRect().width+1;track.style.transform=`translateX(-${index*width}px)`;dots.forEach((dot,i)=>dot.classList.toggle('active',i===index))}
 function advance(){if(paused||document.hidden||carousel.matches(':hover'))return;const width=slides[0].getBoundingClientRect().width+1;if(index===slides.length-1){track.style.transition='';track.style.transform=`translateX(-${slides.length*width}px)`;setTimeout(()=>go(0,false),Number(carousel.dataset.speed))}else go(index+1)}
 function stop(){clearInterval(timer)}
 function start(){stop();if(!reducedMotion)timer=setInterval(advance,Number(carousel.dataset.delay))}
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();paused=true;go(index+(event.key==='ArrowRight'?1:-1))}});
 carousel.addEventListener('touchstart',event=>{startX=event.touches[0].clientX;paused=true},{passive:true});
 carousel.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-startX;if(Math.abs(delta)>35)go(index+(delta<0?1:-1))},{passive:true});
 carousel.addEventListener('focusin',()=>paused=true);
 new ResizeObserver(()=>go(index,false)).observe(carousel);
 start();
});

const lightbox=document.querySelector('.lightbox');
const resultSources=Array.from(document.querySelectorAll('.results .slide:not([aria-hidden])')).map(slide=>slide.dataset.full);let resultIndex=0;
function showResult(index){resultIndex=(index+resultSources.length)%resultSources.length;lightbox.querySelector('img').src=resultSources[resultIndex]}
document.querySelector('.results').addEventListener('click',event=>{const button=event.target.closest('[data-lightbox]');if(button){showResult(resultSources.indexOf(button.dataset.full));lightbox.showModal()}});
lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>showResult(resultIndex-1));
lightbox.querySelector('.lightbox-next').addEventListener('click',()=>showResult(resultIndex+1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight')showResult(resultIndex+1);if(event.key==='ArrowLeft')showResult(resultIndex-1)});

const cookieBanner=document.querySelector('.cookie-banner');
try{cookieBanner.hidden=localStorage.getItem('smartlead-cookie-consent')==='accepted'}catch{}
document.querySelector('[data-cookie-accept]').addEventListener('click',()=>{cookieBanner.hidden=true;try{localStorage.setItem('smartlead-cookie-consent','accepted')}catch{}});

document.querySelectorAll('[data-contact-form]').forEach(form=>form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const status=form.querySelector('.form-status'),button=form.querySelector('button[type=submit]');
 status.hidden=false;status.textContent='Надсилаємо заявку…';button.disabled=true;
 try{
  const data=Object.fromEntries(new FormData(form));
  const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const result=await response.json();if(!response.ok||!result.success)throw new Error('submit');
  status.textContent='Дякуємо! Вашу заявку надіслано. Ми зв’яжемося з вами.';form.reset();
 }catch{status.replaceChildren(document.createTextNode('Не вдалося надіслати заявку. Зв’яжіться з нами: '));const link=document.createElement('a');link.href='https://t.me/smart_lead_01';link.textContent='Написати в Telegram';status.append(link)}finally{button.disabled=false}
}));
