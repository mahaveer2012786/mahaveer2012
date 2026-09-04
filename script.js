const state = { category: 'All', query: '' };
const categories = ['All', ...[...new Set(PRODUCTS.map(p => p.category))]];
const grid = document.getElementById('productGrid');
const filters = document.getElementById('filters');
const quickFilters = document.getElementById('quickFilters');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('productModal');

function labelForCategory(cat){
  return cat === 'All' ? 'All products' : cat;
}
function makeButton(cat, small=false){
  const b = document.createElement('button');
  b.type='button'; b.textContent=labelForCategory(cat);
  b.addEventListener('click',()=>setCategory(cat));
  if(!small && cat===state.category)b.classList.add('active');
  return b;
}
function renderFilters(){
  filters.innerHTML=''; quickFilters.innerHTML='';
  categories.forEach(cat=>filters.appendChild(makeButton(cat)));
  categories.slice(1).forEach(cat=>quickFilters.appendChild(makeButton(cat,true)));
}
function setCategory(cat){ state.category=cat; renderFilters(); renderProducts(); document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'}); }
function getFiltered(){
  const q=state.query.trim().toLowerCase();
  return PRODUCTS.filter(p=>{
    const okCat=state.category==='All' || p.category===state.category;
    const okQ=!q || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return okCat && okQ;
  });
}
function renderProducts(){
  const items=getFiltered();
  grid.innerHTML='';
  emptyState.hidden=items.length!==0;
  items.forEach(p=>{
    const card=document.createElement('article'); card.className='product-card'; card.tabIndex=0;
    card.innerHTML=`<div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.code} - ${p.category}"></div><div class="product-info"><div class="product-code">${p.code}</div><div class="product-name">${p.category}</div><div class="product-desc">${p.description}</div></div>`;
    card.addEventListener('click',()=>openModal(p));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') {e.preventDefault();openModal(p)}});
    grid.appendChild(card);
  });
}
function openModal(p){
  document.getElementById('modalImg').src=p.image;
  document.getElementById('modalImg').alt=`${p.code} - ${p.category}`;
  document.getElementById('modalCategory').textContent=p.category;
  document.getElementById('modalTitle').textContent=p.code;
  document.getElementById('modalDesc').textContent=p.description;
  document.getElementById('modalCode').textContent=p.code;
  document.getElementById('modalEmail').href=`mailto:mahaveerenterprises@gmail.com?subject=Enquiry%20for%20${encodeURIComponent(p.code)}&body=Hello%20Mahaveer%20Enterprises%2C%0A%0AI%20would%20like%20to%20enquire%20about%20${encodeURIComponent(p.code)}.%0A%0AThank%20you.`;
  modal.hidden=false; document.body.style.overflow='hidden';
}
function closeModal(){modal.hidden=true; document.body.style.overflow='';}

document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !modal.hidden)closeModal();});
searchInput.addEventListener('input',()=>{state.query=searchInput.value;renderProducts();});
document.getElementById('clearBtn').addEventListener('click',()=>{state.category='All';state.query='';searchInput.value='';renderFilters();renderProducts();});
document.querySelector('[data-category-link="Chair Parts"]').addEventListener('click',()=>{state.category='Chair Parts';renderFilters();renderProducts();});

document.getElementById('menuBtn').addEventListener('click',()=>{
  const btn=document.getElementById('menuBtn'); const nav=document.getElementById('nav');
  const open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',open?'true':'false');
});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));

document.getElementById('year').textContent=new Date().getFullYear();

// Curate a small parts preview from the catalogue.
const parts=PRODUCTS.filter(p=>p.category==='Chair Parts').slice(0,6);
const collage=document.getElementById('partCollage');
parts.forEach(p=>{const img=document.createElement('img');img.src=p.image;img.alt=p.code;collage.appendChild(img);});

renderFilters();renderProducts();
