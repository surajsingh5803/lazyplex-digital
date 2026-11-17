/* Progressive enhancement for the Lazy Plex Digital immersive homepage.
   No third-party scripts, no analytics identifiers, and no form-data capture. */
(() => {
  'use strict';
  const experience = document.getElementById('growth-experience');
  if (!experience) return;

  const stage = document.getElementById('growth-stage');
  const canvas = stage?.querySelector('.growth-stars');
  const perspective = stage?.querySelector('.growth-perspective');
  const motionButton = experience.querySelector('.motion-toggle');
  const focusIndex = document.getElementById('growth-index');
  const focusTitle = document.getElementById('growth-title');
  const focusDescription = document.getElementById('growth-description');
  const focusLink = document.getElementById('growth-link');
  const hotspots = Array.from(experience.querySelectorAll('.growth-hotspot'));
  if (!stage || !canvas || !perspective || !motionButton) return;

  const scenes = {
    seo: {index:'01 / 04', title:'Be found when intent is highest', description:'SEO that connects your business with people searching for answers.', href:'services/search-engine-optimisation/', label:'Explore SEO services'},
    ads: {index:'02 / 04', title:'Turn demand into conversations', description:'Google Ads built around relevant enquiries, not just clicks.', href:'services/google-ads-ppc/', label:'Explore Google Ads services'},
    social: {index:'03 / 04', title:'Build a brand people remember', description:'Creative, social storytelling and campaigns that earn attention.', href:'services/social-media-marketing/', label:'Explore social media marketing'},
    ai: {index:'04 / 04', title:'Connect the next growth system', description:'Practical automation that makes digital journeys easier to manage.', href:'services/ai-automation/', label:'Explore AI automation services'}
  };

  function selectScene(key) {
    const s = scenes[key];
    if (!s) return;
    hotspots.forEach(node => node.classList.toggle('is-active', node.dataset.focus === key));
    focusIndex.textContent = s.index;
    focusTitle.textContent = s.title;
    focusDescription.textContent = s.description;
    focusLink.href = s.href;
    focusLink.setAttribute('aria-label', s.label);
    stage.dataset.active = key;
  }

  hotspots.forEach(node => {
    const key = node.dataset.focus;
    node.addEventListener('pointerenter', () => selectScene(key));
    node.addEventListener('focus', () => selectScene(key));
    node.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:'lazyplex_3d_service_click',service:key,page_path:'/'});
    });
  });
  selectScene('seo');

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches || false;
  let userPaused = reducedMotion;
  let isVisible = true;
  let pointerX = 0;
  let pointerY = 0;
  let easedX = 0;
  let easedY = 0;
  let frameId = 0;
  let lastDraw = 0;
  let initialTime = 0;
  let width = 0;
  let height = 0;
  let ratio = 1;

  function canAnimate() {
    return !userPaused && isVisible && !document.hidden;
  }
  function syncMotionUI() {
    const running = canAnimate();
    stage.classList.toggle('is-paused', !running);
    motionButton.setAttribute('aria-pressed', String(!userPaused));
    motionButton.setAttribute('aria-label', userPaused ? 'Play 3D animation' : 'Pause 3D animation');
    motionButton.textContent = userPaused ? '▶ Play motion' : 'Ⅱ Pause motion';
    if (running) begin();
    else stop();
  }
  motionButton.addEventListener('click', () => {
    if (reducedMotion) return;
    userPaused = !userPaused;
    syncMotionUI();
    if (userPaused) draw(lastDraw, true);
  });
  if (reducedMotion) {
    motionButton.textContent = 'Reduced motion on';
    motionButton.disabled = true;
    motionButton.setAttribute('aria-pressed', 'false');
    motionButton.setAttribute('aria-label', 'Animation disabled by reduced-motion preference');
  }

  // Keyboard and touch use the same real, clickable links as desktop.
  if (!coarsePointer && !reducedMotion) {
    stage.addEventListener('pointermove', event => {
      const box = stage.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - .5) * 2));
      pointerY = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - .5) * 2));
    }, {passive:true});
    stage.addEventListener('pointerleave', () => {pointerX = 0; pointerY = 0;});
  }

  // A projected point cloud provides true XYZ depth without downloading a 3D library.
  const ctx = canvas.getContext('2d', {alpha:true});
  const pointCount = coarsePointer ? 80 : 138;
  const phi = Math.PI * (3 - Math.sqrt(5));
  const nodes = Array.from({length:pointCount}, (_, i) => {
    const y = 1 - 2 * (i + .5) / pointCount;
    const rad = Math.sqrt(1 - y * y);
    const angle = i * phi;
    return {x:Math.cos(angle) * rad, y, z:Math.sin(angle) * rad, size:i % 13 === 0 ? 1.65 : .85};
  });
  function resize() {
    const box = stage.getBoundingClientRect();
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(lastDraw, true);
  }
  function draw(time, staticFrame = false) {
    if (!ctx || !width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const a = staticFrame ? .48 : (time - initialTime) * .000115 + .48;
    const b = (staticFrame ? -.12 : -.12 + easedY * .14);
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const radius = Math.min(width * .37, height * .34, 190);
    const ox = width * .5, oy = height * .44;
    const projected = nodes.map(n => {
      const x = n.x * ca + n.z * sa;
      const z = -n.x * sa + n.z * ca;
      const y = n.y * cb - z * sb;
      const zz = n.y * sb + z * cb;
      const scale = 1 + zz * .2;
      return {x:ox + x * radius * scale, y:oy + y * radius * scale, z:zz, size:n.size};
    });
    // Thread a few nearby points together so the network has depth.
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const q = projected[(i + 13) % projected.length];
      const dx = p.x - q.x, dy = p.y - q.y;
      if (dx * dx + dy * dy > radius * radius * .17) continue;
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(q.x,q.y);
      ctx.strokeStyle = 'rgba(165,217,255,' + (.08 + .16 * (p.z + 1) / 2).toFixed(3) + ')';
      ctx.lineWidth = .65;
      ctx.stroke();
    }
    projected.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(.55, p.size * (.7 + .55 * (p.z + 1))), 0, Math.PI * 2);
      ctx.fillStyle = i % 5 === 0 ? 'rgba(205,255,140,' + (.25 + .5 * (p.z + 1) / 2).toFixed(3) + ')' : 'rgba(185,213,255,' + (.17 + .45 * (p.z + 1) / 2).toFixed(3) + ')';
      ctx.fill();
    });
  }

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }
  function begin() {
    if (!frameId && canAnimate()) frameId = requestAnimationFrame(tick);
  }
  function tick(time) {
    frameId = 0;
    if (!canAnimate()) return;
    if (!initialTime) initialTime = time;
    if (time - lastDraw >= 32) {
      lastDraw = time;
      easedX += (pointerX - easedX) * .06;
      easedY += (pointerY - easedY) * .06;
      perspective.style.transform = 'rotateX(' + (-easedY * 7).toFixed(2) + 'deg) rotateY(' + (easedX * 10).toFixed(2) + 'deg)';
      draw(time);
    }
    begin();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize, {passive:true});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting || false;
      syncMotionUI();
    }, {rootMargin:'100px'}).observe(stage);
  }
  document.addEventListener('visibilitychange', syncMotionUI);
  resize();
  syncMotionUI();

  // Intentional, optional scroll and card interactions; all content remains in the HTML.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const reveal = Array.from(document.querySelectorAll('.home-immersive .section-heading, .home-immersive .process-grid, .home-immersive .offer-layout, .home-immersive .cta-inner'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.08,rootMargin:'0px 0px 45px 0px'});
    reveal.forEach(el => {el.classList.add('reveal-ready'); observer.observe(el);});
  }

  if (!coarsePointer && !reducedMotion) {
    document.querySelectorAll('.home-immersive .service-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const box = card.getBoundingClientRect();
        const dx = (event.clientX - box.left) / box.width - .5;
        const dy = (event.clientY - box.top) / box.height - .5;
        card.style.setProperty('--tilt-x', (-dy * 5).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (dx * 6).toFixed(2) + 'deg');
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
      card.addEventListener('blur', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }
})();