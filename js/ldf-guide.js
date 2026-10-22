// LDF, the 3D guide of the website. It flies to each section heading (on wide screens) or waits in the
// corner (on phones) and explains what you are looking at. On the Home page it also runs the
// "Meet LDF and the AI team" village. The 3D files load only after the page is ready, and are skipped
// for visitors who save data, prefer less motion, or whose browser has no 3D.
(() => {
  'use strict';
  const APP = (window.LDF_CONFIG && window.LDF_CONFIG.appUrl) || 'https://ldf-platform.vercel.app/';

  // What LDF says for each section, by its heading. [words, move, colour]
  const SAY = {
    'Building stronger lives. Creating thriving communities.': ['Ayubowan! I’m LDF, the AI helper of Life Development Foundation. Scroll down and I’ll show you around.', 'wave', '#8b5cf6'],
    'Our idea': ['Our idea in four points. Every person has value, and help always comes with dignity.', 'love', '#a78bfa'],
    'Progress Begins with People.': ['Everything we do starts with people: support for families, learning, and taking part in the community.', 'talk', '#22c3dd'],
    'Five Connected Areas of Development': ['We focus on five areas: child protection, families, careers, studies, and mental health.', 'point', '#f59e0b'],
    'What LDF has done, and what comes next.': ['Here are our real projects, shown honestly as completed, running or planned.', 'thumbs', '#84cc16'],
    'Free online workshops you can join.': ['Community members run these workshops online, recorded for safety. Join one in the app.', 'talk', '#22c3dd'],
    'Meet LDF and the AI team': ['This is my team at work! I hand out jobs, and every draft waits for a person at LDF to say yes.', 'assign', '#8b5cf6'],
    'Everything LDF does, in one app.': ['Give, learn, find a tutor and join in, all in one app. Tap me any time to open it.', 'point', '#2453d6'],
    'Positive Change Is Something We Build Together.': ['Want to help? Share your skills or start a conversation with us. We’d love to hear from you.', 'handshake', '#f59e0b'],
    'Who we are': ['This is who we are: a community in Sri Lanka built on genuine humanity.', 'love', '#a78bfa'],
    'Every person has a genuine side.': ['We believe everyone has something good to give, whatever their religion, politics or past.', 'nod', '#a78bfa'],
    'Five areas of work': ['These are our five areas of work.', 'point', '#f59e0b'],
    'How we work': ['And these are the values behind everything we do.', 'thumbs', '#84cc16'],
    'See our projects and get involved': ['Ready to see our projects? Let’s go!', 'celebrate', '#84cc16'],
    'Our projects': ['Here are the programmes we have run, are running, and plan next.', 'wave', '#84cc16'],
    'Map of programmes and LDF Hope deliveries': ['The map shows towns only, never a family’s address. Purple pins are programmes, green pins are Hope deliveries.', 'point', '#84cc16'],
    'Programmes and activities': ['Every project, shown honestly with its real status.', 'thumbs', '#84cc16'],
    'Moments from our programmes': ['Group photos only, always with consent.', 'love', '#ec4899'],
    'Have an idea for a project?': ['Got an idea? Volunteers can suggest projects in the app.', 'think', '#f59e0b'],
    'Hope for Families': ['LDF Hope turns kindness into food packages, with dignity, proof and honest updates.', 'love', '#84cc16'],
    'From your gift to a family’s table': ['Families are chosen fairly, a local shop packs, volunteers deliver, and photos prove every step.', 'assign', '#84cc16'],
    'Map': ['These are the places Hope has reached. Towns only, never addresses.', 'point', '#84cc16'],
    'Support LDF as a whole': ['You can also give to LDF in general. It all helps.', 'thumbs', '#84cc16'],
    'Be part of the change': ['Give, volunteer, pack parcels, or bring your shop on board!', 'celebrate', '#84cc16'],
    'Learning Hub': ['Welcome to the Learning Hub! Skills for real life, with a certificate.', 'wave', '#22c3dd'],
    'Learn at your own pace': ['Learn when it suits you, with an AI Coach ready to help. Many courses are free.', 'thumbs', '#22c3dd'],
    'Three easy steps': ['Getting started takes three easy steps.', 'point', '#22c3dd'],
    'Knowledge creates opportunities': ['Open the app and begin your first lesson today!', 'celebrate', '#22c3dd'],
    'Volunteer tutors': ['Coaches approved by LDF give one-to-one help online, safely.', 'handshake', '#8e3a9f'],
    'Stuck on something? Ask a Coach.': ['Every plan includes free tutoring time: 30 minutes, or 60 with Premium.', 'talk', '#8e3a9f'],
    'Meet the volunteers': ['Meet our Coaches. They give their time to help learners.', 'wave', '#8e3a9f'],
    'Safety comes first': ['Safety comes first: sessions are recorded, and under-18s need a guardian.', 'nod', '#ef4444'],
    'The LDF app': ['This is our app: give, learn, get help and join in.', 'wave', '#2453d6'],
    'Add it to your home screen': ['Add the app to your phone’s home screen, just like a normal app.', 'point', '#2453d6'],
    'Every moment tells a story.': ['Moments from our programmes. Group photos only, always with consent.', 'love', '#ec4899'],
    'Let’s Start a Conversation': ['Got a question or an idea? We’d love to hear from you.', 'wave', '#8b5cf6'],
    "Let's Start a Conversation": ['Got a question or an idea? We’d love to hear from you.', 'wave', '#8b5cf6'],
    'Get in Touch': ['Pick the way that suits you best.', 'point', '#8b5cf6'],
    'Send an Enquiry': ['Send us a message here. Please don’t include private details.', 'talk', '#8b5cf6'],
  };
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

  const lite = () => {
    try {
      if (navigator.connection && navigator.connection.saveData) return true;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      const c = document.createElement('canvas');
      return !(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return true; }
  };
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } } };
  const script = (src) => new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
  let loading = null;
  const load3d = () => loading || (loading = (async () => {
    if (!window.THREE) await script('vendor/three.min.js');
    if (!window.LDF3D) await script('js/ldf3d.js');
    if (!window.LDFTeam && document.getElementById('ldf-vcv')) await script('js/team3d.js');
  })());

  // ---------- the guide ----------
  let bot = null, el = null, sayEl = null, cur = null, pos = null, flying = false, pending = null;
  const W = () => (innerWidth >= 900 ? 120 : 88), H = () => Math.round(W() * 1.25);

  function sections() {
    return [...document.querySelectorAll('main section, main .page-hero, main .g-hero')].filter((s) => s.offsetParent !== null || s.getClientRects().length)
      .map((s) => { const h = s.querySelector('h1, h2'); return h && SAY[norm(h.textContent)] ? { s, h, say: SAY[norm(h.textContent)] } : null; }).filter(Boolean);
  }
  function active(list) {
    let a = list[0] || null;
    for (const x of list) if (x.s.getBoundingClientRect().top < innerHeight * 0.5) a = x;
    return a;
  }
  function target(a) {
    const w = W(), h = H(), corner = { x: innerWidth - w - 12, y: innerHeight - h - 12, side: false };
    if (!a || innerWidth < 1100 || el.classList.contains('min')) return corner;
    const head = a.s.querySelector('.section-heading');
    if (!head) return corner;
    const hr = a.h.getBoundingClientRect(), br = head.getBoundingClientRect();
    if (hr.top < 90 || hr.top > innerHeight * 0.6) return corner;
    const x = Math.min(br.right + 24, innerWidth - Math.max(w, 232) - 12), bubble = sayEl.offsetHeight || 90;
    return { x, y: Math.max(80 + bubble, hr.top - h * 0.42), side: true };
  }
  function tell(a) {
    if (!a) return;
    const [text, move, colour] = a.say;
    sayEl.querySelector('span').textContent = text;
    sayEl.style.setProperty('--gc', colour);
    sayEl.hidden = el.classList.contains('min');
    pending = { move, colour };
  }
  function frame() {
    if (!el) return;
    const list = sections(), a = active(list);
    if (a && a !== cur) { cur = a; tell(a); }
    const t = target(cur);
    if (!pos) pos = { x: t.x, y: t.y };
    const dx = t.x - pos.x, dy = t.y - pos.y, d = Math.hypot(dx, dy);
    pos.x += dx * 0.09; pos.y += dy * 0.09;
    if (d > 60 && bot) { if (!flying) { flying = true; bot.set({ act: 'fly' }); } bot.set({ facing: dx < -5 ? -0.75 : dx > 5 ? 0.75 : 0 }); }
    else if (flying && d < 18) { flying = false; bot && bot.set({ act: 'idle', facing: 0.2 }); }
    if (!flying && pending && bot) { bot.set({ act: pending.move, colour: pending.colour, facing: 0.2 }); const m = pending.move; pending = null;
      clearTimeout(frame.t); frame.t = setTimeout(() => { if (!flying && bot) bot.set({ act: 'idle' }); }, m === 'love' || m === 'celebrate' ? 5000 : 3800); }
    el.classList.toggle('side', !!t.side);
    el.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px)`;
    requestAnimationFrame(frame);
  }
  async function mountGuide() {
    if (lite()) return;
    try { await load3d(); } catch (e) { return; }
    el = document.createElement('div'); el.className = 'ldfg'; el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<div class="ldfg-say" hidden><b>LDF</b><span></span><p class="ldfg-act"><a href="${APP}" target="_blank" rel="noopener noreferrer">Open the LDF app</a><button type="button" data-hide>Hide</button></p></div>
      <canvas aria-label="LDF, the AI guide. Tap to open the LDF app."></canvas><button type="button" class="ldfg-show" data-show hidden>LDF</button>`;
    document.body.appendChild(el);
    sayEl = el.querySelector('.ldfg-say');
    const cv = el.querySelector('canvas');
    try { bot = window.LDF3D.create(cv, { shadow: true }); bot.start(); } catch (e) { el.remove(); el = null; return; }
    const fit = () => { cv.style.width = W() + 'px'; cv.style.height = H() + 'px'; el.style.width = W() + 'px'; bot.size(W(), H()); };
    fit(); addEventListener('resize', fit);
    cv.addEventListener('click', () => { if (sayEl.hidden) { sayEl.hidden = false; bot.set({ act: 'wave' }); } else window.open(APP, '_blank', 'noopener'); });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-hide]')) { el.classList.add('min'); sayEl.hidden = true; el.querySelector('[data-show]').hidden = false; store.set('ldf-guide', 'min'); }
      if (e.target.closest('[data-show]')) { el.classList.remove('min'); sayEl.hidden = false; el.querySelector('[data-show]').hidden = true; store.set('ldf-guide', ''); bot.set({ act: 'wave' }); }
    });
    if (store.get('ldf-guide') === 'min') { el.classList.add('min'); el.querySelector('[data-show]').hidden = false; }
    document.addEventListener('visibilitychange', () => { if (document.hidden) bot.stop(); else { bot.stop(); bot.start(); } });
    bot.set({ act: 'popup' });
    requestAnimationFrame(frame);
  }

  // ---------- Home: the AI team village ----------
  function mountVillage() {
    const cv = document.getElementById('ldf-vcv');
    if (!cv) return;
    const box = cv.closest('.ldf-village');
    if (lite()) { box.classList.add('flat'); return; }
    let village = null;
    new IntersectionObserver((es) => es.forEach(async (e) => {
      if (e.isIntersecting) {
        if (!village) {
          try { await load3d(); village = window.LDFTeam(cv, document.getElementById('ldf-vlayer'), {
            onStatus: (id, text) => { const s = document.querySelector(`#ldf-live [data-ag="${id}"]`); if (s) s.textContent = text; } }); }
          catch (err) { box.classList.add('flat'); }
        } else village.play();
      } else if (village) village.pause();
    }), { rootMargin: '200px' }).observe(cv);
  }

  const start = () => { mountVillage(); mountGuide(); };
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 1200);
})();
