const homeSections=[...document.querySelectorAll('.home-page main > section')];
if(homeSections.length){
 document.documentElement.classList.add('home-pager-active');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,lastChange=-1000,touch=null;
 const fromHash=()=>homeSections.findIndex(s=>location.hash==='#'+s.id||(location.hash==='#home'&&s.id==='about'));
 const goTo=(next,update=true)=>{
  const focusInside=homeSections[active].contains(document.activeElement);
  active=Math.max(0,Math.min(homeSections.length-1,next));
  homeSections.forEach((s,i)=>{s.style.transform=`translateX(${(i-active)*110}%)`;s.classList.toggle('is-active',i===active);s.setAttribute('aria-hidden',String(i!==active));s.inert=i!==active});
  if(focusInside){homeSections[active].tabIndex=-1;homeSections[active].focus({preventScroll:true})}
  if(update)history.replaceState(null,'','#'+homeSections[active].id);
 };
 const step=d=>{if(performance.now()-lastChange<(reduced.matches?180:650))return;lastChange=performance.now();goTo(active+d)};
 window.addEventListener('wheel',e=>{
  if(e.ctrlKey)return;e.preventDefault();
  const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(Math.abs(d)>=10)step(d>0?1:-1);
 },{passive:false});
 window.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}
 });
 window.addEventListener('touchstart',e=>{const t=e.touches[0];touch={x:t.clientX,y:t.clientY}},{passive:true});
 window.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dx=touch.x-t.clientX,dy=touch.y-t.clientY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))step(dx>0?1:-1);touch=null},{passive:true});
 document.querySelectorAll('a[href^="#"],a[href^="index.html#"]').forEach(a=>a.addEventListener('click',e=>{const hash=new URL(a.href).hash,i=homeSections.findIndex(s=>'#'+s.id===hash);if(i>=0){e.preventDefault();goTo(i)}}));
 window.addEventListener('hashchange',()=>goTo(Math.max(0,fromHash()),false));
 goTo(Math.max(0,fromHash()),false);
}
