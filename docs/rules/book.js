(()=>{
 const root=document.querySelector('.codex'),search=root.querySelector('#book-q'),status=root.querySelector('#book-result');
 const chapters=[...root.querySelectorAll('.book-chapter')], items=[...root.querySelectorAll('[data-number]')];
 const normalize=s=>s.toLocaleLowerCase('ru').replaceAll('ё','е');
 const groups=[['джайл','jail','тюрьм'],['кик','kick','отключение'],['xray','x-ray','иксрей']];
 const text=items.map(el=>normalize(el.textContent));
 let filter='';
 function update(){
  const value=normalize(search.value.trim()),exact=/^\d+\.\d+$/.test(value),words=groups.find(g=>g.some(w=>w===value||value.startsWith(w)))||[value];
  let visible=0;
  items.forEach((el,i)=>{const yes=(!filter||(el.dataset.types||'').split(' ').includes(filter))&&(!value||(exact?el.dataset.number===value:words.some(w=>text[i].includes(w))));el.hidden=!yes;if(yes)visible++;});
  for(const c of chapters)c.hidden=!!(value||filter)&&!c.querySelector('[data-number]:not([hidden])');
  root.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  status.textContent=value||filter?(visible?'Найдено: '+visible:'Совпадений нет. Измените запрос или фильтр.'):'';
 }
 function reveal(){const el=document.getElementById(location.hash.slice(1));if(!el||!root.contains(el))return;
  if(el.hidden||el.closest('[hidden]')){filter='';search.value='';update()}
  if(el.matches('details'))el.open=true;
  el.scrollIntoView({block:'start'});
 }
 root.querySelector('.book-find').hidden=false;
 if(matchMedia('(max-width:820px)').matches)root.querySelector('.book-toc').open=false;
 search.addEventListener('input',update);
 root.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;update()}));
 root.querySelectorAll('.book-links a[href^="#"],.book-toc a').forEach(a=>a.addEventListener('click',()=>{filter='';search.value='';update()}));
 window.addEventListener('hashchange',reveal);reveal();
})();
