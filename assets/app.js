/* ---------- MVX PRODUTORA · scripts ----------
   Adapted from the tono.filmes design system app.js:
   nav scroll state, reveal-on-scroll, smooth anchors, wave SVG generator.
   Extended with: playhead scroll-progress, button ripple, CTA particle field. */

(function(){
  const nav = document.getElementById('nav');
  const fab = document.getElementById('fab');
  const playbar = document.querySelector('.playhead .bar');

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (fab) fab.classList.toggle('show', y > 600);
    if (playbar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      playbar.style.width = pct + '%';
    }
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {rootMargin:'0px 0px -10% 0px', threshold:0.05});
  document.querySelectorAll('.reveal-up').forEach(el => io.observe(el));

  // smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 60, behavior:'smooth'});
        }
      }
    });
  });

  // button ripple
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ---------- animated wave SVG generator ---------- */
  function buildWave(targetSelector, opts) {
    const root = document.querySelector(targetSelector);
    if (!root) return;
    const lines = opts.lines || 38;
    const w = 1200, h = opts.height || 600;
    const amp = opts.amp || 22;
    const speed = opts.speed || 8;
    let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${opts.preserve || 'xMidYMid slice'}" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < lines; i++) {
      const t = i / (lines - 1);
      const baseY = (h * 0.18) + t * (h * 0.55);
      const phase = t * Math.PI * 1.6;
      let d = `M -50 ${baseY.toFixed(1)} `;
      const steps = 32;
      for (let s = 0; s <= steps; s++) {
        const x = -50 + (s / steps) * (w + 100);
        const wob1 = Math.sin(phase + s / steps * Math.PI * 2.2) * amp * (0.6 + t * 0.9);
        const wob2 = Math.cos(phase * 0.7 + s / steps * Math.PI * 1.4) * amp * 0.35;
        const y = baseY + wob1 + wob2 + t * 6;
        d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      const dur = (speed + (i % 5) * 1.8).toFixed(1);
      const delay = (-i * 0.18).toFixed(2);
      svg += `<path d="${d}" style="animation: waveShift ${dur}s ease-in-out ${delay}s infinite alternate"></path>`;
    }
    svg += `</svg>`;
    root.innerHTML = svg;
  }

  const kf = document.createElement('style');
  kf.textContent = `
    @keyframes waveShift {
      0%   { transform: translate3d(-2%, -1%, 0); opacity: .35; }
      50%  { opacity: .65; }
      100% { transform: translate3d(2%, 1.5%, 0); opacity: .35; }
    }
    .hero-wave svg path, .cta-wave svg path { transform-box: fill-box; transform-origin: center; }
  `;
  document.head.appendChild(kf);

  buildWave('.hero-wave', {lines: 42, height: 560, amp: 28, speed: 9});
  buildWave('.cta-wave', {lines: 36, height: 560, amp: 24, speed: 10});

  // CTA particle field
  const field = document.querySelector('.cta-particles');
  if (field) {
    const n = 26;
    let html = '';
    for (let i = 0; i < n; i++) {
      const left = (Math.random() * 100).toFixed(1);
      const dur = (10 + Math.random() * 14).toFixed(1);
      const delay = (-(Math.random() * 20)).toFixed(1);
      const dx = ((Math.random() - 0.5) * 80).toFixed(0);
      const size = (Math.random() < 0.3) ? 3 : 2;
      html += `<span style="left:${left}%;bottom:-4%;width:${size}px;height:${size}px;--dx:${dx}px;animation-duration:${dur}s;animation-delay:${delay}s;"></span>`;
    }
    field.innerHTML = html;
  }
})();
