import {readFileSync} from 'node:fs';
const entries=JSON.parse(readFileSync(new URL('./rules-book.json',import.meta.url),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stage=['Первый раз','Второй раз','Третий и далее'];
const chapters=entries.filter(x=>!x.number.includes('.'));
const ruleTypes={WARN:'Предупреждение',KICK:'Кик',MUTE:'Мут',JAIL:'Джайл',TEMPBAN:'Временный бан',BAN:'Бессрочный бан'};
function card(e){
 const title='<span class="num">'+e.number+'</span> '+esc(e.title);
 if(!e.tiers)return '<details class="book-item" id="'+e.id+'" data-number="'+e.number+'"><summary>'+title+'</summary><div class="copy">'+e.body+'</div></details>';
 return '<article class="rule-card" id="'+e.id+'" data-number="'+e.number+'" data-types="'+e.tiers.map(s=>s.type).join(' ')+'"><h3><a href="#'+e.id+'">'+title+'</a></h3><p>'+esc(e.lead)+'</p><dl class="tiers">'+e.tiers.map((s,i)=>'<div data-kind="'+s.type+'"><dt>'+stage[i]+'</dt><dd>'+esc(s.label)+'</dd></div>').join('')+'</dl><details><summary>Границы, доказательства и примеры</summary><div class="copy">'+e.body+'</div></details></article>';
}
function chapter(c){
 const items=entries.filter(e=>e.number.startsWith(c.number+'.')).map(card).join('');
 return '<section class="book-chapter" id="'+c.id+'"><h2>'+esc(c.title)+'</h2>'+(c.number==='8'?'<p class="book-note">Для обращения через общую тему «Помощь» достаточно номера дела. Закрытый контакт для заблокированных участников пока уточняется.</p>':'')+(c.number==='9'?'<p class="book-note">Раздел описывает механики проекта. Доступность проверяется отдельно. Войны и осады запланированы.</p>':'')+(c.body?'<details class="chapter-intro"><summary>Общие положения</summary><div class="copy">'+c.body+'</div></details>':'')+items+'</section>';
}
export function rulesPage(){
 const order=[2,3,4,5,6,7,1,8,9,10,11].map(n=>chapters.find(c=>Number(c.number)===n));
 return '<div class="codex"><div class="book-head"><p class="book-edition">Редакция 1.1</p><h1>Кодекс OLYMP</h1><p class="book-status">Опубликован для ознакомления. Дата вступления в силу пока не назначена.</p><div class="book-links"><a href="#rules">Правила и наказания ↓</a><a href="#appeals">Обжалование</a><a href="OLYMP-Codex-1.1.pdf">Скачать PDF ↗</a></div></div><div class="book-layout"><aside><details class="book-toc" open><summary>Оглавление</summary>'+order.map(c=>'<a href="#'+c.id+'">'+esc(c.title)+'</a>').join('')+'</details></aside><div class="book-main"><div class="book-find" hidden><label for="book-q">Поиск по кодексу</label><input id="book-q" type="search" placeholder="Номер пункта, нарушение или команда"><div class="book-filters" aria-label="Вид наказания">'+Object.entries({"":"Все",...ruleTypes}).map(([v,t],i)=>'<button type="button" data-filter="'+v+'" aria-pressed="'+(i===0)+'">'+t+'</button>').join('')+'</div><p role="status" id="book-result"></p></div>'+order.map(chapter).join('')+'<footer id="changelog">Редакция 1.1 · Уточнены условия кика, джайла и повторных нарушений.</footer></div></div></div>';
}
