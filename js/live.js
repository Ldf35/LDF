// Live content from the LDF app: impact numbers, projects, map, contact details and the contact form.
// Everything here is public information; the app's database decides what visitors may read or send.
(() => {
  'use strict';
  const cfg = window.LDF_CONFIG || {};
  const API = cfg.api || {};
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safe = (u) => (/^https?:\/\/[^\s"'<>]+$/i.test(String(u || '')) ? u : '');

  async function rpc(fn, args = {}) {
    const r = await fetch(`${API.url}/rest/v1/rpc/${fn}`, {
      method: 'POST', headers: { apikey: API.key, 'Content-Type': 'application/json' }, body: JSON.stringify(args),
    });
    const text = await r.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!r.ok) throw new Error((data && data.message) || 'Request failed');
    return data;
  }

  const SOCIAL = {
    facebook: ['Facebook', 'M13 22v-8h3l.5-3.5H13V8.3c0-1 .3-1.8 1.8-1.8H17V3.3C16.6 3.2 15.5 3 14.2 3 11.5 3 9.5 4.6 9.5 7.8v2.7h-3V14h3v8z'],
    instagram: ['Instagram', 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.7-3.1a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z'],
    linkedin: ['LinkedIn', 'M4.5 9h3.7v11.5H4.5zM6.35 3.5a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3zM10.3 9h3.5v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6v6.2h-3.7v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6h-3.7z'],
    youtube: ['YouTube', 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z'],
    tiktok: ['TikTok', 'M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3a6.7 6.7 0 0 1-3.9-1.2v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.1a2.7 2.7 0 1 0 1.8 2.5V3z'],
    x: ['X', 'M17.8 3h3l-6.5 7.5L22 21h-6l-4.7-6.1L5.9 21h-3l7-8L2.4 3h6.1l4.2 5.6zm-1 16.2h1.7L7.6 4.7H5.8z'],
    whatsapp: ['WhatsApp', 'M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 1.9a8.1 8.1 0 1 1-4.3 15l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12 3.9zM8.7 7.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.6-.4z'],
    website: ['Website', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 1.8c.9 1 1.7 2.6 2.1 4.7H9.9c.4-2.1 1.200-3.700 2.100-4.700zM4.300 13h3.200c.1 1 .3 2 .6 2.900H5.200A8 8 0 0 1 4.300 13zm3.200-2H4.300a8 8 0 0 1 .9-2.900h2.900c-.3.900-.5 1.900-.6 2.900zm.1 4.800h8.800c-.5 1.800-1.500 3.300-2.400 4.300a8 8 0 0 1-4 0c-.9-1-1.900-2.500-2.400-4.300zM9.500 13c0-1 .1-2 .3-2.900h4.400c.2.900.3 1.900.3 2.900s-.1 2-.3 2.900H9.800c-.2-.9-.3-1.900-.3-2.900zm7 0h3.200a8 8 0 0 1-.9 2.900h-2.900c.3-.9.5-1.900.6-2.900zm0-2c-.1-1-.3-2-.6-2.900h2.900c.5.900.8 1.900.9 2.900z'],
  };
  const socials = (s) => Object.entries(s || {}).filter(([k, u]) => SOCIAL[k] && safe(u)).map(([k, u]) =>
    `<a class="soc ${k}" href="${esc(u)}" target="_blank" rel="noopener noreferrer" aria-label="${SOCIAL[k][0]}" title="${SOCIAL[k][0]}"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${SOCIAL[k][1]}"/></svg></a>`).join('');

  const KINDS = { leadership: 'Leadership programme', workshop: 'Workshop', awareness: 'Awareness', school: 'School programme', hope: 'LDF Hope', online: 'Online workshop', other: 'Project' };
  const STATUS = { past: 'Completed', ongoing: 'Running now', planned: 'Planned' };
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '');
  const photoUrl = (p) => (String(p).startsWith('img/') ? cfg.appUrl + p : `${API.url}/storage/v1/object/public/programmes/${String(p).split('/').map(encodeURIComponent).join('/')}`);
  const card = (p) => {
    const when = p.starts_on ? fmtDate(p.starts_on) + (p.ends_on && p.ends_on !== p.starts_on ? ' – ' + fmtDate(p.ends_on) : '') : '';
    return `<article class="card pj-card"><div class="pj-top"><span class="status ${esc(p.status)}">${STATUS[p.status] || ''}</span><span class="kind">${KINDS[p.kind] || 'Project'}</span></div>
      ${p.photos && p.photos.length ? `<div class="pj-photos">${p.photos.slice(0, 3).map((x) => `<img src="${esc(photoUrl(x))}" alt="${esc(p.title)}" loading="lazy">`).join('')}</div>` : ''}
      <h3>${esc(p.title)}</h3>
      ${p.org && p.org_id ? `<p class="small pj-by">With <a href="${esc(cfg.appUrl || 'https://ldf-platform.vercel.app/')}#/partner/${esc(p.org_id)}" target="_blank" rel="noopener noreferrer">${esc(p.org)}</a></p>` : ''}
      <p class="where">${esc([p.place, p.district && p.district !== p.place ? p.district : ''].filter(Boolean).join(', '))}${when ? ' · ' + esc(when) : ''}${p.participants ? ' · ' + Number(p.participants) + ' people' : ''}</p>
      ${p.about ? `<p>${esc(p.about)}</p>` : ''}
      ${p.audience ? `<p class="small"><b>For:</b> ${esc(p.audience)}</p>` : ''}
      ${p.themes && p.themes.length ? `<ul class="tags">${p.themes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${p.outcomes ? `<p class="small"><b>What changed:</b> ${esc(p.outcomes)}</p>` : ''}</article>`;
  };

  let leaflet = null;
  const loadLeaflet = () => window.L ? Promise.resolve() : (leaflet ||= new Promise((res, rej) => {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(css);
    const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  }));
  async function drawMap(el, progs, hope) {
    try {
      await loadLeaflet();
      const L = window.L, map = L.map(el, { scrollWheelZoom: false }).setView([7.8731, 80.7718], 7), pts = [];
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' }).addTo(map);
      const add = (lat, lng, color, title, sub) => {
        const m = L.circleMarker([lat, lng], { radius: 10, color: '#fff', weight: 2, fillColor: color, fillOpacity: .9 }).addTo(map);
        const b = document.createElement('div'); b.innerHTML = '<b></b><br><span></span>'; b.querySelector('b').textContent = title; b.querySelector('span').textContent = sub; m.bindPopup(b); pts.push([lat, lng]);
      };
      progs.filter((p) => p.lat != null && p.lng != null).forEach((p) => add(p.lat, p.lng, '#7b2a8e', p.title, [p.place, p.district].filter((v, i, a) => v && a.indexOf(v) === i).join(', ')));
      (hope.pins || []).forEach((p) => add(p.lat, p.lng, p.delivered ? '#8cae26' : '#2fc3d4', p.name, `${p.batches} Hope batch(es) · ${p.packages} packages`));
      if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 10 }); else if (pts.length === 1) map.setView(pts[0], 10);
    } catch { el.innerHTML = '<p class="muted pad">The map could not load. Please check your connection.</p>'; }
  }

  async function init() {
    // contact details + social icons (footer and anywhere marked)
    rpc('public_contact_info').then((i) => {
      const s = socials(i.social);
      document.querySelectorAll('#foot-socials, [data-socials]').forEach((el) => { el.innerHTML = s; });
      if (i.email) document.querySelectorAll('[data-email]').forEach((a) => { a.href = 'mailto:' + i.email; a.textContent = i.email; });
      document.querySelectorAll('[data-phone]').forEach((a) => { if (i.phone) { a.href = 'tel:' + String(i.phone).replace(/[^+\d]/g, ''); a.textContent = i.phone; a.hidden = false; } });
      document.querySelectorAll('[data-address]').forEach((a) => { if (i.address) { a.textContent = i.address; a.hidden = false; } });
      document.querySelectorAll('[data-whatsapp]').forEach((a) => { const w = i.social && safe(i.social.whatsapp); if (w) { a.href = w; a.hidden = false; } });
      document.querySelectorAll('[data-regno]').forEach((a) => { if (i.reg_no) { a.textContent = 'Registration: ' + i.reg_no; a.hidden = false; } });
    }).catch(() => {});

    // live impact numbers
    const stats = document.querySelectorAll('[data-live="stats"]');
    if (stats.length) {
      rpc('home_showcase').then((d) => {
        const i = (d && d.impact) || {};
        const rows = [['families_supported', 'Families supported'], ['packages_delivered', 'Food packages delivered'], ['batches_completed', 'Hope batches completed']];
        const any = rows.some(([k]) => Number(i[k]) > 0);
        stats.forEach((el) => {
          el.innerHTML = any ? rows.map(([k, l]) => `<div class="stat"><b>${Number(i[k] || 0).toLocaleString('en-GB')}</b><span>${l}</span></div>`).join('')
            : '<p class="muted">Verified delivery numbers appear here as soon as LDF Hope batches are completed and approved.</p>';
        });
      }).catch(() => stats.forEach((el) => { el.innerHTML = ''; }));
    }

    // We did this together: LDF-wide totals (the same numbers members see on their "My part" page)
    const togetherEls = document.querySelectorAll('[data-live="together"]');
    if (togetherEls.length) {
      rpc('ldf_together').then((d) => {
        const rows = [['members', 'People in the LDF family'], ['families', 'Families who got food'], ['certificates', 'Certificates earned'], ['hours', 'Volunteer hours'], ['free_items', 'Free items given']]
          .filter(([k]) => Number(d && d[k]) > 0);
        togetherEls.forEach((el) => {
          el.innerHTML = rows.map(([k, l]) => `<div class="stat"><b>${Number(d[k]).toLocaleString('en-GB')}</b><span>${l}</span></div>`).join('')
            + (rows.length < 3 ? '<p class="muted">We are just starting. The first village batch is on its way, and every number here will grow with each person who joins.</p>' : '');
        });
      }).catch(() => togetherEls.forEach((el) => { el.innerHTML = ''; }));
    }

    // LDF Star of the month (first name and one line; only members who agreed to be shown)
    document.querySelectorAll('[data-live="star"]').forEach((el) => {
      rpc('public_star').then((s) => {
        if (!s || !s.name) { el.hidden = true; return; }
        el.innerHTML = `<div class="star-month"><span class="star-i" aria-hidden="true">🌟</span><div><p class="eyebrow">LDF Star of the month</p><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p></div></div>`;
      }).catch(() => { el.hidden = true; });
    });

    // LDF Market: newest live items (sale and free); clicking opens the item in the app
    document.querySelectorAll('[data-live="market"]').forEach((el) => {
      rpc('market_browse', { p_kind: null, p_category: null, p_district: null, p_q: null, p_limit: Number(el.dataset.limit || 6), p_offset: 0 }).then((items) => {
        const app = cfg.appUrl || 'https://ldf-platform.vercel.app/';
        const pic = (p) => (p ? `${API.url}/storage/v1/object/public/market/${String(p).split('/').map(encodeURIComponent).join('/')}` : '');
        const price = (i) => (i.kind === 'free' ? '<b class="mk-free">Free</b>' : `<b>Rs ${Number(i.price).toLocaleString('en-GB')}</b>`);
        el.innerHTML = items.length ? items.map((i) => `<a class="card pj-card mk-site" href="${esc(app)}#/market/item/${esc(i.id)}" target="_blank" rel="noopener noreferrer">
          ${i.photo ? `<img src="${esc(pic(i.photo))}" alt="${esc(i.title)}" loading="lazy">` : ''}
          <div class="pj-top"><span class="status ${i.kind === 'free' ? '' : 'ongoing'}">${i.kind === 'free' ? 'Free item' : 'For sale'}</span><span class="kind">${esc(i.district || '')}</span></div>
          <h3>${esc(i.title)}</h3><p>${price(i)}</p>
          <p class="where">${i.kind === 'free' ? 'Given by an LDF member, checked by the district team' : esc(i.shop || '') + (i.certified ? ' ✔' : '')}</p></a>`).join('')
          : `<article class="card"><h3>The first shops are joining now</h3><p>Be one of the first to give a free item or bring your shop to LDF Market.</p><a class="button button-secondary" href="${esc(app)}#/market/give" target="_blank" rel="noopener noreferrer">Give a free item</a></article>
             <article class="card"><h3>Shops: sell with LDF</h3><p>Free to join. You deliver, the buyer pays you, and LDF takes 10% once a month.</p><a class="button button-secondary" href="market.html#sell">How it works</a></article>
             <article class="card"><h3>Checked by people you know</h3><p>Your district team checks every free item before it appears, so it is clean, safe and useful.</p><a class="button button-secondary" href="market.html">Learn more</a></article>`;
      }).catch(() => { el.innerHTML = ''; });
    });

    // Help from abroad: what a gift does, converted into the visitor's currency (an estimate from LDF's latest rates)
    const abroadEls = document.querySelectorAll('[data-live="abroad"]');
    if (abroadEls.length) {
      Promise.all([rpc('public_rates').catch(() => ({})), rpc('open_batches_public').catch(() => [])]).then(([rates, batches]) => {
        const SYM = { USD: '$', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$', AED: 'AED ', SAR: 'SAR ', SGD: 'S$', JPY: '¥' };
        const curs = Object.keys(rates).filter((c) => SYM[c]);
        if (!curs.length) { abroadEls.forEach((el) => { el.innerHTML = ''; }); return; }
        let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
        const guess = tz === 'Europe/London' ? 'GBP' : /^Australia\//.test(tz) ? 'AUD' : /^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Montreal)/.test(tz) ? 'CAD'
          : /^America/.test(tz) ? 'USD' : /^Europe\//.test(tz) ? 'EUR' : tz === 'Asia/Dubai' ? 'AED' : tz === 'Asia/Riyadh' ? 'SAR' : tz === 'Asia/Singapore' ? 'SGD' : tz === 'Asia/Tokyo' ? 'JPY' : 'USD';
        let saved = null; try { saved = localStorage.getItem('ldf.site.cur'); } catch (e) { /* private mode */ }
        let cur = curs.includes(saved) ? saved : curs.includes(guess) ? guess : curs[0];
        const pkg = batches[0] ? Number(batches[0].package_cost) : 6420, day = batches[0] ? Number(batches[0].day_goal || 25000) : 25000;
        const rs = (n) => 'Rs ' + Math.round(n).toLocaleString('en-GB');
        const conv = (n) => { const v = n / Number(rates[cur].lkr); return '≈ ' + SYM[cur] + (v >= 100 ? Math.round(v).toLocaleString('en-GB') : v.toLocaleString('en-GB', { maximumFractionDigits: v < 10 ? 2 : 0 })); };
        const draw = (el) => {
          const compact = el.dataset.compact === '1';
          const tile = (label, n) => `<article class="card center"><p class="where">${label}</p><h3 style="margin:4px 0">${conv(n)}</h3><p class="small muted">${rs(n)}</p></article>`;
          const asOf = rates[cur].as_of ? new Date(rates[cur].as_of).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          el.innerHTML = `<p class="center"><label class="small"><b>Show amounts in</b> <select data-abroad-cur style="width:auto;display:inline-block">${curs.map((c) => `<option ${c === cur ? 'selected' : ''}>${c}</option>`).join('')}</select></label></p>
            <div class="card-grid three">${tile('Food for one family', pkg)}${tile('One programme day', day)}${tile('A whole village (20 families)', pkg * 20 + day)}</div>
            ${!compact && batches.length ? `<div class="card-grid three" style="margin-top:16px">${batches.slice(0, 3).map((b) => {
              const nf = Math.max(0, Number(b.target) - Number(b.raised)), nd = Math.max(0, Number(b.day_goal || 0) - Number(b.day_sponsored || 0) - Number(b.day_pledged || 0));
              return `<article class="card"><p class="where">${esc([b.village, b.district].filter(Boolean).join(', '))}</p><h3>${esc(b.title || b.village)}</h3>
                <p class="small">${nf ? `Food still needs <b>${conv(nf)}</b>` : 'Food ✓'} · ${nd ? `Day still needs <b>${conv(nd)}</b>` : 'Programme day ✓'}</p>
                <a class="button button-secondary" href="${esc(cfg.appUrl || 'https://ldf-platform.vercel.app/')}#/give/${esc(b.batch_id)}" target="_blank" rel="noopener noreferrer">Help finish it</a></article>`; }).join('')}</div>` : ''}
            <p class="center small muted">Estimates using LDF’s rate from ${asOf}. Your bank decides the exact amount.</p>`;
          el.querySelector('[data-abroad-cur]').addEventListener('change', (ev) => { cur = ev.target.value; try { localStorage.setItem('ldf.site.cur', cur); } catch (e) { /* private mode */ } abroadEls.forEach(draw); });
        };
        abroadEls.forEach(draw);
      });
    }

    // LDF Hope: open batches with both goals (food from donors, programme day from sponsors)
    document.querySelectorAll('[data-live="hope-open"]').forEach((el) => {
      rpc('open_batches_public').then((rows) => {
        const app = cfg.appUrl || 'https://ldf-platform.vercel.app/';
        const rs = (n) => 'Rs ' + Math.round(Number(n || 0)).toLocaleString('en-GB');
        const bar = (a, b, col) => `<div style="height:10px;border-radius:99px;background:#eee6f2;overflow:hidden;margin:4px 0"><span style="display:block;height:100%;width:${b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0}%;background:${col}"></span></div>`;
        el.innerHTML = rows.length ? rows.slice(0, 6).map((b) => {
          const food = Number(b.raised) >= Number(b.target), day = Number(b.day_sponsored) >= Number(b.day_goal);
          const need = food && !day ? 'The food is funded. Now the programme day needs a sponsor.' : !food && day ? 'The day is covered. Now the food needs donors.' : 'Needs donors for the food and sponsors for the day.';
          return `<article class="card"><p class="where">${esc([b.village, b.district].filter(Boolean).join(', '))} · ${Number(b.packages)} families</p><h3>${esc(b.title || b.village)}</h3>
            <p class="small"><b>Food${food ? ' ✓' : ''}</b> · ${rs(b.raised)} of ${rs(b.target)}</p>${bar(Number(b.raised), Number(b.target), 'linear-gradient(90deg,#8cae26,#3d7a12)')}
            <p class="small"><b>Programme day${day ? ' ✓' : ''}</b> · ${rs(b.day_sponsored)} of ${rs(b.day_goal)}</p>${bar(Number(b.day_sponsored), Number(b.day_goal), 'linear-gradient(90deg,#f5b301,#ec4899)')}
            <p class="small" style="color:#b0246b;font-weight:600">${need}</p>
            <a class="button button-secondary" href="${esc(app)}#/give/${esc(b.batch_id)}" target="_blank" rel="noopener noreferrer">Help finish it</a></article>`;
        }).join('') : `<article class="card"><h3>The next batch is being prepared</h3><p>Our district teams are choosing the next village fairly. When it opens, donors and sponsors can finish it together.</p><a class="button button-secondary" href="${esc(app)}#/give" target="_blank" rel="noopener noreferrer">Open LDF Hope</a></article>
           <article class="card"><h3>Sponsor a programme day</h3><p>Companies can cover the day for the team who deliver. It is the most needed help right now.</p><a class="button button-secondary" href="hope.html#sponsor-a-day">How it works</a></article>
           <article class="card"><h3>Shops: become a Hope partner</h3><p>Pack food for families at a fair price and show the LDF Hope partner badge in LDF Market.</p><a class="button button-secondary" href="contact.html?topic=HOPE%20shop%20partner#contact-form">Talk to us</a></article>`;
      }).catch(() => { el.innerHTML = ''; });
    });

    // supporters: day sponsors (only those who agreed to be shown), partner companies and shops
    const sup = document.querySelectorAll('[data-live="supporters"]');
    if (sup.length) {
      Promise.all([rpc('supporters_wall').catch(() => null), rpc('home_showcase').catch(() => null)]).then(([w, sc]) => {
        const items = [];
        ((w && w.day_sponsors) || []).forEach((x) => items.push([x.name, `Sponsored ${Number(x.days)} programme day${Number(x.days) === 1 ? '' : 's'}`]));
        ((sc && sc.partners) || []).forEach((x) => items.push([x.name, 'Partner']));
        ((sc && sc.donor_orgs) || []).forEach((x) => items.push([x.name, 'Gave to LDF Hope']));
        ((w && w.workshop_orgs) || []).forEach((x) => items.push([x.name, 'Sponsors workshop places']));
        ((sc && sc.shops) || []).forEach((x) => items.push([x.name, x.certified ? 'LDF Certified Shop' : 'Partner shop']));
        const seen = new Map();
        items.forEach(([n, what]) => { const k = String(n || '').trim().toLowerCase(); if (!k) return; const o = seen.get(k) || { n, w: [] }; if (!o.w.includes(what)) o.w.push(what); seen.set(k, o); });
        const list = [...seen.values()].slice(0, 24);
        const tot = (w && w.day_totals) || {};
        sup.forEach((el) => {
          el.innerHTML = list.length
            ? `${Number(tot.days) > 0 ? `<p class="center small">${Number(tot.days)} programme day${Number(tot.days) === 1 ? '' : 's'} sponsored so far, reaching ${Number(tot.families).toLocaleString('en-GB')} families.</p>` : ''}<div class="card-grid three">${list.map((o) => `<article class="card"><h3>${esc(o.n)}</h3><ul class="tags">${o.w.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</div>`
            : '<p class="muted center">Our first sponsors and partners will be thanked here. Could it be you?</p>';
        });
      });
    }

    // coaches
    document.querySelectorAll('[data-live="coaches"]').forEach((el) => {
      rpc('public_coaches').then((cs) => {
        el.innerHTML = cs.length ? cs.map((c) => `<article class="card"><h3>${esc(c.name)}</h3><p class="where">${esc(c.headline || 'Volunteer Coach')}</p>${c.bio ? `<p>${esc(c.bio)}</p>` : ''}<p class="small">${Number(c.sessions || 0)} sessions given</p></article>`).join('')
          : '<p class="muted">Our Coaches will appear here as they are approved. Want to help? <a href="https://ldf-platform.vercel.app/#/join">Apply to be a Coach</a>.</p>';
      }).catch(() => { el.innerHTML = ''; });
    });

    // community workshops (free, run by members; join in the app)
    const wk = document.querySelectorAll('[data-live="workshops"]');
    if (wk.length) {
      const rows = await rpc('community_workshops').catch(() => []);
      const fmt = (v) => new Date(v).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      wk.forEach((el) => {
        const sec = el.closest('[data-wk-section]');
        const list = rows.slice(0, Number(el.dataset.limit || 6));
        if (!list.length) {                                   // nothing scheduled yet: invite people in
          const app = esc(cfg.appUrl || 'https://ldf-platform.vercel.app/');
          el.innerHTML = [
            ['New workshops are coming', 'Life skills, careers, study skills and wellbeing. Open the app to see them first.', 'workshops', 'See workshops'],
            ['Share what you know', 'Teachers, professionals and partners can host a workshop. LDF checks every host.', 'workshops/host', 'Host a workshop'],
            ['Ask for a topic', 'Tell us what your village, school or group wants to learn and we will try to arrange it.', '', 'Suggest a topic'],
          ].map(([h, p, path, btn]) => `<article class="card"><h3>${h}</h3><p>${p}</p><a class="button button-secondary" href="${path ? app + '#/' + path : 'contact.html?topic=Learning%20Hub#contact-form'}"${path ? ' target="_blank" rel="noopener noreferrer"' : ''}>${btn}</a></article>`).join('');
          if (sec) sec.hidden = false; return; }
        el.innerHTML = list.map((w) => `<article class="card pj-card"><div class="pj-top"><span class="status ongoing">${w.tier === 'premium' ? 'Premium' : (w.tier === 'pwyc' ? 'Pay what you can' : 'Free')}</span><span class="kind">${esc(w.language)}</span></div>
          <h3>${esc(w.title)}</h3><p class="muted">${esc(fmt(w.starts_at))} · ${Number(w.duration_min)} min · hosted by ${esc(w.host_name)}</p>
          <p>${esc(String(w.about).slice(0, 160))}${String(w.about).length > 160 ? '…' : ''}</p>
          <a class="button button-secondary" href="${esc((cfg.appUrl || '') + '#/workshops')}" target="_blank" rel="noopener noreferrer">Join in the app</a></article>`).join('');
        if (sec) sec.hidden = false;
      });
    }

    // stories: programmes that happened + members' published life stories (adults only), with topic filters
    const stEl = document.querySelector('[data-live="stories"]');
    if (stEl) {
      const app = cfg.appUrl || 'https://ldf-platform.vercel.app/';
      const [progs, lives] = await Promise.all([
        rpc('public_programmes').catch(() => []),
        rpc('stories_list', { p_topic: null, p_limit: 40, p_before: null }).catch(() => []),
      ]);
      const TOPIC = { motivation: 'Motivation', problems: 'Hard times', study: 'Study', work: 'Work', family: 'Family', health: 'Health', money: 'Money', other: 'Life' };
      const items = [
        ...(progs || []).filter((p) => p.status === 'past' || p.status === 'ongoing').map((p) => ({
          tags: ['Our programmes', ...(p.themes || [])], label: KINDS[p.kind] || 'Programme', status: p.status,
          title: p.title, where: [p.place, p.district && p.district !== p.place ? p.district : ''].filter(Boolean).join(', '),
          text: p.about || '', who: p.audience ? 'For: ' + p.audience : '', href: 'projects.html', ext: false, more: 'See the project' })),
        ...(lives || []).map((s) => ({
          tags: ["Members' stories", TOPIC[s.topic] || 'Life'], label: 'Life story', status: 'story',
          title: s.title, where: s.author ? 'Shared by ' + s.author : 'Shared by an LDF member', text: s.excerpt || '',
          who: s.minutes ? s.minutes + ' min read' : '', href: app + '#/story/' + s.id, ext: true, more: 'Read the full story' })),
      ];
      if (!items.length) { stEl.innerHTML = '<p class="muted">Stories will appear here soon.</p>'; }
      else {
        const draw = (tag) => {
          stEl.innerHTML = items.filter((i) => tag === 'All' || i.tags.includes(tag)).map((i) => `<article class="card st-card">
            <div class="pj-top"><span class="status ${i.status === 'story' ? 'story' : esc(i.status)}">${i.status === 'story' ? 'Life story' : (STATUS[i.status] || '')}</span><span class="kind">${esc(i.label)}</span></div>
            <h3>${esc(i.title)}</h3>${i.where ? `<p class="where">${esc(i.where)}</p>` : ''}
            <p>${esc(i.text.slice(0, 280))}${i.text.length > 280 ? '…' : ''}</p>${i.who ? `<p class="small muted">${esc(i.who)}</p>` : ''}
            <a class="text-link" href="${esc(i.href)}"${i.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${i.more} →</a></article>`).join('');
        };
        // a few clear topics instead of every small theme
        const GROUP = {
          'Learning': ['education', 'life skills', 'study', 'personal development', 'work', 'leadership'],
          'Health and drug prevention': ['drug prevention', 'drug awareness', 'awareness', 'wellbeing', 'health', 'mental health'],
          'Family': ['family', 'communication', 'teamwork', 'parents'],
          'Strength and attitude': ['resilience', 'motivation', 'hard times', 'positive attitudes', 'attitudes', 'responsible choices', 'life'],
        };
        items.forEach((i) => { const low = i.tags.map((t) => t.toLowerCase());
          Object.entries(GROUP).forEach(([g, words]) => { if (words.some((w) => low.includes(w))) i.tags.push(g); }); });
        const count = {};
        items.forEach((i) => [...new Set(i.tags)].forEach((t) => { count[t] = (count[t] || 0) + 1; }));
        const tags = ['All', "Our programmes", "Members' stories", ...Object.keys(GROUP)].filter((t) => t === 'All' || count[t]);
        const bar = document.getElementById('st-filters');
        if (bar) {
          bar.innerHTML = tags.map((t, n) => `<button type="button" class="${n ? '' : 'on'}" aria-pressed="${n ? 'false' : 'true'}" data-t="${esc(t)}">${esc(t)}${t === 'All' ? ` (${items.length})` : ` (${count[t]})`}</button>`).join('');
          bar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return;
            bar.querySelectorAll('button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
            draw(b.dataset.t); });
        }
        draw('All');
      }
    }

    // partner organisations (each has a public page in the app)
    const partnerEls = document.querySelectorAll('[data-live="partners"]');
    if (partnerEls.length) {
      rpc('public_partner_list').then((rows) => {
        const app = cfg.appUrl || 'https://ldf-platform.vercel.app/';
        const html = (rows || []).map((o) => `<a class="card partner-card" href="${esc(app)}#/partner/${esc(o.id)}" target="_blank" rel="noopener noreferrer">
          ${o.logo ? `<img src="${esc(photoUrl(o.logo))}" alt="" width="56" height="56" loading="lazy">` : `<span class="partner-mark" aria-hidden="true">${esc(String(o.name).trim().charAt(0).toUpperCase())}</span>`}
          <span><b>${esc(o.name)}</b><small>${[o.district, Number(o.roles) ? `${Number(o.roles)} open ${Number(o.roles) === 1 ? 'role' : 'roles'}` : '', Number(o.projects) ? `${Number(o.projects)} ${Number(o.projects) === 1 ? 'project' : 'projects'}` : ''].filter(Boolean).map(esc).join(' · ') || 'LDF partner'}</small></span></a>`).join('');
        partnerEls.forEach((el) => { el.innerHTML = html || '<p class="muted">Checked partner organisations will appear here. Yours could be the first.</p>'; });
      }).catch(() => partnerEls.forEach((el) => { el.innerHTML = ''; }));
    }

    // projects
    const lists = document.querySelectorAll('[data-live="projects"]');
    const mapEl = document.getElementById('pj-map');
    if (lists.length || mapEl) {
      const [progs, hope] = await Promise.all([rpc('public_programmes').catch(() => []), rpc('public_map').catch(() => ({ pins: [] }))]);
      lists.forEach((el) => {
        const limit = Number(el.dataset.limit || 0);
        const sorted = limit ? progs.filter((p) => p.status !== 'planned').slice(0, limit) : progs;
        el.innerHTML = sorted.length ? sorted.map(card).join('') : '<p class="muted">Projects will appear here soon.</p>';
      });
      if (mapEl) drawMap(mapEl, progs, hope);
    }

    // contact form: saves to the LDF inbox; falls back to an e-mail draft if the app cannot be reached
    document.addEventListener('submit', async (ev) => {
      const form = ev.target.closest('#contact-form');
      if (!form) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const status = document.getElementById('form-message'), btn = form.querySelector('button[type=submit]');
      const d = new FormData(form);
      const topicMap = { 'general enquiry': 'general', 'hope project': 'donate', 'learning hub': 'learn', 'volunteering': 'volunteer', 'careers': 'volunteer', 'partnership': 'partner', 'hope shop partner': 'partner', 'ldf market shop': 'partner' };
      btn.disabled = true; status.textContent = 'Sending…';
      try {
        await rpc('submit_contact', { p_name: String(d.get('name') || '').trim(), p_email: String(d.get('email') || '').trim(), p_topic: topicMap[String(d.get('topic') || '').toLowerCase()] || 'general',
          p_message: String(d.get('message') || '').trim(), p_language: 'en', p_region: null, p_website: String(d.get('website') || '') || null });
        form.reset(); status.textContent = 'Thank you! Your message has reached the LDF team. We will reply by e-mail.';
      } catch (e) {
        const body = `Name: ${d.get('name')}\nReply email: ${d.get('email')}\n\n${d.get('message')}`;
        status.innerHTML = 'We could not send that just now. <a href="mailto:' + esc(cfg.contactEmail) + '?subject=' + encodeURIComponent('LDF Enquiry') + '&body=' + encodeURIComponent(body) + '">Send it by e-mail instead</a>.';
      } finally { btn.disabled = false; }
    }, true);
  }
  init();
})();
