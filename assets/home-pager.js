const homeSections=[...document.querySelectorAll('main > section')];
if(homeSections.length){
  document.documentElement.classList.add('home-pager-active');
  let active=Math.max(0,homeSections.findIndex((section)=>section.id&&location.hash===`#${section.id}`)),locked=false;
  const dots=document.createElement('nav');dots.className='home-page-dots';dots.setAttribute('aria-label','首頁段落');dots.innerHTML=homeSections.map((_,index)=>`<button type="button" aria-label="前往第 ${index+1} 頁" data-index="${index}"></button>`).join('');document.body.appendChild(dots);
  const paint=(direction=1)=>{homeSections.forEach((section,index)=>{section.classList.toggle('is-active',index===active);section.classList.toggle('is-before',index<active);section.classList.toggle('is-after',index>active);section.setAttribute('aria-hidden',String(index!==active))});dots.querySelectorAll('button').forEach((dot,index)=>dot.classList.toggle('is-active',index===active));document.body.dataset.direction=direction>0?'next':'previous'};
  const goTo=(next)=>{if(locked)return;const target=Math.max(0,Math.min(homeSections.length-1,next));if(target===active)return;locked=true;const direction=target>active?1:-1;active=target;paint(direction);const section=homeSections[active];history.replaceState(null,'',section.id?`#${section.id}`:location.pathname);setTimeout(()=>locked=false,620)};
  window.addEventListener('wheel',(event)=>{if(Math.abs(event.deltaY)<10)return;event.preventDefault();goTo(active+(event.deltaY>0?1:-1))},{passive:false});
  window.addEventListener('keydown',(event)=>{if(['ArrowDown','ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();goTo(active+1)}if(['ArrowUp','ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();goTo(active-1)}});
  let touchY=0;window.addEventListener('touchstart',(event)=>{touchY=event.changedTouches[0].clientY},{passive:true});window.addEventListener('touchend',(event)=>{const delta=touchY-event.changedTouches[0].clientY;if(Math.abs(delta)>45)goTo(active+(delta>0?1:-1))},{passive:true});
  dots.addEventListener('click',(event)=>{const button=event.target.closest('button');if(button)goTo(Number(button.dataset.index))});
  document.querySelectorAll('a[href^="#"]').forEach((link)=>link.addEventListener('click',(event)=>{const target=document.querySelector(link.getAttribute('href'));const index=homeSections.indexOf(target);if(index>=0){event.preventDefault();goTo(index)}}));
  paint();
}
