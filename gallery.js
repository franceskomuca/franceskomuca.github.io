/* Minimal gallery lightbox with keyboard and touch support
   - Click a .photo-card to open the lightbox with the large image (data-src)
   - Left/Right arrows and swipe change images; Esc closes
   - Lazy-load large images when opened
*/
(function(){
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const closeBtn = document.querySelector('.lb-close');
  const prevBtn = document.querySelector('.lb-prev');
  const nextBtn = document.querySelector('.lb-next');

  let photos = Array.from(document.querySelectorAll('.photo-card'));
  let current = 0;

  function openAt(i){
    current = i % photos.length;
    const card = photos[current];
    const img = card.querySelector('img');
    const src = img.getAttribute('data-src') || img.src;
    lbImage.src = '';
    lbImage.alt = img.alt || '';
    lbCaption.textContent = card.querySelector('figcaption')?.textContent || '';
    // determine orientation by probing the full image
    const probe = new Image();
    probe.onload = ()=>{
      // clear any previous orientation class
      lightbox.classList.remove('landscape','portrait');
      if(probe.naturalWidth >= probe.naturalHeight) lightbox.classList.add('landscape'); else lightbox.classList.add('portrait');
      // now set the visible image
      lbImage.src = probe.src;
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      lightbox.classList.add('open');
    };
    probe.onerror = ()=>{
      // fallback: show whatever we have
      lightbox.classList.remove('landscape','portrait');
      lbImage.src = src;
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      lightbox.classList.add('open');
    };
    probe.src = src;
  }

  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lbImage.src = '';
  }

  function showNext(){ openAt((current+1)%photos.length) }
  function showPrev(){ openAt((current-1+photos.length)%photos.length) }

  gallery?.addEventListener('click', (e)=>{
    const card = e.target.closest('.photo-card');
    if(!card) return;
    const idx = Number(card.dataset.index || 0);
    openAt(idx);
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  document.addEventListener('keydown', (e)=>{
    if(lightbox.getAttribute('aria-hidden') === 'true') return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') showNext();
    if(e.key === 'ArrowLeft') showPrev();
  });

  // Basic touch swipe
  let startX = 0, deltaX = 0;
  lightbox.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; deltaX = 0 });
  lightbox.addEventListener('touchmove', (e)=>{ deltaX = e.touches[0].clientX - startX });
  lightbox.addEventListener('touchend', ()=>{
    if(Math.abs(deltaX) < 30) return;
    if(deltaX < 0) showNext(); else showPrev();
  });

  // close if click outside image
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) close() });

  // ensure photos array updates if dynamic content added later
  const obs = new MutationObserver(()=>{ photos = Array.from(document.querySelectorAll('.photo-card')) });
  obs.observe(gallery, {childList:true,subtree:true});

})();

/* --- Auto-refresh: poll assets/photos/ directory and inject new images when added --- */
(function(){
  // Only run when gallery exists
  const galleryRoot = document.getElementById('gallery');
  if(!galleryRoot) return;

  const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
  let known = new Set(Array.from(document.querySelectorAll('.photo-card img')).map(i=>i.getAttribute('src')));

  function parseDirectoryIndex(html){
    // crude parser: find href="file" and return unique filenames
    const hrefRE = /href\s*=\s*"([^"]+)"/gi;
    const out = new Set();
    let m;
    while((m = hrefRE.exec(html))){
      try{
        const name = decodeURIComponent(m[1]);
        if(IMAGE_EXT.test(name) && !name.endsWith('/')) out.add(name);
      }catch(e){}
    }
    return Array.from(out);
  }

  function makeCardFor(filename, index){
    const fig = document.createElement('figure');
    fig.className = 'photo-card';
    fig.dataset.index = index;
    const img = document.createElement('img');
    img.setAttribute('data-src', 'assets/photos/' + filename);
    img.src = 'assets/photos/' + filename;
    img.alt = filename;
    img.loading = 'lazy';
    const cap = document.createElement('figcaption');
    cap.textContent = filename.replace(/[-_]/g,' ').replace(/\.(jpe?g|png|webp|gif)$/i,'');
    fig.appendChild(img);
    fig.appendChild(cap);
    return fig;
  }

  function updateIndexes(){
    const cards = Array.from(document.querySelectorAll('.photo-card'));
    cards.forEach((c,i)=> c.dataset.index = i);
    photos = cards; // update the outer array used by the lightbox
  }

  async function fetchAndInject(){
    try{
      const res = await fetch('assets/photos/');
      if(!res.ok) return;
      const text = await res.text();
      const files = parseDirectoryIndex(text);
      // files are relative names; keep only those not already known
      const toAdd = files.filter(f => !Array.from(known).some(k => k.endsWith('/' + f) || k.endsWith(f)));
      if(toAdd.length === 0) return;
      // append new cards
      toAdd.forEach(f => {
        const idx = document.querySelectorAll('.photo-card').length;
        const card = makeCardFor(f, idx);
        galleryRoot.appendChild(card);
        known.add('assets/photos/' + f);
      });
      // re-run any setup: update indexes and let mutation observer pick up
      updateIndexes();
    }catch(e){
      // silent fail — server might not expose directory listing
      // console.warn('auto-refresh failed', e);
    }
  }

  // initial populate known set (in case DOM changed)
  (function(){
    document.querySelectorAll('.photo-card img').forEach(i=> known.add(i.getAttribute('src')));
  })();

  // Poll every 5 seconds
  setInterval(fetchAndInject, 5000);
  // Also run once after a short delay to pick up files added right before open
  setTimeout(fetchAndInject, 1200);

})();
