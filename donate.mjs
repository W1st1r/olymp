import {readFileSync} from 'node:fs';
const catalogue=JSON.parse(readFileSync(new URL('./donate-catalogue.json',import.meta.url)));
const ranks=catalogue.ranks;
const pathFor=rank=>'/donate/'+rank.rank_id;
export const rankTitles=Object.fromEntries(ranks.map(rank=>[pathFor(rank),rank.russian_name+' · '+rank.display_name]));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function feature(f){
 return '<details class="ability" data-feature="'+esc(f.feature_id)+'"><summary><strong>'+esc(f.title)+'</strong> <code>/'+esc(f.feature_id)+'</code></summary><p>'+esc(f.description)+'</p><code>'+esc(f.syntax)+'</code><p>'+esc(f.how_to_use)+'</p><p>'+esc(f.limitations)+'</p><p>Пауза после применения · '+esc(f.cooldown_s)+' с</p><p>Java · '+esc(f.java)+'</p><p>Bedrock · '+esc(f.bedrock)+'</p>'+(f.presets.length?'<p>Варианты · '+f.presets.map(esc).join(', ')+'</p>':'')+(f.free_equivalent?'<p>Доступно всем через /menu → Сервисы.</p>':'')+'</details>';
}
function compare(){
 const options=ranks.map(r=>'<option value="'+esc(r.rank_id)+'">'+esc(r.display_name)+'</option>').join('');
 return '<details class="ability"><summary>Сравнить два ранга</summary><div id="rank-compare"><label>Первый ранг <select id="compare-a">'+options+'</select></label><label>Второй ранг <select id="compare-b">'+options+'</select></label><p role="status" id="compare-result"></p></div></details>';
}
function purchase(rank){
 const contact=catalogue.contact;
 return '<section class="donate-purchase"><h2>Оформление через владельца</h2><p>'+esc(catalogue.manual)+'</p><p>'+esc(catalogue.price)+'. '+esc(catalogue.term)+'.</p><p>Перед оплатой уточните доступность выбранного ранга.</p>'+
 (contact?'<a class="button gold" href="'+esc(contact)+'">Написать владельцу</a>':'<p>Контакт владельца уточняется</p>')+
 '<label for="request-text">Текст заявки</label><textarea id="request-text" readonly rows="5">'+esc(rank.request)+'</textarea><button class="button glass" type="button" id="copy-request">Скопировать заявку</button><p role="status" id="request-status"></p></section>';
}
export function donatePage(path){
 if(path==='/donate')return '<div class="page-head"><h1>Привилегии Олимпа</h1><p>'+esc(catalogue.manual)+'</p><p>Каталог готовится к запуску. Доступность ранга, стоимость и срок уточните у владельца.</p></div><p>'+esc(catalogue.price)+'. '+esc(catalogue.term)+'. Контакт владельца уточняется.</p>'+compare()+'<div class="rank-grid">'+ranks.map(r=>'<a class="rank-card" data-rank="'+esc(r.rank_id)+'" data-features="'+esc(r.features.map(f=>f.feature_id).join(','))+'" href="'+pathFor(r)+'" style="--rank-color:'+esc(r.color)+'"><img class="rank-icon" width="64" height="64" alt="" src="/media/donate/rank_'+esc(r.rank_id)+'.png"><small>'+esc(r.display_name)+'</small><h2>'+esc(r.russian_name)+'</h2><p>'+esc(r.short_description)+'</p><p>'+r.features.slice(0,3).map(f=>'/'+esc(f.feature_id)).join(' · ')+'</p><span>Подробнее →</span></a>').join('')+'</div><section class="donate-note"><h2>Бесплатные возможности</h2><p>'+esc(catalogue.free)+'</p><p>'+esc(catalogue.hud)+'</p></section>';
 const n=ranks.findIndex(r=>pathFor(r)===path),r=ranks[n];
 const prior=ranks.slice(0,n);
 return '<div class="page-head"><a class="inline" href="/donate">← Все привилегии</a><p class="eyebrow">'+esc(r.display_name)+'</p><h1>'+esc(r.russian_name)+'</h1><p>'+esc(r.lead)+'</p></div><div class="rank-body"><section><h2>Новые возможности</h2>'+r.features.map(feature).join('')+'</section><section><h2>Наследование</h2><p>'+esc(r.inherited_summary)+'</p>'+(prior.length?'<details class="ability"><summary>Все унаследованные возможности</summary>'+prior.map(p=>'<h3>'+esc(p.russian_name)+'</h3>'+p.features.map(feature).join('')).join('')+'</details>':'')+'</section><section><h2>Как пользоваться</h2><ol>'+r.how_to_use.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><details class="ability"><summary>Условия и ограничения</summary><ul>'+[...new Set([...r.limitations,...catalogue.limits])].map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></details></section>'+purchase(r)+'</div>';
}
