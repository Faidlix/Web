const grid=document.querySelector('#plugin-grid'),count=document.querySelector('#plugin-count'),search=document.querySelector('#plugin-search');let plugins=[];
const esc=(value='')=>String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function historyImage(plugin,entry){
  if(!entry.uiImage)return '';
  return `<button class="history-shot" type="button" data-plugin="${esc(plugin.id)}" data-version="${esc(entry.version)}" aria-label="放大 ${esc(plugin.name)} v${esc(entry.version)} 實際介面截圖"><img src="${esc(entry.uiImage)}" alt="${esc(entry.uiAlt||`${plugin.name} v${entry.version} 實際介面`)}" loading="lazy"></button>`;
}

function render(query=''){
  const term=query.trim().toLowerCase(),visible=plugins.filter((plugin)=>JSON.stringify(plugin).toLowerCase().includes(term));
  count.textContent=`${visible.length} 個外掛 · 最後同步 ${plugins.syncedAt||'—'}`;
  grid.innerHTML=visible.map((plugin,index)=>{
    const history=[...plugin.history].sort((a,b)=>b.date.localeCompare(a.date)||b.version.localeCompare(a.version,undefined,{numeric:true}));
    return `<article class="plugin-card reveal is-visible"><div class="plugin-card-head"><span class="plugin-number">${String(index+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}</span><span class="plugin-icon">${esc(plugin.mark||'FX')}</span></div><div class="plugin-meta"><span class="version">v${esc(plugin.version)}</span><span class="compat">Blender ${esc(plugin.blender)}+</span></div><h2>${esc(plugin.name)}</h2><p class="plugin-summary">${esc(plugin.summary)}</p><ul class="feature-list">${plugin.features.map((feature)=>`<li>${esc(feature)}</li>`).join('')}</ul><div class="plugin-actions"><a class="button button-primary" href="${esc(plugin.download)}" download>下載最新版</a><a class="button button-ghost" href="${esc(plugin.repository)}" target="_blank" rel="noopener noreferrer">專案連結 ↗</a></div><details class="history"><summary>歷史版本與改動 <small>最新 → 最舊</small></summary><div class="timeline-scroll" tabindex="0" aria-label="${esc(plugin.name)} 歷史版本，可向下捲動到最舊版本"><ol class="timeline">${history.map((entry)=>`<li class="${entry.uiImage?'has-ui-image':'text-only'}">${historyImage(plugin,entry)}<div class="history-copy"><time datetime="${esc(entry.date)}">${esc(entry.date)}</time><b>v${esc(entry.version)}</b><p>${esc(entry.changes)}</p></div></li>`).join('')}</ol></div></details></article>`;
  }).join('')||'<p class="empty-state">找不到符合的外掛。</p>';
}

function openPreview(pluginId,version){
  const plugin=plugins.find((item)=>item.id===pluginId),entry=plugin?.history.find((item)=>item.version===version);if(!plugin||!entry?.uiImage)return;
  dialog.querySelector('.dialog-title').textContent=`${plugin.name} · v${entry.version}`;
  dialog.querySelector('.dialog-media').innerHTML=`<img src="${esc(entry.uiImage)}" alt="${esc(entry.uiAlt||`${plugin.name} v${entry.version} 實際介面`)}">`;
  dialog.showModal();
}

document.body.insertAdjacentHTML('beforeend','<dialog id="ui-preview-dialog" class="ui-preview-dialog"><div class="dialog-head"><strong class="dialog-title"></strong><button type="button" aria-label="關閉放大圖">×</button></div><div class="dialog-media"></div></dialog>');
const dialog=document.querySelector('#ui-preview-dialog');dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',(event)=>{if(event.target===dialog)dialog.close()});grid.addEventListener('click',(event)=>{const button=event.target.closest('.history-shot');if(button)openPreview(button.dataset.plugin,button.dataset.version)});
fetch('data/plugins.json',{cache:'no-cache'}).then((response)=>{if(!response.ok)throw new Error('資料讀取失敗');return response.json()}).then((data)=>{plugins=data.plugins||[];plugins.syncedAt=data.syncedAt;render()}).catch(()=>{count.textContent='暫時無法讀取版本資料';grid.innerHTML='<p class="empty-state">外掛資料載入失敗，請重新整理頁面。</p>'});search?.addEventListener('input',(event)=>render(event.target.value));
