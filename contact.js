const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const formLabels={
  7:'Аудит рекламного кабінету',
  8:'Розробка рекламної стратегії',
  9:'Зворотний дзвінок менеджера',
  4:'Консультація (спливаюча форма)'
};
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
export async function contact(request,env,fetcher=fetch){
 if(request.method!=='POST')return json({success:false},405);
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return json({success:false},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({success:false},415);
 if(Number(request.headers.get('content-length')||0)>4096)return json({success:false},413);
 try{
  const text=await request.text();if(text.length>4096)return json({success:false},413);
  const data=JSON.parse(text);
  const id=Number(data.formId);if(!formLabels[id])return json({success:false},400);
  const name=typeof data.name==='string'?data.name.trim().slice(0,120):'';
  let phone=typeof data.phone==='string'?data.phone.replace(/[ ()-]/g,''):'';
  const country=typeof data.country==='string'?data.country:'';
  if(!/^\+\d{1,3}$/.test(country)||!/^\+?\d{7,15}$/.test(phone))return json({success:false},400);
  if(!phone.startsWith('+'))phone=country+phone.replace(/^0/,'');
  if(!/^\+\d{8,15}$/.test(phone))return json({success:false},400);
  if(!env?.TELEGRAM_BOT_TOKEN||!env?.TELEGRAM_CHAT_ID)throw new Error('Telegram is not configured');
  const message=[
   '<b>Новая заявка Smart Lead</b>',
   `<b>Форма:</b> ${escapeHtml(formLabels[id])}`,
   `<b>Имя:</b> ${escapeHtml(name||'Не указано')}`,
   `<b>Телефон:</b> <code>${escapeHtml(phone)}</code>`,
   `<b>Время:</b> ${escapeHtml(new Intl.DateTimeFormat('uk-UA',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Kyiv'}).format(new Date()))}`
  ].join('\n');
  const response=await fetcher(`https://api.telegram.org/bot${encodeURIComponent(env.TELEGRAM_BOT_TOKEN)}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:message,parse_mode:'HTML',disable_web_page_preview:true}),signal:AbortSignal.timeout(15000)});
  const result=await response.json();
  if(!response.ok||result.ok!==true)throw new Error('Telegram rejected');
  return json({success:true});
 }catch{return json({success:false},502)}
}
