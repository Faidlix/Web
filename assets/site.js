document.querySelectorAll('[data-year]').forEach((node)=>node.textContent=new Date().getFullYear());
const currentPage=location.pathname.split('/').pop()||'index.html';
const primaryNav=document.querySelector('.site-nav'),headerContact=document.querySelector('.header-contact');
if(primaryNav&&headerContact&&headerContact.parentElement!==primaryNav)primaryNav.append(headerContact);
const productionPages=['services.html','ux.html','play.html'],toolPages=['tools.html','plugins.html'];
if(currentPage!=='index.html'){
 const mainTarget=productionPages.includes(currentPage)?'services.html':toolPages.includes(currentPage)?'tools.html':'index.html';
 document.querySelectorAll('.site-nav a').forEach(link=>{if(new URL(link.href).pathname.split('/').pop()===mainTarget)link.setAttribute('aria-current','page')});
 const categories=document.querySelector('.category-nav'),showCategories=productionPages.includes(currentPage);
 if(categories){categories.classList.toggle('is-visible',showCategories);categories.setAttribute('aria-hidden',String(!showCategories));categories.inert=!showCategories}
 if(showCategories)document.querySelectorAll('.category-nav a').forEach(link=>{const url=new URL(link.href),page=url.pathname.split('/').pop(),serviceMatch=currentPage!=='services.html'||(location.hash?url.hash===location.hash:url.hash==='#three-d');if(page===currentPage&&serviceMatch)link.setAttribute('aria-current','page')});
}
if('serviceWorker'in navigator)window.addEventListener('load',async()=>{try{const registration=await navigator.serviceWorker.register('ServiceWorker.js?v=2.2',{updateViaCache:'none'});await registration.update()}catch(_){}});
const observer='IntersectionObserver'in window?new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12}):null;document.querySelectorAll('.reveal').forEach((item)=>observer?observer.observe(item):item.classList.add('is-visible'));
