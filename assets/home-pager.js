const homeSections=[...document.querySelectorAll('.home-page main > section')];
if(homeSections.length){
 document.documentElement.classList.add('home-pager-active');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),distance=110;
 let active=0,lastChange=-1000,touch=null,animating=false;
 const wrap=i=>(i%homeSections.length+homeSections.length)%homeSections.length;
 const fromHash=()=>homeSections.findIndex(s=>location.hash==='#'+s.id||(location.hash==='#home'&&s.id==='about'));
 const syncNavigation=index=>{
  const id=homeSections[index].id;
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(link=>{
   const current=link.hash==='#'+id;
   link.classList.toggle('is-active',current);
   if(current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  const categories=document.querySelector('.category-nav'),showCategories=id==='works';
  if(categories){categories.classList.toggle('is-visible',showCategories);categories.setAttribute('aria-hidden',String(!showCategories));categories.inert=!showCategories}
 };
 const place=(section,offset,animate=false)=>{
  section.style.transition=animate&&!reduced.matches?'transform .56s linear':'none';
  section.style.transform=`translate3d(${offset*distance}%,0,0)`;
 };
 const setState=index=>homeSections.forEach((section,i)=>{
  const isActive=i===index;
  section.classList.toggle('is-active',isActive);
  section.setAttribute('aria-hidden',String(!isActive));
  section.inert=!isActive;
  section.style.visibility=isActive?'visible':'hidden';
  section.style.zIndex=isActive?'2':'1';
  place(section,0);
 });
 const finish=(next,update,focusNext)=>{
  active=next;
  setState(active);
  syncNavigation(active);
  animating=false;
  if(focusNext){homeSections[active].tabIndex=-1;homeSections[active].focus({preventScroll:true})}
  if(update)history.replaceState(null,'','#'+homeSections[active].id);
 };
 const goTo=(requested,update=true,direction=0)=>{
  const next=wrap(requested);
  if(next===active){if(update)history.replaceState(null,'','#'+homeSections[active].id);return}
  if(animating)return;
  const forward=wrap(next-active),backward=wrap(active-next);
  const dir=direction||((forward<=backward)?1:-1);
  const current=active,focusNext=homeSections[current].contains(document.activeElement);
  animating=true;
  syncNavigation(next);
  homeSections[next].style.visibility='visible';
  homeSections[next].style.zIndex='2';
  homeSections[current].style.visibility='visible';
  homeSections[current].style.zIndex='2';
  place(homeSections[current],0);
  place(homeSections[next],dir);
  homeSections[next].getBoundingClientRect();
  if(reduced.matches){finish(next,update,focusNext);return}
  requestAnimationFrame(()=>{
   place(homeSections[current],-dir,true);
   place(homeSections[next],0,true);
  });
  setTimeout(()=>finish(next,update,focusNext),580);
 };
 const step=direction=>{
  if(animating||performance.now()-lastChange<620)return;
  lastChange=performance.now();
  goTo(active+direction,true,direction);
 };
 window.addEventListener('wheel',event=>{
  if(event.ctrlKey)return;
  event.preventDefault();
  const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
  if(Math.abs(delta)>=10)step(delta>0?1:-1);
 },{passive:false});
 window.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,select,[contenteditable]'))return;
  if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1)}
 });
 window.addEventListener('touchstart',event=>{const point=event.touches[0];touch={x:point.clientX,y:point.clientY}},{passive:true});
 window.addEventListener('touchend',event=>{
  if(!touch)return;
  const point=event.changedTouches[0],dx=touch.x-point.clientX,dy=touch.y-point.clientY;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))step(dx>0?1:-1);
  touch=null;
 },{passive:true});
 document.querySelectorAll('a[href^="#"],a[href^="index.html#"]').forEach(link=>link.addEventListener('click',event=>{
  const hash=new URL(link.href).hash,index=homeSections.findIndex(section=>'#'+section.id===hash);
  if(index>=0){event.preventDefault();goTo(index)}
 }));
 window.addEventListener('hashchange',()=>goTo(Math.max(0,fromHash()),false));
 active=Math.max(0,fromHash());
 setState(active);
 syncNavigation(active);
 history.replaceState(null,'','#'+homeSections[active].id);
}
