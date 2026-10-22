/* LDF in 3D: built from the Life Development Foundation logo.
   Green circle = head, white crescent = suit + badge, purple and cyan figures = left and right sleeves + boots.
   Needs three.js (r128). Usage:
     const bot = LDF3D.create(canvas, {shadow:true});
     bot.set({act:"wave", facing:0, talking:false, colour:"#22b8cc", look:[0,0]});
   Moves: idle walk fly hover popup wave handshake highfive thumbs love celebrate nod shake listen think talk assign */
(function () {
  const T = THREE, D = Math.PI / 180, s = Math.sin, c = Math.cos;

  function mat(color, o) {
    return new T.MeshPhysicalMaterial(Object.assign({ color: new T.Color(color).convertSRGBToLinear(), roughness: .36, metalness: 0, clearcoat: .55, clearcoatRoughness: .28 }, o || {}));
  }
  function capsule(r, len, m) {                       // hangs down (-Y) from the origin
    const g = new T.Group();
    const cyl = new T.Mesh(new T.CylinderGeometry(r, r * .96, len, 22, 1, true), m); cyl.position.y = -len / 2;
    const a = new T.Mesh(new T.SphereGeometry(r, 22, 14), m), b = new T.Mesh(new T.SphereGeometry(r * .96, 22, 14), m);
    b.position.y = -len; g.add(cyl, a, b);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    return g;
  }
  function onSphere(obj, yaw, pitch, r) {             // put a face part on the head's surface, facing out
    const n = new T.Vector3(s(yaw * D) * c(pitch * D), s(pitch * D), c(yaw * D) * c(pitch * D));
    obj.position.copy(n.clone().multiplyScalar(r));
    obj.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), n);
    return obj;
  }

  function build(o) {
    o = o || {};
    const M = {
      lime: mat(0xa8c81e, { roughness: .3, clearcoat: .8 }), white: mat(0xf3f0eb, { roughness: .42 }),
      grey: mat(0x5f5a6a, { roughness: .55, clearcoat: .2 }), purple: mat(0x7a2a92), cyan: mat(0x10a6bd),
      glove: mat(0xfdfcfa, { roughness: .55, clearcoat: .25 }), badge: mat(0xffffff, { roughness: .3 }),
      cradle: mat(0xb9b4ad), stem: mat(0x7c9810),
      dark: new T.MeshPhysicalMaterial({ color: new T.Color(0x17162a).convertSRGBToLinear(), roughness: .15, clearcoat: 1 }),
      white2: new T.MeshBasicMaterial({ color: 0xffffff }),
      pink: new T.MeshBasicMaterial({ color: new T.Color(0xff6f9f).convertSRGBToLinear(), transparent: true, opacity: .55, depthWrite: false }),
      mouth: new T.MeshStandardMaterial({ color: new T.Color(0x3a1830).convertSRGBToLinear(), roughness: .6 }),
      bulb: new T.MeshStandardMaterial({ color: 0x2cc3d6, emissive: 0x2cc3d6, emissiveIntensity: .55, roughness: .2 }),
      halo: new T.MeshBasicMaterial({ color: 0x7fe7f2, transparent: true, opacity: .22, depthWrite: false }),
      jet: new T.MeshBasicMaterial({ color: 0xc6f03a, transparent: true, opacity: 0, depthWrite: false }),
    };
    const R = {};
    const root = new T.Group(), body = new T.Group();
    root.add(body);
    // legs + boots (purple left, cyan right)
    R.legs = [[-1, M.purple], [1, M.cyan]].map(([k, bm]) => {
      const hip = new T.Group(); hip.position.set(.22 * k, .8, 0); body.add(hip);
      hip.add(capsule(.13, .5, M.grey));
      const boot = new T.Mesh(new T.SphereGeometry(.2, 26, 16), bm);
      boot.scale.set(1.15, .78, 1.5); boot.position.set(.02 * k, -.6, .09); boot.castShadow = true; hip.add(boot);
      const shine = new T.Mesh(new T.SphereGeometry(.05, 12, 8), M.white2); shine.scale.set(1.4, .6, .6);
      shine.position.set(-.05, -.5, .3); shine.material = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5 });
      hip.add(shine);
      return hip;
    });
    // suit
    const prof = [[0, .62], [.4, .65], [.59, .82], [.645, 1.06], [.6, 1.34], [.42, 1.56], [0, 1.66]].map(p => new T.Vector2(p[0], p[1]));
    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), o.suit ? mat(o.suit, { roughness: .42 }) : M.white); torso.castShadow = true; body.add(torso);
    // chest badge: the logo in miniature
    const badge = new T.Group(); badge.position.set(0, 1.05, .635); body.add(badge);
    const disc = new T.Mesh(new T.CylinderGeometry(.21, .21, .05, 40), M.badge); disc.rotation.x = Math.PI / 2; badge.add(disc);
    const ring = new T.Mesh(new T.TorusGeometry(.21, .016, 8, 40), M.cradle); ring.position.z = .01; badge.add(ring);
    const cup = new T.Mesh(new T.TorusGeometry(.1, .024, 10, 28, Math.PI), M.cradle); cup.rotation.z = Math.PI; cup.position.set(0, .01, .03); badge.add(cup);
    [[M.lime, 0, .0, .046], [M.purple, -.09, .085, .034], [M.cyan, .09, .085, .034]].forEach(([m, x, y, r]) => {
      const b = new T.Mesh(new T.SphereGeometry(r, 16, 12), m); b.position.set(x, y, .04); badge.add(b);
    });
    // arms: purple sleeve left, cyan sleeve right, white gloves with coloured cuffs
    R.arms = {};
    [["L", -1, M.purple], ["R", 1, M.cyan]].forEach(([n, k, m]) => {
      const sh = new T.Group(); sh.position.set(.56 * k, 1.38, 0); sh.rotation.order = "ZXY"; body.add(sh);
      sh.add(capsule(.115, .44, m));
      const el = new T.Group(); el.position.y = -.44; el.rotation.order = "ZXY"; sh.add(el);
      el.add(capsule(.105, .34, m));
      const hand = new T.Group(); hand.position.y = -.47; el.add(hand);
      const cuff = new T.Mesh(new T.TorusGeometry(.105, .045, 10, 26), m); cuff.rotation.x = Math.PI / 2; cuff.position.y = .08; hand.add(cuff);
      const palm = new T.Mesh(new T.SphereGeometry(.17, 26, 18), M.glove); palm.scale.set(1, 1.06, .85); palm.castShadow = true; hand.add(palm);
      const thumb = new T.Mesh(new T.SphereGeometry(.075, 16, 12), M.glove); thumb.scale.set(1, 1.6, 1); thumb.castShadow = true; hand.add(thumb);
      const fingers = [-1, 0, 1].map(i => {
        const f = new T.Mesh(new T.SphereGeometry(.058, 16, 12), M.glove); f.scale.set(1, 1.5, 1);
        f.position.set(i * .085, -.16 + Math.abs(i) * .025, 0); f.rotation.z = -i * .25; f.castShadow = true; hand.add(f); return f;
      });
      R.arms[n] = { sh, el, hand, palm, thumb, fingers, k };
    });
    // head on a neck pivot (nod, shake, tilt)
    const neck = new T.Group(); neck.position.set(0, 1.55, 0); body.add(neck);
    const head = new T.Group(); head.position.y = .82; neck.add(head);
    const skull = new T.Mesh(new T.SphereGeometry(1, 56, 40), M.lime); head.scale.setScalar(.92); skull.castShadow = true; head.add(skull);
    const face = new T.Group(); face.rotation.order = "YXZ"; head.add(face);
    const eyes = {};
    [["L", -1], ["R", 1]].forEach(([n, k]) => {
      const g = onSphere(new T.Group(), 17 * k, -6, 1.0); face.add(g);
      const ball = new T.Mesh(new T.SphereGeometry(1, 24, 18), M.dark); ball.scale.set(.185, .225, .08); g.add(ball);
      const hi1 = new T.Mesh(new T.SphereGeometry(.055, 12, 8), M.white2); hi1.position.set(-.05, .07, .07); g.add(hi1);
      const hi2 = new T.Mesh(new T.SphereGeometry(.024, 10, 8), M.white2); hi2.position.set(.06, -.07, .07); g.add(hi2);
      const happy = new T.Mesh(new T.TorusGeometry(.1, .026, 8, 20, Math.PI), M.dark); happy.position.set(0, -.04, .04); g.add(happy);
      const cheek = onSphere(new T.Mesh(new T.SphereGeometry(1, 16, 12), M.pink), 33 * k, -21, .985); cheek.scale.set(.15, .09, .03); face.add(cheek);
      eyes[n] = { g, ball, hi1, hi2, happy };
    });
    const mouthG = onSphere(new T.Group(), 0, -25, 1.0); face.add(mouthG);
    const smile = new T.Mesh(new T.TorusGeometry(.085, .022, 8, 20, Math.PI), M.dark); smile.rotation.z = Math.PI; smile.position.z = .01; mouthG.add(smile);
    const flat = new T.Mesh(new T.CylinderGeometry(.02, .02, .12, 10), M.dark); flat.rotation.z = Math.PI / 2; flat.position.z = .01; mouthG.add(flat);
    const open = new T.Mesh(new T.SphereGeometry(1, 20, 14), M.mouth); open.scale.set(.08, .06, .03); mouthG.add(open);
    // antenna with a glowing bulb (its colour shows which agent is working)
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, .96, 0), new T.Vector3(-.08, 1.3, 0), new T.Vector3(.12, 1.48, 0));
    const stem = new T.Mesh(new T.TubeGeometry(curve, 24, .032, 8, false), M.stem); stem.castShadow = true; head.add(stem);
    const bulb = new T.Mesh(new T.SphereGeometry(.12, 22, 16), M.bulb); bulb.position.set(.12, 1.5, 0); head.add(bulb);
    const halo = new T.Mesh(new T.SphereGeometry(.24, 20, 14), M.halo); halo.position.copy(bulb.position); head.add(halo);
    // jet glow under the boots when flying
    const jet = new T.Mesh(new T.CircleGeometry(.55, 32), M.jet); jet.rotation.x = -Math.PI / 2; jet.position.y = -.05; body.add(jet);
    Object.assign(R, { root, body, neck, head, face, eyes, smile, flat, open, bulb, halo, jet, M });
    return R;
  }

  // ---------- poses ----------
  const A = (side, fwd, bend, ez) => ({ side, fwd, bend: bend || 0, ez: ez || 0 });
  function pose(act, t, o) {
    const p = {
      y: s(t * 2.2) * .015, face: o.facing || 0, lean: 0, pitch: 0, nod: 0, turn: 0, tilt: .1 + s(t * 1.3) * .045,
      L: A(9 + s(t * 1.6) * 3, 2, 10), R: A(9 - s(t * 1.6) * 3, 2, 10), legs: [0, 0], hands: { L: "mitt", R: "mitt" },
      eyes: "open", mouth: "smile", open: 0, jet: 0, look: o.look || [0, 0]
    };
    const w = t * 7;
    switch (act) {
      case "walk": p.L = A(8, s(w) * 32, 18); p.R = A(8, -s(w) * 32, 18); p.legs = [-s(w) * 30, s(w) * 30];
        p.y = Math.abs(c(w)) * .06; p.tilt = .04; p.lean = 0; break;
      case "fly": case "hover": p.L = A(68, -22, 12); p.R = A(68, -22, 12); p.pitch = act === "fly" ? .22 : .06;
        p.legs = [-14, -8]; p.y = .12 + s(t * 2.2) * .06; p.jet = .75 + s(t * 14) * .15; p.eyes = "happy"; p.tilt = .04; break;
      case "popup": { const k = Math.min(1, t / .8), e = 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);
        p.y = -4.5 * (1 - e); if (t > .8) { p.L = A(128, 34, 0, 18 + s(t * 9) * 28); p.hands.L = "open"; p.eyes = "happy"; } break; }
      case "wave": p.L = A(128, 34, 0, 18 + s(t * 9) * 28); p.hands.L = "open"; p.eyes = "happy"; p.tilt = -.08; break;
      case "highfive": { const u = t % 1.8;
        if (u < .45) p.R = A(105, 0, 0, 65); else { p.R = A(140, 36, 0, 0); p.hands.R = "open"; p.eyes = "happy"; } p.tilt = .14; break; }
      case "thumbs": p.R = A(55, 15, 0, 115); p.hands.R = "thumb"; p.eyes = "happy"; p.tilt = .14; break;
      case "handshake": p.R = A(16, 62 + s(t * 10) * 7, 8); p.hands.R = "open"; p.tilt = .1; break;
      case "love": p.L = A(-36, 46, 102); p.R = A(-36, 46, 102); p.eyes = "happy"; p.tilt = .12 + s(t * 1.5) * .06; p.nod = .06; break;
      case "celebrate": { const j = Math.abs(s(t * 5)); p.L = A(152, 6, 0, -12 + s(t * 10) * 10); p.R = A(152, 6, 0, -12 - s(t * 10) * 10);
        p.hands.L = p.hands.R = "open"; p.y = j * .38; p.legs = [j * 18, j * 18]; p.eyes = "happy"; p.mouth = "open"; p.open = 1; break; }
      case "nod": p.nod = Math.max(0, s(t * 7)) * .26; p.eyes = "happy"; break;
      case "shake": p.turn = s(t * 10) * .35; p.tilt = s(t * 10) * .06; p.mouth = "flat"; break;
      case "listen": p.R = A(122, 4, 8, 100); p.hands.R = "open"; p.tilt = -.16; p.mouth = "o"; p.open = .55; break;
      case "think": p.L = A(-22, 58, 138); p.tilt = .18; p.nod = -.06; p.eyes = "up"; p.mouth = "flat"; p.look = [-.3, -.6]; break;
      case "talk": p.L = A(18 + s(t * 3) * 8, 30, 45 + s(t * 3.3) * 25); p.R = A(16 + s(t * 2.6) * 8, 26, 38 + s(t * 2.9) * 22);
        p.hands.L = p.hands.R = "open"; p.mouth = "talk"; p.open = .25 + Math.abs(s(t * 13)) * .75; break;
      case "carry": case "carrywalk":                       // holding a parcel / book / card in front
        p.L = A(-16, 64, 36); p.R = A(-16, 64, 36); p.eyes = "happy";
        if (act === "carrywalk") { p.legs = [-s(w) * 28, s(w) * 28]; p.y = Math.abs(c(w)) * .05; } break;
      case "work": p.L = A(12, 48 + s(t * 9) * 9, 52); p.R = A(12, 48 - s(t * 9) * 9, 52); p.nod = .12; p.mouth = "flat"; break;
      case "point": p.R = A(84, 28, 6, 0); p.hands.R = "open"; p.mouth = "talk"; p.open = .25 + Math.abs(s(t * 11)) * .6; p.tilt = -.06; break;
      case "scan": p.turn = s(t * 1.6) * .55; p.R = A(120, 30, 0, 95); p.hands.R = "open"; p.eyes = "open"; break;
      case "assign": { const u = t % 1.6;                      // tosses a task to another agent
        if (u < .5) p.R = A(58, -40, 70); else { p.R = A(38, 82, 0); p.hands.R = "open"; } p.eyes = "happy"; p.tilt = .08; break; }
    }
    if (o.blink != null) p.blink = o.blink;
    if (o.talking && act !== "talk") { p.mouth = "talk"; p.open = .25 + Math.abs(s(t * 13)) * .75; }
    return p;
  }

  function lerpA(a, b, k) { const d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return a + d * k; }
  function mixPose(cur, tgt, k) {
    if (!cur) return JSON.parse(JSON.stringify(tgt));
    const L = (a, b) => a + (b - a) * k;
    for (const key in tgt) {
      const v = tgt[key];
      if (typeof v === "number") cur[key] = L(cur[key], v);
      else if (Array.isArray(v)) cur[key] = v.map((x, i) => L(cur[key][i], x));
      else if (v && typeof v === "object" && "side" in v) for (const q in v) cur[key][q] = L(cur[key][q], v[q]);
      else cur[key] = v;
    }
    return cur;
  }
  function applyPose(R, p, t) {
    R.root.rotation.y = p.face; R.body.position.y = p.y; R.body.rotation.z = p.lean; R.body.rotation.x = p.pitch;
    R.neck.rotation.set(p.nod, p.turn + p.look[0] * .25, -p.tilt, "YXZ");
    R.face.rotation.y = p.look[0] * .1; R.face.rotation.x = p.look[1] * .08;
    ["L", "R"].forEach(n => {
      const a = R.arms[n], q = p[n], k = a.k, mode = p.hands[n];
      a.sh.rotation.z = k * q.side * D; a.sh.rotation.x = -q.fwd * D;
      a.el.rotation.x = -q.bend * D; a.el.rotation.z = k * q.ez * D;
      a.fingers.forEach(f => f.visible = mode === "open");
      a.palm.scale.set(mode === "open" ? 1.08 : 1, mode === "thumb" ? .92 : 1.06, .85);
      if (mode === "thumb") { a.thumb.position.set(0, -.2, .04); a.thumb.rotation.set(0, 0, 0); a.thumb.scale.set(1.15, 1.9, 1.15); }
      else if (mode === "open") { a.thumb.position.set(-.17 * k, -.02, .06); a.thumb.rotation.set(0, 0, k * .9); a.thumb.scale.set(1, 1.6, 1); }
      else { a.thumb.position.set(-.04 * k, -.01, .15); a.thumb.rotation.set(.5, 0, 0); a.thumb.scale.set(1, 1.5, 1); }
    });
    R.legs.forEach((h, i) => { h.rotation.x = -p.legs[i] * D; });
    const blink = p.eyes === "open" && (p.blink != null ? p.blink : (performance.now() % 4100) < 120);
    ["L", "R"].forEach(n => {
      const e = R.eyes[n], happy = p.eyes === "happy";
      e.ball.visible = e.hi1.visible = e.hi2.visible = !happy; e.happy.visible = happy;
      e.ball.scale.y = blink ? .02 : .225; e.hi1.visible = e.hi2.visible = !happy && !blink;
      const up = p.eyes === "up" ? .05 : 0; e.ball.position.y = up; e.hi1.position.y = .07 + up; e.hi2.position.y = -.07 + up;
    });
    const talkish = p.mouth === "talk" || p.mouth === "o" || p.mouth === "open";
    R.smile.visible = p.mouth === "smile"; R.flat.visible = p.mouth === "flat"; R.open.visible = talkish;
    R.open.scale.set(p.mouth === "open" ? .1 : .075, .02 + .07 * p.open, .03);
    R.M.jet.opacity = p.jet * .45; R.jet.scale.setScalar(.8 + p.jet * .3);
    const pulse = 1 + Math.max(0, s(t * 4)) * .12; R.bulb.scale.setScalar(pulse); R.halo.scale.setScalar(pulse * (1 + Math.max(0, s(t * 4)) * .2));
  }

  // one character to put in your own scene (for a whole team walking around)
  function character(o) {
    o = o || {};
    const R = build(o);
    if (o.scale) R.root.scale.setScalar(o.scale);
    if (o.bulb) { const col = new T.Color(o.bulb).convertSRGBToLinear(); R.M.bulb.color.copy(col); R.M.bulb.emissive.copy(col);
      R.M.halo.color.copy(col).lerp(new T.Color(0xffffff), .35); }
    const st = { act: "idle", t0: 0, cur: null, face: o.heading || 0 };
    return {
      R, root: R.root,
      act() { return st.act; },
      set(act, now) { if (act !== st.act) { st.act = act; st.t0 = now; } },
      update(now, heading) {
        const t = (now - st.t0) / 1000, tgt = pose(st.act, t, { facing: 0 });
        st.cur = mixPose(st.cur, tgt, .2);
        for (const k in tgt) if (typeof tgt[k] === "string" || (tgt[k] && typeof tgt[k] === "object" && !("side" in tgt[k]) && !Array.isArray(tgt[k]))) st.cur[k] = tgt[k];
        st.face = lerpA(st.face, heading == null ? st.face : heading, .15); st.cur.face = st.face;
        applyPose(R, st.cur, t);
      }
    };
  }

  function create(canvas, opts) {
    opts = opts || {};
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: !!opts.preserve, premultipliedAlpha: false });
    renderer.setPixelRatio(opts.pixelRatio || window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = opts.shadow !== false; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(opts.fov || 27, 1, .1, 100);
    cam.position.set(0, 2.55, 10.4); cam.lookAt(0, 1.95, 0);
    scene.add(new T.HemisphereLight(0xffffff, 0x3b4a66, .78));
    const key = new T.DirectionalLight(0xffffff, 1.2); key.position.set(-2, 8, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -3, right: 3, top: 5, bottom: -1, near: 1, far: 20 });
    key.shadow.radius = 4; scene.add(key);
    const rim = new T.DirectionalLight(0x9fe8ff, .85); rim.position.set(4, 3.5, -5); scene.add(rim);
    const fill = new T.DirectionalLight(0xffe4ef, .35); fill.position.set(5, 1, 4); scene.add(fill);
    const ground = new T.Mesh(new T.PlaneGeometry(8, 8), new T.ShadowMaterial({ opacity: opts.shadowOpacity == null ? .28 : opts.shadowOpacity }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.visible = opts.ground !== false; scene.add(ground);
    const R = build(); scene.add(R.root);
    const st = { act: "idle", t0: performance.now(), facing: 0, talking: false, look: [0, 0], cur: null, colour: "#2cc3d6" };

    function lerp(a, b, k) { return a + (b - a) * k; }
    function mix(cur, tgt, k) {
      if (!cur) return JSON.parse(JSON.stringify(tgt));
      for (const key in tgt) {
        const v = tgt[key];
        if (typeof v === "number") cur[key] = lerp(cur[key], v, k);
        else if (Array.isArray(v)) cur[key] = v.map((x, i) => lerp(cur[key][i], x, k));
        else if (v && typeof v === "object" && "side" in v) for (const q in v) cur[key][q] = lerp(cur[key][q], v[q], k);
        else cur[key] = v;
      }
      return cur;
    }
    function apply(p, t) { applyPose(R, p, t); }
    function setColour(hex) {
      st.colour = hex; const col = new T.Color(hex);
      col.convertSRGBToLinear(); R.M.bulb.color.copy(col); R.M.bulb.emissive.copy(col); R.M.halo.color.copy(col).lerp(new T.Color(0xffffff), .35);
    }
    function size(w, h) { renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    function frame(now) {
      const t = (now - st.t0) / 1000;
      const tgt = pose(st.act, t, st);
      st.cur = mix(st.cur, tgt, opts.smooth == null ? .22 : opts.smooth);
      for (const key in tgt) if (typeof tgt[key] === "string" || (tgt[key] && typeof tgt[key] === "object" && !("side" in tgt[key]) && !Array.isArray(tgt[key]))) st.cur[key] = tgt[key];
      st.cur.face = lerp(st.cur.face, st.facing, .12);
      apply(st.cur, t);
      renderer.render(scene, cam);
    }
    function shot(act, t, facing, extra) {               // deterministic still (for making laptop frames)
      const p = pose(act, t, Object.assign({ facing, look: [0, 0] }, extra || {}));
      p.face = facing; apply(p, t); renderer.render(scene, cam);
    }
    function headPos() {                                   // where the antenna bulb is on screen (0..1)
      R.root.updateMatrixWorld(true);
      const v = new T.Vector3(); R.bulb.getWorldPosition(v); v.project(cam);
      const h = new T.Vector3(); R.head.getWorldPosition(h); h.project(cam);
      return { bulb: [(v.x + 1) / 2, (1 - v.y) / 2], head: [(h.x + 1) / 2, (1 - h.y) / 2] };
    }
    const api = {
      set(o) { if (o.act && o.act !== st.act) { st.act = o.act; st.t0 = performance.now(); }
        if (o.facing != null) st.facing = o.facing; if (o.talking != null) st.talking = o.talking;
        if (o.look) st.look = o.look; if (o.colour && o.colour !== st.colour) setColour(o.colour); },
      size, frame, shot, headPos, setColour, renderer, scene, camera: cam, parts: R, state: st,
      start() { const loop = n => { frame(n); api.raf = requestAnimationFrame(loop); }; api.raf = requestAnimationFrame(loop); },
      stop() { cancelAnimationFrame(api.raf); }
    };
    const w = canvas.clientWidth || canvas.width || 300, h = canvas.clientHeight || canvas.height || 400;
    size(w, h);
    return api;
  }
  window.LDF3D = { create, pose, character };
})();
