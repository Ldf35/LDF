// LDF, the 3D guide of the website. When you reach a section it flies to its heading (on wide screens) or
// to the corner (on phones) and explains it; then it wanders around: walking along the bottom of the
// screen, waving, thinking, and flying up into the empty side space. Tap it to hear about the part you
// are on. The 3D files load only after the page is ready, and are skipped for visitors who save data,
// prefer less motion, or whose browser has no 3D.
(() => {
  'use strict';
  const APP = (window.LDF_CONFIG && window.LDF_CONFIG.appUrl) || 'https://ldf-platform.vercel.app/';

  // What LDF says for each section, by its heading. [words, move, colour]
  const SAY = {
    'Building stronger lives. Creating thriving communities.': ['Ayubowan! I’m LDF, the AI helper of Life Development Foundation. Scroll down and I’ll show you around.', 'wave', '#8b5cf6'],
    'Our idea': ['Our idea in four points. Every person has value, and help always comes with dignity.', 'love', '#a78bfa'],
    'Progress Begins with People.': ['Everything we do starts with people: support for families, learning, and taking part in the community.', 'talk', '#22c3dd'],
    'There is a place for you at LDF.': ['Join us! Be a Coach, a counsellor, a volunteer, a workshop host, a partner, or part of our team.', 'celebrate', '#ec4899'],
    'Nobody should have to choose between dinner and learning.': ['This is why we do it this way: there is always a free way to learn, everyone gives what they can, and the people who help are treated fairly.', 'love', '#a78bfa'],
    'Because someone once taught us too': ['Every Coach shares free courses, because we never want money to stop anyone from learning.', 'love', '#2fc3d4'],
    'Give what you can, find what you need.': ['LDF Market! Buy from local shops, or give things you no longer need. Our district team checks every free item.', 'celebrate', '#f59e0b'],
    'New in LDF Market': ['These items are live in the app right now. Tap one to see it.', 'point', '#f59e0b'],
    'Sell with LDF': ['Shops can join for free. LDF takes 10% of each sale, once a month.', 'handshake', '#f59e0b'],
    'Batches we are finishing together': ['Each batch needs the food from donors and the programme day from sponsors. Tap one to help finish it!', 'celebrate', '#8cae26'],
    'Who finishes a Hope batch?': ['Donors, sponsors, shops and volunteers. LDF is only the platform; you do the work together.', 'love', '#a78bfa'],
    'Far from home, still part of it.': ['Living abroad? You can still help your home village. Choose your currency to see what your gift does!', 'wave', '#2453d6'],
    'Help home from anywhere in the world': ['Welcome! Here is how Sri Lankans abroad help their home villages through LDF.', 'wave', '#2453d6'],
    'Partner with LDF': ['Companies can sponsor a programme day, free tutoring, Hope packages or courses. Every rupee is tracked openly in the app.', 'handshake', '#f59e0b'],
    'Sponsor a programme day': ['A day sponsor pays for the team who deliver: travel, meals and fair pay. Up to 3 sponsors can share one day.', 'handshake', '#f59e0b'],
    'Our supporters': ['These are the companies, shops and people who stand with LDF. Thank you!', 'celebrate', '#ec4899'],
    'Five Connected Areas of Development': ['We focus on five areas: child protection, families, careers, studies, and mental health.', 'point', '#f59e0b'],
    'What LDF has done, and what comes next.': ['Here are our real projects, shown honestly as completed, running or planned.', 'thumbs', '#84cc16'],
    'Workshops you can join, or host.': ['Join a workshop, or host your own! Every workshop keeps free places for people who cannot pay.', 'celebrate', '#22c3dd'],
    'Stuck with a problem? Find your way forward.': ['Stuck? Pathfinder explores many paths with you and shows the ones that fit. It is private, and a real counsellor is there if you need one.', 'think', '#2453d6'],
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
    'Coaches and tutoring': ['Coaches approved by LDF give one-to-one help online, safely.', 'handshake', '#8e3a9f'],
    'Stuck on something? Ask a Coach.': ['Every plan includes free tutoring time: 30 minutes, or 60 with Premium.', 'talk', '#8e3a9f'],
    'Meet our Coaches': ['Meet our Coaches. They give tutoring time and can run their own courses.', 'wave', '#8e3a9f'],
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
    if (!window.LDF3D) await script('js/ldf3d.js?v=2');
  })());

  // ---------- the guide ----------
  let bot = null, el = null, sayEl = null, cur = null, pos = null, pending = null;
  let mode = 'explain', modeUntil = 0, roam = null, moving = '';
  const W = () => (innerWidth >= 900 ? 120 : 88), H = () => Math.round(W() * 1.25);
  const now = () => performance.now();

  function sections() {
    return [...document.querySelectorAll('main section, main .page-hero, main .g-hero')].filter((s) => s.offsetParent !== null || s.getClientRects().length)
      .map((s) => { const h = s.querySelector('h1, h2'); return h && SAY[norm(h.textContent)] ? { s, h, say: SAY[norm(h.textContent)] } : null; }).filter(Boolean);
  }
  function active(list) {
    let a = list[0] || null;
    for (const x of list) if (x.s.getBoundingClientRect().top < innerHeight * 0.5) a = x;
    return a;
  }
  const bottomY = () => innerHeight - H() - 12;
  // where LDF goes to explain a section: beside its heading on wide screens, otherwise the corner
  function explainSpot(a) {
    const w = W(), corner = { x: innerWidth - w - 12, y: bottomY(), side: false };
    if (!a || innerWidth < 1100) return corner;
    const head = a.s.querySelector('.section-heading');
    if (!head) return corner;
    const hr = a.h.getBoundingClientRect(), br = head.getBoundingClientRect();
    if (hr.top < 90 || hr.top > innerHeight * 0.6) return corner;
    const x = Math.min(br.right + 24, innerWidth - Math.max(w, 232) - 12), bubble = sayEl.offsetHeight || 90;
    return { x, y: Math.max(80 + bubble, hr.top - H() * 0.42), side: true };
  }
  // somewhere to wander to: along the bottom of the screen, or up into the empty side space
  function nextRoam() {
    const w = W(), r = Math.random(), y = bottomY();
    const box = document.querySelector('main .container');
    const right = box ? box.getBoundingClientRect().right : innerWidth, gap = innerWidth - right;
    const acts = ['wave', 'idle', 'think', 'idle', 'thumbs'];
    const act = acts[Math.floor(Math.random() * acts.length)];
    if (r < 0.4) return { x: Math.random() < 0.5 ? 12 : innerWidth - w - 12, y, act, hold: 2200 + Math.random() * 2600 };
    if (r < 0.75) return { x: 12 + Math.random() * (innerWidth - w - 24), y, act, hold: 1800 + Math.random() * 2400 };
    if (gap > w + 24) return { x: right + (gap - w) / 2, y: 110 + Math.random() * Math.max(40, innerHeight - H() - 240), act: 'hover', hold: 3200 };
    return { x: innerWidth - w - 12, y: y - 70 - Math.random() * 110, act: 'hover', hold: 2600 };
  }
  function tell(a, here) {
    if (!a) return;
    const [text, move, colour] = a.say;
    sayEl.querySelector('span').textContent = text;
    sayEl.style.setProperty('--gc', colour);
    sayEl.hidden = el.classList.contains('min');
    pending = { move, colour };
    mode = here ? 'here' : 'explain'; modeUntil = now() + 7500; roam = null;
  }
  function frame() {
    if (!el) return;
    const t0 = now(), list = sections(), a = active(list);
    if (a && (!cur || a.s !== cur.s)) { cur = a; tell(a); } else if (a) cur = a;
    if (mode !== 'roam' && t0 > modeUntil) { mode = 'roam'; sayEl.hidden = true; roam = null; }
    let t;
    if (el.classList.contains('min')) t = { x: innerWidth - W() - 12, y: bottomY() };
    else if (mode === 'explain') t = explainSpot(cur);
    else if (mode === 'here') t = { x: pos.x, y: Math.min(pos.y, bottomY()), side: pos.x + 240 < innerWidth };
    else {
      if (!roam) roam = nextRoam();
      t = roam;
    }
    if (!pos) pos = { x: t.x, y: bottomY() + 40 };
    const dx = t.x - pos.x, dy = t.y - pos.y, d = Math.hypot(dx, dy);
    const walking = Math.abs(dy) < 10 && Math.abs(t.y - bottomY()) < 4;
    if (d > 3) {
      const step = Math.min(d, walking ? (innerWidth < 900 ? 1.3 : 1.8) : 6.5);
      pos.x += dx / d * step; pos.y += dy / d * step;
      const kind = walking ? 'walk' : 'fly';
      if (bot && d > 14 && moving !== kind) { moving = kind; bot.set({ act: kind }); }
      if (bot && moving) bot.set({ facing: dx < -1 ? -0.75 : dx > 1 ? 0.75 : 0 });
    } else if (moving) {
      moving = '';
      if (bot) bot.set({ act: mode === 'roam' && roam ? roam.act : 'idle', facing: 0.2 });
      if (mode === 'roam' && roam && !roam.until) roam.until = t0 + roam.hold;
    }
    if (mode === 'roam' && roam && roam.until && t0 > roam.until) roam = null;
    if (!moving && pending && bot) {
      bot.set({ act: pending.move, colour: pending.colour, facing: 0.2 }); const m = pending.move; pending = null;
      clearTimeout(frame.t); frame.t = setTimeout(() => { if (!moving && bot && mode !== 'roam') bot.set({ act: 'idle' }); }, m === 'love' || m === 'celebrate' ? 5000 : 3800);
    }
    el.classList.toggle('side', !!t.side);
    el.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px)`;
    requestAnimationFrame(frame);
  }
  async function mountGuide() {
    if (lite()) return;
    try { await load3d(); } catch (e) { return; }
    el = document.createElement('div'); el.className = 'ldfg'; el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<div class="ldfg-say" hidden><b>LDF</b><span></span><p class="ldfg-act"><a href="${APP}" target="_blank" rel="noopener noreferrer">Open the LDF app</a><button type="button" data-hide>Hide</button></p></div>
      <canvas aria-label="LDF, the AI guide. Tap to hear about this part of the page."></canvas><button type="button" class="ldfg-show" data-show hidden>LDF</button>`;
    document.body.appendChild(el);
    sayEl = el.querySelector('.ldfg-say');
    const cv = el.querySelector('canvas');
    try { bot = window.LDF3D.create(cv, { shadow: true }); bot.start(); } catch (e) { el.remove(); el = null; return; }
    const fit = () => { cv.style.width = W() + 'px'; cv.style.height = H() + 'px'; el.style.width = W() + 'px'; bot.size(W(), H()); };
    fit(); addEventListener('resize', fit);
    cv.addEventListener('click', () => { if (sayEl.hidden) { tell(cur, true); bot.set({ act: 'wave' }); } else window.open(APP, '_blank', 'noopener'); });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-hide]')) { el.classList.add('min'); sayEl.hidden = true; el.querySelector('[data-show]').hidden = false; store.set('ldf-guide', 'min'); }
      if (e.target.closest('[data-show]')) { el.classList.remove('min'); el.querySelector('[data-show]').hidden = true; store.set('ldf-guide', ''); tell(cur, true); bot.set({ act: 'wave' }); }
    });
    if (store.get('ldf-guide') === 'min') { el.classList.add('min'); el.querySelector('[data-show]').hidden = false; }
    document.addEventListener('visibilitychange', () => { if (document.hidden) bot.stop(); else { bot.stop(); bot.start(); } });
    requestAnimationFrame(frame);
  }

  const start = () => mountGuide();
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 1200);
})();
