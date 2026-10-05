const uxTimeline=document.querySelector('.ux-history .timeline');
const uxEsc=(value='')=>String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
fetch('data/ux-history.json',{cache:'no-cache'}).then((response)=>response.json()).then((data)=>{
  if(!uxTimeline)return;
  const entries=[...(data.entries||[])].sort((a,b)=>b.date.localeCompare(a.date)||b.version.localeCompare(a.version,undefined,{numeric:true}));
  uxTimeline.insertAdjacentHTML('afterbegin',entries.map((entry)=>{const images=entry.images||((entry.image&&[{src:entry.image,alt:entry.imageAlt}])||[]);const media=images.length?`<span class="ux-history-gallery">${images.map((image)=>`<a class="ux-history-shot" href="${uxEsc(image.src)}" target="_blank" rel="noopener noreferrer"><img src="${uxEsc(image.src)}" alt="${uxEsc(image.alt)}" loading="lazy"></a>`).join('')}</span>`:'';return `<li>${media}<div class="history-copy"><time datetime="${uxEsc(entry.date)}">${uxEsc(entry.date)}</time><b>v${uxEsc(entry.version)} · ${uxEsc(entry.title)}</b><p>${uxEsc(entry.summary)}</p></div></li>`}).join(''));
}).catch(()=>{});
