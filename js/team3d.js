/* The LDF village: LDF and its six AI helpers walking around and doing their jobs.
   Needs three.js (r128) and ldf3d.js. Usage: const v = LDFTeam(canvas, labelLayer, {onStatus}); */
(function () {
  const T = THREE, TAU = Math.PI * 2;
  const col = h => new T.Color(h).convertSRGBToLinear();
  const mat = (h, o) => new T.MeshStandardMaterial(Object.assign({ color: col(h), roughness: .72 }, o || {}));
  function mesh(g, m, sh = true) { const x = new T.Mesh(g, m); x.castShadow = sh; x.receiveShadow = true; return x; }
  const box = (w, h, d, c, o) => mesh(new T.BoxGeometry(w, h, d), mat(c, o));
  const cyl = (r1, r2, h, c, seg, o) => mesh(new T.CylinderGeometry(r1, r2, h, seg || 20), mat(c, o));
  const ball = (r, c, o) => mesh(new T.SphereGeometry(r, 18, 12), mat(c, o));
  function heartShape(sz) {
    const s = new T.Shape(), k = sz;
    s.moveTo(0, -k * .9); s.bezierCurveTo(-k * 1.3, -k * .1, -k * .9, k * .9, 0, k * .35); s.bezierCurveTo(k * .9, k * .9, k * 1.3, -k * .1, 0, -k * .9);
    return new T.ExtrudeGeometry(s, { depth: k * .3, bevelEnabled: true, bevelSize: k * .08, bevelThickness: k * .08, bevelSegments: 2 });
  }
  const AG = [
    { id: "safety", name: "Safety", c: "#ef4444" }, { id: "hope", name: "Hope", c: "#84cc16" },
    { id: "learning", name: "Learning", c: "#22c3dd" }, { id: "opps", name: "Opportunities", c: "#f59e0b" },
    { id: "marketing", name: "Marketing", c: "#ec4899" }, { id: "donors", name: "Donors & partners", c: "#a78bfa" }
  ];

  function LDFTeam(canvas, layer, opts) {
    opts = opts || {};
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = .92;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(34, 16 / 10, .5, 200);
    scene.add(new T.HemisphereLight(0xffffff, 0x4a6a3a, .85));
    const sun = new T.DirectionalLight(0xfff4e0, 1.25); sun.position.set(-9, 18, 10); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 60 });
    sun.shadow.radius = 3; scene.add(sun);
    const rim = new T.DirectionalLight(0x9fe8ff, .45); rim.position.set(10, 8, -12); scene.add(rim);

    // ---------- the island ----------
    const world = new T.Group(); scene.add(world);
    const land = mesh(new T.CylinderGeometry(14, 13.4, 1.2, 64), mat("#72b842", { roughness: .95 }));
    land.position.y = -.6; world.add(land);
    const soil = mesh(new T.CylinderGeometry(13.4, 12, 1.6, 64), mat("#b98b5e", { roughness: 1 }), false);
    soil.position.y = -1.9; world.add(soil);
    const path = mesh(new T.RingGeometry(2.9, 3.9, 64), mat("#efe3c8", { roughness: 1 }), false);
    path.rotation.x = -Math.PI / 2; path.position.y = .01; world.add(path);
    // HQ: a round stage in the logo colours
    const hq = cyl(2.5, 2.6, .25, "#ffffff", 48); hq.position.y = .12; world.add(hq);
    const hqRing = mesh(new T.TorusGeometry(2.5, .09, 10, 64), mat("#a4c41c", { emissive: col("#a4c41c"), emissiveIntensity: .25 }));
    hqRing.rotation.x = Math.PI / 2; hqRing.position.y = .25; world.add(hqRing);
    [["#8e3a9f", -1], ["#22b8cc", 1]].forEach(([c, k]) => { const s = ball(.22, c); s.position.set(k * 1.9, .35, -1.6); world.add(s); });
    // approval tray: everything that would go out waits here for a person's OK
    const tray = new T.Group(); tray.position.set(0, .25, 2.05); world.add(tray);
    const desk = box(1.5, .1, .8, "#ffffff"); desk.position.y = .75; tray.add(desk);
    [[-.65, -.3], [.65, -.3], [-.65, .3], [.65, .3]].forEach(([x, z]) => { const l = box(.08, .75, .08, "#c9c3bb"); l.position.set(x, .37, z); tray.add(l); });
    const okBtn = cyl(.16, .16, .08, "#22c55e", 20, { emissive: col("#22c55e"), emissiveIntensity: .2 }); okBtn.position.set(.5, .84, .15); tray.add(okBtn);
    const stack = new T.Group(); stack.position.set(-.25, .8, 0); tray.add(stack);
    // trees and flowers around the edge
    for (let i = 0; i < 26; i++) {
      const a = i / 26 * TAU + .1, r = 12.3 + (i % 3) * .45;
      if (i % 4 === 1) continue;
      const g = new T.Group(); g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      if (i % 2) { const tr = cyl(.12, .16, .9, "#8a6a4a", 8); tr.position.y = .45; const cr = ball(.7 + (i % 3) * .12, i % 3 ? "#6fb83f" : "#88c94a"); cr.position.y = 1.3; g.add(tr, cr); }
      else { const f = ball(.16, ["#ffd45c", "#ff7aa8", "#8e3a9f", "#22b8cc"][i % 4]); f.position.y = .3; const st = cyl(.03, .03, .3, "#5d9b34", 6); st.position.y = .15; g.add(st, f); }
      world.add(g);
    }

    // ---------- stations ----------
    const st = {};
    AG.forEach((a, i) => {
      const ang = -Math.PI / 2 - Math.PI / 6 + i * TAU / 6 + Math.PI / 6;   // spread round the island
      const at = r => new T.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r);
      const g = new T.Group(); g.position.copy(at(9.8)); g.rotation.y = Math.atan2(-g.position.x, -g.position.z); world.add(g);
      const tile = cyl(2.2, 2.3, .12, a.c, 40, { roughness: .9 }); tile.position.y = .06; tile.material.color.lerp(col("#ffffff"), .3); g.add(tile);
      st[a.id] = { ang, g, home: at(3.4), spot: at(8.1), at, c: a.c };
    });
    const local = (id, x, z) => { const s = st[id], v = new T.Vector3(x, 0, z); return s.g.localToWorld(v); };
    world.updateMatrixWorld(true);

    // Safety: a lookout with a shield and posts to check
    (() => { const g = st.safety.g;
      [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]].forEach(([x, z]) => { const l = box(.12, 2.2, .12, "#ffffff"); l.position.set(x, 1.1, z - .6); g.add(l); });
      const top = box(1.4, .15, 1.4, "#ffffff"); top.position.set(0, 2.2, -.6); g.add(top);
      const roof = mesh(new T.ConeGeometry(1.1, .8, 4), mat("#ef4444")); roof.position.set(0, 2.75, -.6); roof.rotation.y = Math.PI / 4; g.add(roof);
      const shield = cyl(.42, .42, .1, "#ef4444", 24); shield.rotation.x = Math.PI / 2; shield.position.set(0, 1.4, .02); g.add(shield);
      const t1 = box(.08, .3, .06, "#ffffff"), t2 = box(.08, .5, .06, "#ffffff");
      t1.position.set(-.1, 1.36, .09); t1.rotation.z = .8; t2.position.set(.08, 1.42, .09); t2.rotation.z = -.6; g.add(t1, t2);
      st.safety.cards = [];
      for (let i = 0; i < 6; i++) { const c = box(.42, .3, .03, "#ffffff", { emissive: col("#000000") }); st.safety.g.add(c); st.safety.cards.push(c); }
    })();
    // Hope: a shop that packs food, and village houses
    (() => { const g = st.hope.g;
      const shop = box(2, 1.4, 1.4, "#fff6e6"); shop.position.set(-1.2, .7, -.6); g.add(shop);
      const aw = box(2.2, .12, .7, "#84cc16"); aw.position.set(-1.2, 1.3, .25); aw.rotation.x = .35; g.add(aw);
      for (let i = 0; i < 3; i++) { const p = box(.32, .26, .32, "#a4c41c"); p.position.set(-1.8 + i * .45, .14, .35); g.add(p); }
      st.hope.houses = [-.55, .55].map((off, i) => {
        const a = st.hope.ang + off, h = new T.Group(); h.position.set(Math.cos(a) * 12, 0, Math.sin(a) * 12);
        h.rotation.y = Math.atan2(-h.position.x, -h.position.z);
        const wall = box(1.3, 1, 1.1, i ? "#fde2c8" : "#e7f0ff"); wall.position.y = .5;
        const roof = mesh(new T.ConeGeometry(1.05, .75, 4), mat(i ? "#d9467e" : "#2453d6")); roof.position.y = 1.35; roof.rotation.y = Math.PI / 4;
        const door = box(.32, .55, .04, "#8a6a4a"); door.position.set(0, .3, .56);
        h.add(wall, roof, door); world.add(h);
        return { g: h, door: h.localToWorld(new T.Vector3(0, 0, 1.25)) };
      });
      world.updateMatrixWorld(true);
      st.hope.houses.forEach(hh => { hh.door = hh.g.localToWorld(new T.Vector3(0, 0, 1.3)); });
    })();
    // Learning: a board where a course takes shape, and stools for students
    (() => { const g = st.learning.g;
      const board = box(2.4, 1.4, .1, "#21543f"); board.position.set(0, 1.5, -.5); g.add(board);
      [-1.05, 1.05].forEach(x => { const l = box(.1, 2.2, .1, "#8a6a4a"); l.position.set(x, 1.1, -.55); g.add(l); });
      st.learning.lines = [];
      for (let i = 0; i < 5; i++) { const l = box(.3 + (i % 3) * .5, .06, .02, "#ffffff", { emissive: col("#ffffff"), emissiveIntensity: .5 });
        l.position.set(-.85 + (.3 + (i % 3) * .5) / 2, 1.95 - i * .22, -.44); l.visible = false; g.add(l); st.learning.lines.push(l); }
      const star = mesh(new T.OctahedronGeometry(.18), mat("#ffd45c", { emissive: col("#ffd45c"), emissiveIntensity: .6 }));
      star.position.set(.95, 2.0, -.4); star.visible = false; g.add(star); st.learning.star = star;
      st.learning.stools = [-1.6, 1.6].map(x => { const s = cyl(.28, .28, .45, "#22c3dd", 16); s.position.set(x, .22, 1.2); g.add(s);
        const kid = ball(.22, "#ffd45c"); kid.position.set(x, .62, 1.2); g.add(kid); return g.localToWorld(new T.Vector3(x, 0, .55)); });
    })();
    // Opportunities: a table of skills and a signpost of opportunities
    (() => { const g = st.opps.g;
      const tb = box(1.3, .1, .8, "#ffffff"); tb.position.set(-1.1, .75, -.2); g.add(tb);
      const lg = box(.1, .75, .1, "#c9c3bb"); lg.position.set(-1.1, .37, -.2); g.add(lg);
      const pole = cyl(.08, .08, 2.6, "#8a6a4a", 10); pole.position.set(1.2, 1.3, -.5); g.add(pole);
      st.opps.signs = [];
      for (let i = 0; i < 3; i++) { const s = box(1.1, .3, .06, i % 2 ? "#f59e0b" : "#fcd34d"); s.position.set(1.2 + (i % 2 ? -.35 : .35), 2.2 - i * .45, -.45);
        s.visible = i === 0; g.add(s); st.opps.signs.push(s); }
    })();
    // Marketing: a desk and a billboard of posts
    (() => { const g = st.marketing.g;
      const d = box(1.2, .1, .7, "#ffffff"); d.position.set(-1.3, .75, -.1); g.add(d);
      const lg = box(.1, .75, .1, "#c9c3bb"); lg.position.set(-1.3, .37, -.1); g.add(lg);
      const lap = box(.6, .04, .4, "#2b2a44"); lap.position.set(-1.3, .82, -.1); g.add(lap);
      const scr = box(.6, .38, .03, "#2b2a44", { emissive: col("#ec4899"), emissiveIntensity: .35 }); scr.position.set(-1.3, 1.02, -.3); scr.rotation.x = -.2; g.add(scr);
      [-0.1, 2.3].forEach(x => { const p = box(.12, 2.6, .12, "#ffffff"); p.position.set(x, 1.3, -.8); g.add(p); });
      const bb = box(2.6, 1.5, .1, "#ffffff"); bb.position.set(1.1, 2.0, -.75); g.add(bb);
      st.marketing.tiles = [];
      for (let i = 0; i < 6; i++) { const tl = box(.66, .5, .03, ["#ec4899", "#a4c41c", "#22b8cc", "#8e3a9f", "#ffd45c", "#2453d6"][i]);
        tl.position.set(.3 + (i % 3) * .8, 2.35 - Math.floor(i / 3) * .65, -.68); tl.visible = i < 2; g.add(tl); st.marketing.tiles.push(tl); }
      st.marketing.shown = 2;
    })();
    // Donors & partners: a writing desk and a heart garden
    (() => { const g = st.donors.g;
      const d = box(1.2, .1, .7, "#ffffff"); d.position.set(0, .75, -.4); g.add(d);
      const lg = box(.1, .75, .1, "#c9c3bb"); lg.position.set(0, .37, -.4); g.add(lg);
      const pen = cyl(.03, .03, .4, "#8e3a9f", 6); pen.position.set(.3, .85, -.3); pen.rotation.z = 1.2; g.add(pen);
      const hm = mat("#ff6fa0", { emissive: col("#ff6fa0"), emissiveIntensity: .25 });
      for (let i = 0; i < 3; i++) { const h = mesh(heartShape(.22), hm); h.position.set(-1.5 + i * 1.5, .5, 1.2); h.rotation.z = Math.PI; g.add(h); }
    })();
    const deskSpot = { opps: local("opps", -1.1, .55), marketing: local("marketing", -1.3, .55), donors: local("donors", 0, .3),
      hopeShop: local("hope", -1.2, .6), board: local("learning", 0, .5), sign: local("opps", 1.2, .35), billboard: local("marketing", 1.1, .3) };
    const trayTop = () => tray.localToWorld(new T.Vector3(-.25, .95, 0));

    // ---------- the team ----------
    const ldf = LDF3D.character({ scale: .95 }); world.add(ldf.root);
    const bots = {};
    AG.forEach(a => {
      const ch = LDF3D.character({ scale: .7, suit: a.c, bulb: a.c });
      ch.root.position.copy(st[a.id].home); world.add(ch.root);
      bots[a.id] = { ...a, ch, pos: ch.root.position, heading: Math.atan2(-st[a.id].home.x, -st[a.id].home.z), steps: [], cur: null, holding: null, label: "Waiting for a job", busy: false };
    });

    // labels over heads
    const tags = {};
    function tag(id, name, c) { const d = document.createElement("div"); d.className = "tag3d"; d.style.setProperty("--tc", c);
      d.innerHTML = `<b></b><span></span>`; d.querySelector("b").textContent = name; layer.appendChild(d); tags[id] = d; return d; }
    tag("ldf", "LDF", "#a4c41c"); AG.forEach(a => tag(a.id, a.name, a.c)); tag("tray", "Approval tray", "#22c55e");
    const PLACES = { safety: "Safety lookout", hope: "Shop & village", learning: "Classroom", opps: "Opportunity board", marketing: "Studio", donors: "Thank-you desk" };
    const signs = {};
    AG.forEach(a => { const d = document.createElement("div"); d.className = "place3d"; d.textContent = PLACES[a.id]; layer.appendChild(d); signs[a.id] = d; });

    // props that fly or float
    const fx = [];
    AG.forEach(a => status(a.id, "Waiting for a job"));
    function orb(from, to, c, done) {
      const o = new T.Mesh(new T.SphereGeometry(.18, 16, 12), new T.MeshBasicMaterial({ color: col(c) }));
      const g = new T.Mesh(new T.SphereGeometry(.38, 16, 12), new T.MeshBasicMaterial({ color: col(c), transparent: true, opacity: .3, depthWrite: false }));
      o.add(g); world.add(o); fx.push({ o, t: 0, dur: .9, upd: k => { o.position.lerpVectors(from, to, k); o.position.y += Math.sin(k * Math.PI) * 2.2; },
        end: () => { world.remove(o); done && done(); } });
    }
    function hearts(at, n) {
      for (let i = 0; i < n; i++) { const h = mesh(heartShape(.14), mat("#ff6fa0", { emissive: col("#ff6fa0"), emissiveIntensity: .4, transparent: true }), false);
        h.rotation.z = Math.PI; const p0 = at.clone().add(new T.Vector3((Math.random() - .5) * .8, 1.2, (Math.random() - .5) * .8)); world.add(h);
        fx.push({ o: h, t: -i * .15, dur: 1.6, upd: k => { h.position.copy(p0); h.position.y += k * 1.6; h.material.opacity = 1 - k; h.rotation.y = k * 3; }, end: () => world.remove(h) }); }
    }
    function flash(at) {
      const f = new T.Mesh(new T.SphereGeometry(.5, 16, 12), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9, depthWrite: false }));
      world.add(f); f.position.copy(at).add(new T.Vector3(0, 1.1, 0));
      fx.push({ o: f, t: 0, dur: .45, upd: k => { f.scale.setScalar(.4 + k * 1.4); f.material.opacity = .9 * (1 - k); }, end: () => world.remove(f) });
    }
    function carry(b, kind) {
      const c = kind === "parcel" ? box(.5, .38, .5, "#a4c41c") : box(.42, .3, .05, kind === "card" ? "#ffffff" : b.c);
      if (kind === "parcel") { const rb = box(.1, .4, .52, "#8e3a9f"); c.add(rb); }
      c.position.set(0, 1.25, .62); b.ch.root.add(c); b.holding = c;
    }
    function drop(b) { if (b.holding) { b.ch.root.remove(b.holding); b.holding = null; } }
    const pending = [];
    function addToTray(b, what) {
      const card = box(.5, .05, .36, b.c); card.position.set((Math.random() - .5) * .1, pending.length * .06, (Math.random() - .5) * .1);
      card.rotation.y = (Math.random() - .5) * .4; stack.add(card); pending.push({ card, who: b.id, what });
      status("tray", `${pending.length} waiting for your OK`);
    }

    // jobs: walk somewhere, do something, come back and report
    const W = (to, act, label) => ({ type: "walk", to, act: act || "walk", label });
    const DO = (act, dur, label, start, tick) => ({ type: "do", act, dur, label, start, tick });
    function job(b) {
      const S = st[b.id];
      switch (b.id) {
        case "safety": return [W(S.spot, "walk", "Going to check new posts"),
          DO("scan", 6, "Checking new posts are kind and safe", () => S.cards.forEach(c => { c.material.color.copy(col("#ffffff")); }),
            k => S.cards.forEach((c, i) => { if (k > (i + 1) / 7) c.material.color.copy(col("#86efac")); })),
          DO("thumbs", 1.4, "All posts are safe"), W(S.home, "walk", "Heading back"), DO("thumbs", 1.6, "Done: the community is safe")];
        case "hope": { const h = S.houses[Math.floor(Math.random() * S.houses.length)];
          return [W(deskSpot.hopeShop, "walk", "Going to the shop"), DO("work", 2.6, "Packing a food package", null, null),
            DO("carry", .4, "Package ready", () => carry(b, "parcel")), W(h.door, "carrywalk", "Delivering to a family in the village"),
            DO("carry", .5, "At the family's door", () => { drop(b); hearts(h.door, 3); }),
            DO("thumbs", 1.2, "Taking a proof photo (no faces)", () => flash(b.pos)), W(S.home, "walk", "Heading back"),
            DO("thumbs", 1.6, "Delivered. Proof waits for staff to check")]; }
        case "learning": return [W(deskSpot.board, "walk", "Going to the board"),
          DO("point", 5, "Building a course from a real story", () => { S.lines.forEach(l => l.visible = false); S.star.visible = false; },
            k => S.lines.forEach((l, i) => l.visible = k > i / 5.5)),
          W(S.stools[Math.floor(Math.random() * 2)], "walk", "Checking on a student"), DO("talk", 2.6, "Encouraging a student"),
          DO("carry", .4, "Course draft ready", () => carry(b, "draft")), W(trayTop().setY(0).add(new T.Vector3(-.9, 0, .7)), "carrywalk", "Taking the course draft for approval"),
          DO("assign", 1.2, "Course draft waits for your OK", () => { drop(b); addToTray(b, "course"); }), W(S.home, "walk", "Heading back")];
        case "opps": return [W(deskSpot.opps, "walk", "Reading members' skills"), DO("work", 2.6, "Matching skills to an opportunity"),
          DO("carry", .4, "Found good matches", () => carry(b, "card")), W(deskSpot.sign, "carrywalk", "Posting the opportunity"),
          DO("point", 1.8, "A new opportunity is up", () => { drop(b); const n = S.signs.findIndex(s => !s.visible); if (n < 0) S.signs.forEach((s, i) => s.visible = i === 0); else S.signs[n].visible = true; }),
          W(S.home, "walk", "Heading back"), DO("thumbs", 1.4, "Members can apply themselves")];
        case "marketing": return [W(deskSpot.marketing, "walk", "Going to write"), DO("work", 3, "Writing a post about LDF's real work"),
          DO("carry", .4, "Post draft ready", () => carry(b, "draft")), W(trayTop().setY(0).add(new T.Vector3(.9, 0, .7)), "carrywalk", "Taking the post for approval"),
          DO("assign", 1.2, "Post waits for your OK", () => { drop(b); addToTray(b, "post"); }), W(S.home, "walk", "Heading back")];
        case "donors": return [W(deskSpot.donors, "walk", "Going to the desk"), DO("work", 3, "Writing a thank-you card for a donor"),
          DO("love", 1.2, "Ayubowan, with gratitude", () => hearts(b.pos, 2)), DO("carry", .3, "Card ready", () => carry(b, "card")),
          W(trayTop().setY(0).add(new T.Vector3(0, 0, 1.0)), "carrywalk", "Taking the card for approval"),
          DO("assign", 1.2, "Thank-you waits for your OK", () => { drop(b); addToTray(b, "thanks"); }), W(S.home, "walk", "Heading back")];
      }
      return [];
    }

    function status(id, text) { const t = tags[id]; if (t) { t.querySelector("span").textContent = text;
        t.classList.toggle("idle", /Waiting for a job|Ready for the next job/.test(text)); } opts.onStatus && opts.onStatus(id, text); }

    // LDF: plans, hands out jobs, and the person approves
    const L = { pos: ldf.root.position, heading: 0, mode: "think", until: 0, next: 0, rr: 0, walkTo: null };
    let lastApprove = 0;
    function assignNext(now) {
      const free = AG.map(a => bots[a.id]).filter(b => !b.busy);
      if (!free.length) return false;
      const b = free[L.rr++ % free.length];
      L.heading = Math.atan2(b.pos.x - L.pos.x, b.pos.z - L.pos.z);
      ldf.set("assign", now); L.mode = "assign"; L.until = now + 1500;
      status("ldf", `Asking ${b.name}: ${({ safety: "check new posts", hope: "deliver a package", learning: "build a course", opps: "match an opportunity", marketing: "write a post", donors: "thank a donor" })[b.id]}`);
      b.busy = true; status(b.id, "Got a job from LDF");
      setTimeout(() => orb(L.pos.clone().add(new T.Vector3(0, 1.4, 0)), b.pos.clone().add(new T.Vector3(0, 1.3, 0)), b.c, () => { b.steps = job(b); b.cur = null; }), 650);
      return true;
    }
    function approve(now) {
      if (!pending.length) return;
      const items = pending.splice(0);
      okBtn.material.emissiveIntensity = 1.2; setTimeout(() => okBtn.material.emissiveIntensity = .2, 900);
      status("tray", "Approved by you ✓  Sending now");
      items.forEach((it, i) => {
        const from = it.card.getWorldPosition(new T.Vector3()); stack.remove(it.card);
        const to = it.what === "post" ? st.marketing.g.localToWorld(new T.Vector3(1.1, 2.0, -.6)) : it.what === "course" ? st.learning.g.localToWorld(new T.Vector3(.95, 2, -.4)) : st.donors.g.localToWorld(new T.Vector3(0, 1.2, 1.2));
        setTimeout(() => orb(from, to, bots[it.who].c, () => {
          if (it.what === "post") { const m = st.marketing; if (m.shown >= m.tiles.length) { m.tiles.forEach((t, j) => t.visible = j < 1); m.shown = 1; } m.tiles[m.shown++].visible = true; }
          if (it.what === "course") st.learning.star.visible = true;
          if (it.what === "thanks") hearts(to.clone().setY(0), 4);
        }), i * 300);
      });
      ldf.set("celebrate", now); L.mode = "cheer"; L.until = now + 2200; status("ldf", "You said yes. Sending it out!");
      setTimeout(() => status("tray", "Waiting for your OK"), 2600);
    }

    // ---------- camera: a slow drift, and you can drag to turn the island ----------
    let yaw = .0, drag = null, autoT = 0;
    canvas.addEventListener("pointerdown", e => { drag = { x: e.clientX, y0: yaw }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", e => { if (drag) { yaw = drag.y0 + (e.clientX - drag.x) * .008; autoT = performance.now() + 6000; } });
    canvas.addEventListener("pointerup", () => drag = null);
    function placeCam(now) {
      if (now > autoT && !drag) yaw += .0006;
      const tall = cam.aspect < 1, r = tall ? 21 : 28.5, h = tall ? 29 : 21.5;
      cam.position.set(Math.sin(yaw) * r, h, Math.cos(yaw) * r); cam.lookAt(0, .6, 0);
    }
    function size() { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h;
      cam.fov = w / h < 1 ? 50 : 36; cam.updateProjectionMatrix(); }
    addEventListener("resize", size); size();

    // ---------- the loop ----------
    let last = performance.now(), running = true;
    const tmp = new T.Vector3();
    function stepBot(b, now, dt) {
      if (!b.steps.length && !b.cur) { b.ch.set(b.busy ? "idle" : "idle", now); if (b.busy && b.reported) { b.busy = false; b.reported = false; status(b.id, "Ready for the next job"); } b.ch.update(now, b.heading); return; }
      if (!b.cur) { b.cur = b.steps.shift(); b.cur.t0 = now; if (b.cur.label) status(b.id, b.cur.label); if (b.cur.start) b.cur.start(); if (!b.steps.length) b.reported = true; }
      const s = b.cur;
      if (s.type === "walk") {
        const d = tmp.copy(s.to).sub(b.pos); d.y = 0; const dist = d.length();
        if (dist < .12) { b.cur = null; } else { const v = Math.min(dist, (s.act === "carrywalk" ? 2.1 : 2.6) * dt); d.normalize(); b.pos.addScaledVector(d, v); b.heading = Math.atan2(d.x, d.z); b.ch.set(s.act, now); }
      } else {
        b.ch.set(s.act, now); const k = Math.min(1, (now - s.t0) / 1000 / s.dur); if (s.tick) s.tick(k); if (k >= 1) b.cur = null;
      }
      // face the station while working there
      if (s.type === "do" && b.id !== "hope") { const S = st[b.id]; const tgt = s.act === "assign" || s.act === "carry" ? null : S.g.position; if (tgt && b.pos.distanceTo(S.home) > 1) b.heading = Math.atan2(tgt.x - b.pos.x, tgt.z - b.pos.z); }
      b.ch.update(now, b.heading);
    }
    let sim = performance.now();
    function frame(real) {
      if (!running) return;
      const dt = Math.min(.05, (real - last) / 1000) * (opts.speed || 1); last = real;
      sim += dt * 1000; const now = sim;
      placeCam(real);
      // LDF
      if (now > L.until) {
        if (pending.length >= 2 && now - lastApprove > 9000) { lastApprove = now; approve(now); }
        else if (now > L.next && assignNext(now)) { L.next = now + 3200; }
        else if (L.mode !== "think") { L.mode = "think"; ldf.set("think", now); L.until = now + 2000; status("ldf", ["Planning what's next", "Watching every agent", "Checking what needs you"][Math.floor(now / 4000) % 3]); }
        else { L.mode = "stroll"; L.until = now + 2600; const a = Math.random() * TAU; L.walkTo = new T.Vector3(Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1 - .3); }
      }
      if (L.mode === "stroll" && L.walkTo) { const d = tmp.copy(L.walkTo).sub(L.pos); const dist = d.length();
        if (dist > .08) { d.normalize(); L.pos.addScaledVector(d, Math.min(dist, 1.6 * dt)); L.heading = Math.atan2(d.x, d.z); ldf.set("walk", now); } else ldf.set("idle", now); }
      ldf.update(now, L.heading);
      AG.forEach(a => stepBot(bots[a.id], now, dt));
      // safety posts circle the lookout
      st.safety.cards.forEach((c, i) => { const a = now / 1600 + i * TAU / 6; c.position.set(Math.cos(a) * 1.25, 1.2 + Math.sin(now / 700 + i) * .12, Math.sin(a) * 1.25 + .2); c.rotation.y = -a; });
      st.learning.star.rotation.y = now / 600;
      for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt / f.dur; if (f.t >= 0) f.upd(Math.min(1, f.t)); if (f.t >= 1) { f.end(); fx.splice(i, 1); } }
      renderer.render(scene, cam);
      // labels follow heads
      const W2 = canvas.clientWidth, H2 = canvas.clientHeight;
      const put = (id, v) => { v.project(cam); const t = tags[id]; if (!t) return; const vis = v.z < 1;
        t.style.transform = `translate(${((v.x + 1) / 2 * W2).toFixed(1)}px,${((1 - v.y) / 2 * H2).toFixed(1)}px) translate(-50%,-100%)`; t.style.opacity = vis ? 1 : 0; };
      put("ldf", L.pos.clone().add(new T.Vector3(0, 3.6, 0)));
      AG.forEach(a => put(a.id, bots[a.id].pos.clone().add(new T.Vector3(0, 2.6, 0))));
      put("tray", tray.localToWorld(new T.Vector3(0, 1.4, 0)));
      AG.forEach(a => { const v = st[a.id].g.localToWorld(new T.Vector3(0, 0, 1.9)); v.project(cam); const d = signs[a.id];
        d.style.transform = `translate(${((v.x + 1) / 2 * W2).toFixed(1)}px,${((1 - v.y) / 2 * H2).toFixed(1)}px) translate(-50%,0)`; });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    function destroy() { running = false; removeEventListener("resize", size); try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) { }
      Object.values(tags).forEach(d => d.remove()); Object.values(signs).forEach(d => d.remove()); }
    return { destroy, sim: () => sim, pending: () => pending.length, pause() { running = false; }, play() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }, size, approve: () => approve(performance.now()) };
  }
  window.LDFTeam = LDFTeam;
})();
