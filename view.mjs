import {rankTitles,donatePage} from './donate.mjs';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const symbols = {
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>', external:'<path d="M6 18 18 6M7 6h11v11"/>', telegram:'<path d="m3 11 18-7-3.5 16-5.8-4.2-3.1 2.8.5-5.2L18 7 7 12.3z"/>',
  play:'<path d="m8 5 11 7-11 7z"/>', monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>', cube:'<path d="m12 2 9 5v10l-9 5-9-5V7zm0 10 9-5M3 7l9 5v10"/>',
  chest:'<path d="M3 10V7l3-3h12l3 3v12H3v-9Zm0 0h18m-11 0v4h4v-4"/>', bars:'<path d="M4 18v-4m5 4V9m5 9V6m5 12V3"/>', copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>', book:'<path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zm9 2v15"/>', expand:'<path d="M14 3h7v7m-1-6-7 7M10 21H3v-7m1 6 7-7"/>'
};
const icon = key => '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+symbols[key]+'</svg>';
const links=[['/','Главная'],['/play','Как начать'],['/rules','Правила'],['/donate','Донат'],['/contacts','Контакты']];
const action=(href,text,style='',glyph='arrow')=>'<a class="button '+style+'" href="'+esc(href)+'">'+esc(text)+icon(glyph)+'</a>';
const k=t=>'<p class="eyebrow">'+esc(t)+'</p>';
const mark='<span class="wordmark"><img width="37" height="37" alt="" src="/media/olymp-icon.png">OLYMP</span>';
const linkList=(active)=>links.map(([href,t])=>'<a '+(href===active?'aria-current="page" ':'')+'href="'+href+'">'+t+'</a>').join('');
export const titles={...rankTitles,'/':'OLYMP — мир совместного выживания','/play':'Как начать играть','/rules':'Правила OLYMP','/donate':'Привилегии Олимпа','/contacts':'Контакты OLYMP','/privacy':'Конфиденциальность','404':'Страница не найдена'};
const locations = [
  {id:'mine-gate', title:'Вход в шахту', alt:'Каменные колонны и дорожка ко входу в шахту OLYMP'},
  {id:'sand-arena', title:'Песчаная арена', alt:'Песчаная площадка арены OLYMP с каменными трибунами'}
];

function archive(){
  const figures=locations.map(({id,title,alt},index)=>`
    <figure class="location" id="location-${id}">
      <button class="picture" type="button" data-art="${id}" data-kind="screen" aria-label="Увеличить кадр «${title}»">
        <img class="world-img" src="/media/${id}-1000.webp" srcset="/media/${id}-640.webp 640w, /media/${id}-1000.webp 1000w" sizes="(max-width: 740px) 100vw, 57vw" width="1000" height="603" ${index===0?'fetchpriority="high"':'loading="lazy"'} alt="${alt}">
        <span class="expand">${icon('expand')}</span>
      </button>
      <figcaption><strong>${title}</strong><small>Кадр с сервера</small></figcaption>
    </figure>`).join('');
  const controls=locations.map(({id,title},i)=>`<button type="button" data-location="${id}" aria-controls="location-${id}" aria-pressed="${i===0}">${title}</button>`).join('');
  return `<section class="field-archive" aria-label="Локации OLYMP"><div class="plate-heading"><span>Архив строительства</span><span aria-hidden="true" class="registration"></span></div>
    <div class="location-stack">${figures}</div><div class="location-controls" hidden aria-label="Выбрать кадр">${controls}</div></section>`;
}

function home(c){
  const faq=(question,answer)=>`<details><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`;
  const leaf = '<span class="laurel" aria-hidden="true">'+[0,1,2,3,4,5].map(i=>'<i style="--n:'+i+'"></i>').join('')+'</span>';
  const editionLink=(key,label,note)=>`<a class="portal-link" href="/play/#${key}">${icon(key==='java'?'monitor':'phone')}<span><b>${label}</b><small>${note}</small></span>${icon('arrow')}</a>`;
  return `<section class="skyline"><picture class="panorama"><source media="(max-width:640px)" srcset="/media/celestial-920.webp"><img src="/media/celestial-1920.webp" fetchpriority="high" alt="" width="1920" height="663"></picture>
    <div class="crest"><p class="edition-label">Minecraft · Java &amp; Bedrock</p><div class="insignia">${leaf}<h1>OLYMP</h1>${leaf}</div>
    <p class="motto">Твой мир у подножия Олимпа</p>
    <p class="herodesc">Совместное выживание на ПК, телефоне и iPad.<br>${esc(c.access)} · ${esc(c.accessDetail.toLowerCase())}.</p>
    <div class="heroactions">${action('/play','Как подключиться','gold','play')}${action('#world','О сервере','glass','cube')}</div></div>
  </section>
  <div class="atlas">
  <div class="gateway">
   <section class="realm-panel monitor-panel"><h2>${icon('bars')} Мониторинг сервера</h2><div class="numbers"><div><span class="online-count" data-count>—</span><span>игроков онлайн</span></div><div class="signal"><strong data-connection aria-live="polite">Получаем данные…</strong><small>Последний ответ · <time data-time>—</time></small><small data-date>—</small></div></div></section>
   <section class="realm-panel"><h2>${icon('play')} Подключение к игре</h2><div class="platforms">${editionLink('java','Java Edition','Компьютер')}${editionLink('bedrock','Bedrock Edition','Телефон, iPad, Windows')}</div></section>
  </div>
  <div class="chronicle"><a class="news-card realm-panel" href="https://t.me/olympmi/3/95"><img src="/media/november.webp" width="125" height="115" alt=""><div><small>Новости · 21 ноября</small><h2>Большое обновление OLYMP</h2><p>Сайт, «Лавровый двор» и планы команды</p></div>${icon('external')}</a>
  <a href="${esc(c.telegram)}" class="community realm-panel">${icon('telegram')}<div><small>Сообщество</small><h2>Наш Telegram</h2></div>${icon('external')}</a></div>
  <section class="world-section" id="world"><div><p class="eyebrow">Из игры</p><h2>Мир OLYMP</h2><p>Первый шаг — в «Лавровом дворе». Посмотри, как выглядят шахта и песчаная арена на сервере.</p></div>${archive()}</section>
  </div>
  <section class="handbook">
    <div class="questions"><h2>Перед входом</h2>
      ${faq('Как добавить OLYMP в Minecraft?','Выбери своё издание в <a href="/play">инструкции подключения</a>. Для Java понадобится адрес, для Bedrock — адрес и порт.')}
      ${faq('Как попасть в белый список?','Сейчас идёт закрытое тестирование. Напиши в <a href="'+esc(c.help)+'">тему помощи</a> и укажи своё издание Minecraft.')}
      ${faq('Где объявят об открытии?','Дату команда сообщит в <a href="'+esc(c.news)+'">новостях OLYMP</a>. Там же выходят заметки о разработке.')}
    </div>
    <aside class="purchase"><div class="purchase-symbol">${icon('chest')}</div><h2>Привилегии Олимпа</h2><p>Посмотри, что открывает каждый ранг и какие возможности доступны всем игрокам.</p><a class="inline" href="/donate">Открыть каталог →</a></aside>
  </section>`;
}
function play(c){
 const copy=(label,value)=>'<div class="copy"><div><small>'+label+'</small><code tabindex="0">'+esc(value)+'</code></div><button type="button" data-copy="'+esc(value)+'" aria-label="Скопировать '+label.toLowerCase()+'">'+icon('copy')+'</button></div>';
 const base=(id,label,subtitle,body,steps,version)=>'<article class="edition" id="'+id+'"><div class="edition-title">'+icon(id==='java'?'monitor':'phone')+'<h2>'+label+'</h2></div><p>'+subtitle+'</p>'+body+'<ol>'+steps.map(s=>'<li>'+s+'</li>').join('')+'</ol><p class="note">'+esc(version)+'</p></article>';
 return '<div class="page-head">'+'<h1>Подключение к OLYMP</h1><p>'+esc(c.access)+'. Для входа твой игровой аккаунт должен быть в белом списке. <a href="'+c.help+'">Уточнить доступ</a></p></div><nav class="ednav" aria-label="Выбор издания"><a href="#java">'+icon('monitor')+' Java Edition</a><a href="#bedrock">'+icon('phone')+' Bedrock Edition</a></nav><div class="editions">'+base('java','Java Edition','Для компьютера с Minecraft Java.',copy('Адрес сервера',c.javaAddress)+'<details class="backup"><summary>Адрес с портом</summary>'+copy('Резервный адрес',c.javaFallback)+'</details>',['Войди в Minecraft под своей учётной записью Microsoft.','Открой «Сетевая игра» → «Добавить сервер».','Введи OLYMP и адрес, сохрани и выбери «Подключиться».'],c.javaVersions)+base('bedrock','Bedrock Edition','Для iPhone, iPad, Android и Windows с Bedrock.',copy('Адрес сервера',c.bedrockHost)+copy('Порт',c.bedrockPort),['Открой «Играть» → «Серверы».','Нажми «Добавить сервер» и укажи имя OLYMP.','Вставь адрес и порт в отдельные поля. Сохрани и нажми «Играть».'],c.bedrockVersions)+'</div><p role="status" id="copy-status"></p>';
}
function contacts(c){
 const row=(url,label,note)=>'<a class="contact-row" href="'+esc(url)+'"><span><b>'+label+'</b><small>'+note+'</small></span>'+icon('external')+'</a>';
 return '<div class="page-head">'+'<h1>Связь с командой</h1><p>Все темы ниже находятся в официальной Telegram-группе Olymp | Mine.</p></div><div class="reading">'+row(c.telegram,'Сообщество OLYMP','Обсуждения и поиск тимейтов')+row(c.news,'Новости проекта','Объявления и дневник разработки')+row(c.help,'Помощь игрокам','Вход, белый список и вопросы команде')+row(c.bugs,'Сообщить об ошибке','Опиши, что произошло, и укажи издание Minecraft')+(c.contactEmail?row('mailto:'+c.contactEmail,'Написать проекту',esc(c.contactEmail)):'')+'</div>';
}
export function render(path,origin,c,privacy){
 const title=titles[path] || titles['404']; let content;
 if(path==='/')content=home(c);
 else if(path==='/play')content=play(c);
 else if(path==='/contacts')content=contacts(c);
 else if(path==='/privacy')content='<div class="page-head">'+k('Документы проекта')+'<h1>Конфиденциальность</h1><p>Редакция от 21 ноября 2026 года.</p></div><article class="reading policy"><p>'+esc(privacy.lead)+'</p>'+privacy.sections.map(s=>'<h2>'+esc(s.title)+'</h2><p>'+esc(s.text)+(s.url?' <a href="'+esc(s.url)+'">'+esc(s.linkText)+'</a>':'')+'</p>').join('')+'<h2>Ответственный за сайт</h2><p>'+esc(privacy.operatorNote)+'</p></article>';
 else if(path==='/donate' || Object.hasOwn(rankTitles,path))content=donatePage(path);
 else if(path==='/rules'){const rules=path==='/rules';content='<div class="coming"><div class="large-icon">'+icon(rules?'book':'chest')+'</div>'+k('В разработке')+'<h1>'+title+'</h1><p>'+(rules?'Мы готовим понятные правила проекта. После публикации они появятся на этой странице.':'Мы готовим раздел поддержки проекта. О запуске сообщим в нашем Telegram.')+'</p><div class="actions">'+action(c.telegram,'Наш Telegram','gold','telegram')+action('/','На главную','glass')+'</div></div>';}
 else content='<div class="coming">'+k('Ошибка 404')+'<h1>Страница не найдена</h1>'+action('/','На главную','gold')+'</div>';
 let desc=path==='/'?c.description:({'/play':'Адрес и инструкция входа для Java и Bedrock.','/contacts':'Новости и помощь в официальном сообществе OLYMP.','/rules':'Правила проекта находятся в разработке.','/donate':'Восемь рангов OLYMP, команды, наследование и ручное оформление через владельца.','/privacy':'Как работает сайт и какие данные получает инфраструктура.'}[path]||title);
 return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#170f26"><title>'+esc(title)+(path==='/'?'':' · OLYMP')+'</title><meta name="description" content="'+esc(desc)+'"><meta property="og:type" content="website"><meta property="og:locale" content="ru_RU"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:image" content="'+origin+'/media/olymp-social.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Золотой герб OLYMP над храмом"><meta name="twitter:card" content="summary_large_image">'+(titles[path]?'<link rel="canonical" href="'+origin+path+'"><meta property="og:url" content="'+origin+path+'">':'<meta name="robots" content="noindex">')+'<link rel="icon" href="/media/favicon.ico"><link rel="apple-touch-icon" href="/media/olymp-icon.png"><link rel="stylesheet" href="/theme.css"><script src="/interface.js" defer></script></head><body><a href="#main" class="skip">К содержанию</a><header><div class="bar"><a href="/" class="brand" aria-label="OLYMP — главная">'+mark+'</a><nav id="nav" aria-label="Главное меню">'+linkList(path)+'</nav><div class="header-actions">'+(path==='/'?'':action('/play','Начать играть','header-button','play'))+'<button type="button" id="menu" aria-label="Открыть меню" aria-expanded="false" aria-controls="nav"><span></span><span></span></button></div></div></header><main id="main" class="'+(path==='/'?'home':'inner')+'">'+content+'</main><footer><div class="foot-row"><a class="brand" href="/">'+mark+'</a><div><a href="/contacts">Контакты</a><a href="/privacy">Конфиденциальность</a></div></div><p>'+esc(privacy.minecraftNotice)+'</p></footer><dialog id="gallery"><button type="button" aria-label="Закрыть просмотр">Закрыть ×</button><img width="1672" height="941" alt=""><p></p></dialog></body></html>';
}
