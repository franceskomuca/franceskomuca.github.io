/* Small script to load assets/videos/index.json and render YouTube video cards.
   index.json should be an array of objects: { "id": "YouTubeID", "title": "Title" }
*/
(function(){
  const grid = document.getElementById('videoGrid');
  const lb = document.getElementById('videoLightbox');
  const player = document.getElementById('videoPlayer');
  const caption = document.getElementById('videoCaption');
  const closeBtn = lb.querySelector('.lb-close');
  const status = document.getElementById('videoStatus');
  function setStatus(msg){ if(status) status.textContent = msg; else { if(msg) console.info('videos status:', msg); } }
  let loadedList = null;

  async function loadIndex(){
    // Try inline JSON first (works with file://). If not present, fetch the index.json
    try{
      const inline = document.getElementById('videoIndex');
      if(inline){
        const list = JSON.parse(inline.textContent || inline.innerText || '[]');
  if(Array.isArray(list) && list.length>0){ loadedList = list; setStatus(''); render(list); return; }
      }
    }catch(e){ /* continue to fetch fallback */ }

    try{
      const res = await fetch('assets/videos/index.json', { cache: 'no-store' });
  if(!res.ok){ setStatus('No videos found. Add entries to assets/videos/index.json'); return; }
      const list = await res.json();
  if(!Array.isArray(list) || list.length === 0){ setStatus('No videos listed in index.json'); return; }
  setStatus('');
      loadedList = list;
      render(list);
      // prefill preview inputs with first item when available
      try{
        const previewIdEl = document.getElementById('previewId');
        const previewTitleEl = document.getElementById('previewTitle');
        if(loadedList && loadedList.length > 0 && previewIdEl){
          previewIdEl.value = loadedList[0].id || '';
          if(previewTitleEl) previewTitleEl.value = loadedList[0].title || '';
        }
      }catch(e){}
  }catch(e){ setStatus('Failed to load videos index'); console.warn('videos: failed to load index', e); }
  }

  function mkCard(item, i){
    const fig = document.createElement('figure');
    fig.className = 'photo-card';
    fig.dataset.index = i;
    fig.style.aspectRatio = '16/9';
    fig.style.cursor = 'pointer';
    const thumb = document.createElement('img');
    // Use YouTube thumbnail URL
    thumb.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    thumb.alt = item.title || item.id;
    thumb.loading = 'lazy';
    const cap = document.createElement('figcaption');
    cap.textContent = item.title || item.id;
    fig.appendChild(thumb);
    fig.appendChild(cap);
    fig.addEventListener('click', ()=> openVideo(item));
    return fig;
  }

  function render(list){
    grid.innerHTML = '';
    list.forEach((item,i)=> grid.appendChild(mkCard(item,i)));
  }

  function openVideo(item){
    // Prefer an explicit embed URL if provided (preserves extra query params like `si=`).
    // Otherwise build a standard embed URL from the id.
    const baseEmbed = item.embed ? item.embed : `https://www.youtube.com/embed/${item.id}`;
    // Ensure autoplay and common params are present; if the embed already includes query params, append with &
    const sep = baseEmbed.includes('?') ? '&' : '?';
    player.src = `${baseEmbed}${sep}autoplay=1&rel=0&modestbranding=1&controls=1`;
    caption.textContent = item.title || '';
    // ensure iframe background is black to avoid white bars
    player.style.background = '#000';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // open modal only (do not request browser fullscreen)
  }

  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden','true');
    player.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e)=>{ if(e.target===lb) close(); });
  document.addEventListener('keydown', (e)=>{ if(lb.getAttribute('aria-hidden')==='false'){ if(e.key==='Escape') close(); } });

  // Preview helpers
  const previewBtn = document.getElementById('previewBtn');
  const previewId = document.getElementById('previewId');
  const previewTitle = document.getElementById('previewTitle');
  if(previewBtn){
    previewBtn.addEventListener('click', ()=>{
      let id = (previewId.value || '').trim();
      let t = (previewTitle.value || '').trim();
      // fallback to first loaded video if preview id is empty
      if(!id && loadedList && loadedList.length>0){ id = loadedList[0].id; t = t || loadedList[0].title; }
  if(!id){ setStatus('Enter a YouTube video id to preview.'); return; }
  setStatus('');
      openVideo({id:id, title:t});
    });
  }

  loadIndex();
})();
