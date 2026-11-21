const one = selector => document.querySelector(selector);
const menu = one('#menu'), nav = one('#nav');
function closeMenu(focus=false) {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Открыть меню');
  if(focus) menu.focus();
}
menu.addEventListener('click',()=>{
  if(nav.classList.contains('open')) return closeMenu();
  nav.classList.add('open');
  menu.setAttribute('aria-expanded','true');
  menu.setAttribute('aria-label','Закрыть меню');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true)});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu()});
document.addEventListener('focusin',e=>{if(!e.target.closest('header'))closeMenu()});
matchMedia('(min-width:741px)').addEventListener('change',()=>closeMenu());
const gallery=one('#gallery'); let opener;
for(const button of document.querySelectorAll('[data-art]')){
  button.addEventListener('click',()=>{
    opener=button;
    const title=button.querySelector('img').alt;
    gallery.querySelector('img').src=new URL('media/',document.querySelector('meta[name=project-root]').content).href+button.dataset.art+(button.dataset.kind==='screen'?'-1000.webp':'-1600.webp');
    gallery.querySelector('img').alt=title;
    gallery.querySelector('p').textContent=title+' · '+(button.dataset.kind==='screen'?'Кадр с сервера':'Иллюстрация проекта OLYMP');
    gallery.showModal();
  });
}
gallery.querySelector('button').onclick=()=>gallery.close();
gallery.addEventListener('close',()=>opener?.focus());
gallery.addEventListener('click',e=>{if(e.target===gallery)gallery.close()});
let tipTimer;
for(const b of document.querySelectorAll('[data-copy]')) b.addEventListener('click',async()=>{
  const tip=one('#copy-status');
  try{await Promise.race([navigator.clipboard.writeText(b.dataset.copy),new Promise((_,reject)=>setTimeout(reject,1500))]);tip.textContent=b.dataset.copy.match(/^\d+$/)?'Порт скопирован':'Адрес скопирован';}
  catch{const el=b.parentElement.querySelector('code');el.focus();const range=document.createRange();range.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(range);tip.textContent='Значение выделено. Нажми «Скопировать» в меню устройства.'}
  clearTimeout(tipTimer);tipTimer=setTimeout(()=>tip.textContent='',6000);
});
if(one('[data-count]')){
  let timer,active=false,previous=null;
  const states={online:'Сервер отвечает',offline:'Сервер не ответил',stale:'Данные устарели',unavailable:'Источник временно недоступен'};
  async function refresh(){
    clearTimeout(timer);
    if(document.hidden||active)return;
    active=true;
    let data;
    try{
      const response=await fetch(document.querySelector('meta[name=monitor-source]').content,{
        credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)
      });
      if(!response.ok)throw Error();
      const row=await response.json();
      const age=Date.now()-row.retrieved_at;
      if(!Number.isSafeInteger(row.retrieved_at)||age < -30000||age>86400000||typeof row.online!=='boolean')throw Error();
      if(row.online&&(!Number.isSafeInteger(row.players?.online)||row.players.online<0))throw Error();
      data={state:age>120000?'stale':(row.online?'online':'offline'),online:row.online?row.players.online:null,
        lastSuccessAt:row.online?new Date(row.retrieved_at).toISOString():previous?.lastSuccessAt};
    }
    catch{
      data=previous&&Date.now()-Date.parse(previous.lastSuccessAt)<86400000?{...previous,state:'stale'}:{state:'unavailable'};
    }
    if(data.state==='online'||data.lastSuccessAt)previous=data;
    one('[data-count]').textContent=Number.isInteger(data.online)?String(data.online):'—';
    one('[data-connection]').textContent=states[data.state];
    const date=new Date(data.lastSuccessAt||NaN);
    one('[data-time]').textContent=Number.isFinite(+date)?date.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}):'—';
    one('[data-date]').textContent=Number.isFinite(+date)?date.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+' · местное время':'Нет успешной проверки';
    active=false;if(!document.hidden)timer=setTimeout(refresh,60000);
  }
  document.addEventListener('visibilitychange',()=>document.hidden?clearTimeout(timer):refresh());refresh();
}
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');obs.unobserve(e.target)}}));
 document.querySelectorAll('.section,.telegram-banner').forEach(el=>obs.observe(el));
}

const locationButtons = [...document.querySelectorAll('[data-location]')];
if(locationButtons.length){
  function selectLocation(selected){
    for(const button of locationButtons){
      const active=button===selected;
      button.setAttribute('aria-pressed',String(active));
      document.getElementById(button.getAttribute('aria-controls')).hidden=!active;
    }
  }
  selectLocation(locationButtons[0]);
  document.querySelector('.location-controls').hidden=false;
  for(const button of locationButtons){
    button.addEventListener('click',()=>selectLocation(button));
  }
}
