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
  const INK = new T.MeshBasicMaterial({ color: new T.Color(0x2a1a3d).convertSRGBToLinear(), side: T.BackSide });
  function ink(obj, t) {                               // a thin cartoon outline around a mesh (or every mesh in a group)
    const list = [];
    obj.traverse(m => { if (m.isMesh && !m.userData.ink) list.push(m); });
    list.forEach(m => {
      const o = new T.Mesh(m.geometry, INK); o.userData.ink = true;
      o.position.copy(m.position); o.quaternion.copy(m.quaternion); o.scale.copy(m.scale).multiplyScalar(1 + (t || .05));
      m.parent.add(o);
    });
    return obj;
  }
  let GLOW = null;
  function glowTex() {
    if (GLOW) return GLOW;
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g = cv.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.35, "rgba(255,255,255,.55)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    GLOW = new T.CanvasTexture(cv); return GLOW;
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
      halo: new T.SpriteMaterial({ map: glowTex(), color: 0x7fe7f2, transparent: true, opacity: .85, depthWrite: false }),
      jet: new T.MeshBasicMaterial({ color: 0xc6f03a, transparent: true, opacity: 0, depthWrite: false }),
    };
    const R = {};
    const root = new T.Group(), body = new T.Group();
    root.add(body);
    // legs + boots (purple left, cyan right)
    R.knees = [];
    R.legs = [[-1, M.purple], [1, M.cyan]].map(([k, bm]) => {
      const hip = new T.Group(); hip.position.set(.22 * k, .8, 0); body.add(hip);
      hip.add(ink(capsule(.13, .27, M.grey), .06));
      const knee = new T.Group(); knee.position.y = -.27; hip.add(knee); R.knees.push(knee);
      knee.add(ink(capsule(.125, .23, M.grey), .06));
      const boot = new T.Mesh(new T.SphereGeometry(.2, 26, 16), bm);
      boot.scale.set(1.15, .78, 1.5); boot.position.set(.02 * k, -.33, .09); boot.castShadow = true; knee.add(boot); ink(boot, .05);
      const shine = new T.Mesh(new T.SphereGeometry(.05, 12, 8), M.white2); shine.scale.set(1.4, .6, .6);
      shine.position.set(-.05, -.23, .3); shine.material = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5 });
      knee.add(shine);
      return hip;
    });
    // suit
    const prof = [[0, .62], [.4, .65], [.59, .82], [.645, 1.06], [.6, 1.34], [.42, 1.56], [0, 1.66]].map(p => new T.Vector2(p[0], p[1]));
    const torso = new T.Mesh(new T.LatheGeometry(prof, 48), o.suit ? mat(o.suit, { roughness: .42 }) : M.white); torso.castShadow = true; body.add(torso); ink(torso, .035);
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
      sh.add(ink(capsule(.115, .44, m), .07));
      const el = new T.Group(); el.position.y = -.44; el.rotation.order = "ZXY"; sh.add(el);
      el.add(ink(capsule(.105, .34, m), .07));
      const hand = new T.Group(); hand.position.y = -.47; el.add(hand);
      const cuff = new T.Mesh(new T.TorusGeometry(.105, .045, 10, 26), m); cuff.rotation.x = Math.PI / 2; cuff.position.y = .08; hand.add(cuff);
      const palm = new T.Mesh(new T.SphereGeometry(.17, 26, 18), M.glove); palm.scale.set(1, 1.06, .85); palm.castShadow = true; hand.add(palm); ink(palm, .06);
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
    const skull = new T.Mesh(new T.SphereGeometry(1, 56, 40), M.lime); head.scale.setScalar(.92); skull.castShadow = true; head.add(skull); ink(skull, .03);
    const face = new T.Group(); face.rotation.order = "YXZ"; head.add(face);
    const eyes = {};
    [["L", -1], ["R", 1]].forEach(([n, k]) => {
      const g = onSphere(new T.Group(), 17 * k, -6, 1.0); face.add(g);
      const ball = new T.Mesh(new T.SphereGeometry(1, 24, 18), M.dark); ball.scale.set(.185, .225, .08); g.add(ball);
      const hi1 = new T.Mesh(new T.SphereGeometry(.055, 12, 8), M.white2); hi1.position.set(-.05, .07, .07); g.add(hi1);
      const hi2 = new T.Mesh(new T.SphereGeometry(.024, 10, 8), M.white2); hi2.position.set(.06, -.07, .07); g.add(hi2);
      const happy = new T.Mesh(new T.TorusGeometry(.1, .026, 8, 20, Math.PI), M.dark); happy.position.set(0, -.04, .04); g.add(happy);
      const cheek = onSphere(new T.Mesh(new T.SphereGeometry(1, 16, 12), M.pink), 33 * k, -21, .985); cheek.scale.set(.15, .09, .03); face.add(cheek);
      const bg = onSphere(new T.Group(), 18 * k, 13, 1.0); face.add(bg);
      const brow = new T.Mesh(new T.TorusGeometry(.12, .03, 8, 16, 1.5), M.dark); brow.rotation.z = Math.PI / 2 - .75; bg.add(brow);
      eyes[n] = { g, ball, hi1, hi2, happy, bg, brow, k, cheek };
    });
    const mouthG = onSphere(new T.Group(), 0, -25, 1.0); face.add(mouthG);
    const smile = new T.Mesh(new T.TorusGeometry(.085, .022, 8, 20, Math.PI), M.dark); smile.rotation.z = Math.PI; smile.position.z = .01; mouthG.add(smile);
    const flat = new T.Mesh(new T.CylinderGeometry(.02, .02, .12, 10), M.dark); flat.rotation.z = Math.PI / 2; flat.position.z = .01; mouthG.add(flat);
    const open = new T.Mesh(new T.SphereGeometry(1, 20, 14), M.mouth); open.scale.set(.08, .06, .03); mouthG.add(open);
    // antenna with a glowing bulb (its colour shows which agent is working)
    const ant = new T.Group(); ant.position.set(0, .96, 0); head.add(ant);
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, 0, 0), new T.Vector3(-.08, .34, 0), new T.Vector3(.12, .52, 0));
    const stem = new T.Mesh(new T.TubeGeometry(curve, 24, .032, 8, false), M.stem); stem.castShadow = true; ant.add(stem);
    const bulb = new T.Mesh(new T.SphereGeometry(.12, 22, 16), M.bulb); bulb.position.set(.12, .54, 0); ant.add(bulb); ink(bulb, .08);
    const halo = new T.Sprite(M.halo); halo.scale.setScalar(.75); halo.position.copy(bulb.position); ant.add(halo);
    R.spring = { a: 0, v: 0, b: 0, w: 0, py: 0, pt: 0 };
    // jet glow under the boots when flying
    const jet = new T.Mesh(new T.CircleGeometry(.55, 32), M.jet); jet.rotation.x = -Math.PI / 2; jet.position.y = -.05; body.add(jet);
    Object.assign(R, { root, body, torso, neck, head, face, eyes, smile, flat, open, bulb, halo, jet, ant, M });
    return R;
  }

  // ---------- feelings: eyebrows (height, tilt), eye opening, smile (-1 frown .. 1 big smile), blush ----------
  const EMO = {
    neutral: [0, 0, 1, .55, .35], happy: [.03, -.05, 1, 1, .6], excited: [.07, -.12, 1.12, 1, .75], proud: [.02, -.18, .92, .85, .55],
    gentle: [.02, .12, .86, .7, .6], thinking: [.04, -.3, .9, .1, .3], concerned: [.03, .45, 1, -.35, .2], surprised: [.09, .05, 1.2, .2, .45],
    sad: [-.01, .55, .85, -.6, .15], calm: [0, .05, .84, .5, .4], listening: [.05, .1, 1.05, .35, .35],
  };
  const ACT_EMO = { wave: "happy", highfive: "excited", thumbs: "proud", love: "gentle", celebrate: "excited", think: "thinking", listen: "listening",
    shake: "concerned", nod: "happy", fly: "excited", hover: "happy", handshake: "happy", popup: "excited", assign: "proud", work: "thinking", scan: "thinking" };

  // ---------- poses ----------
  const A = (side, fwd, bend, ez) => ({ side, fwd, bend: bend || 0, ez: ez || 0 });
  function pose(act, t, o) {
    const p = {
      y: s(t * 2.2) * .015, face: o.facing || 0, lean: 0, pitch: 0, nod: 0, turn: 0, tilt: .1 + s(t * 1.3) * .045,
      L: A(9 + s(t * 1.6) * 3, 2, 10), R: A(9 - s(t * 1.6) * 3, 2, 10), legs: [0, 0], hands: { L: "mitt", R: "mitt" },
      eyes: "open", mouth: "smile", open: 0, jet: 0, look: o.look || [0, 0], knees: [4, 4], breath: s(t * 2.2)
    };
    const w = t * 7;
    switch (act) {
      case "walk": p.L = A(8, s(w) * 32, 18); p.R = A(8, -s(w) * 32, 18); p.legs = [-s(w) * 30, s(w) * 30];
        p.knees = [8 + Math.max(0, s(w)) * 48, 8 + Math.max(0, -s(w)) * 48];
        p.y = Math.abs(c(w)) * .06; p.tilt = .04; p.lean = 0; break;
      case "fly": case "hover": p.L = A(68, -22, 12); p.R = A(68, -22, 12); p.pitch = act === "fly" ? .22 : .06;
        p.legs = [-14, -8]; p.knees = [24 + s(t * 2.2) * 6, 34 - s(t * 2.2) * 6]; p.y = .12 + s(t * 2.2) * .06; p.jet = .75 + s(t * 14) * .15; p.eyes = "happy"; p.tilt = .04; break;
      case "popup": { const k = Math.min(1, t / .8), e = 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);
        p.y = -4.5 * (1 - e); if (t > .8) { p.L = A(128, 34, 0, 18 + s(t * 9) * 28); p.hands.L = "open"; p.eyes = "happy"; } break; }
      case "wave": p.L = A(128, 34, 0, 18 + s(t * 9) * 28); p.hands.L = "open"; p.eyes = "happy"; p.tilt = -.08; break;
      case "highfive": { const u = t % 1.8;
        if (u < .45) p.R = A(105, 0, 0, 65); else { p.R = A(140, 36, 0, 0); p.hands.R = "open"; p.eyes = "happy"; } p.tilt = .14; break; }
      case "thumbs": p.R = A(55, 15, 0, 115); p.hands.R = "thumb"; p.eyes = "happy"; p.tilt = .14; break;
      case "handshake": p.R = A(16, 62 + s(t * 10) * 7, 8); p.hands.R = "open"; p.tilt = .1; break;
      case "love": p.L = A(-36, 46, 102); p.R = A(-36, 46, 102); p.eyes = "happy"; p.tilt = .12 + s(t * 1.5) * .06; p.nod = .06; break;
      case "celebrate": { const j = Math.abs(s(t * 5)); p.L = A(152, 6, 0, -12 + s(t * 10) * 10); p.R = A(152, 6, 0, -12 - s(t * 10) * 10);
        p.hands.L = p.hands.R = "open"; p.y = j * .38; p.legs = [j * 18, j * 18]; p.knees = [8 + j * 50, 8 + j * 50]; p.eyes = "happy"; p.mouth = "open"; p.open = 1; break; }
      case "nod": p.nod = Math.max(0, s(t * 7)) * .26; p.eyes = "happy"; break;
      case "shake": p.turn = s(t * 10) * .35; p.tilt = s(t * 10) * .06; p.mouth = "flat"; break;
      case "listen": p.R = A(122, 4, 8, 100); p.hands.R = "open"; p.tilt = -.16; p.mouth = "o"; p.open = .55; break;
      case "think": p.L = A(-22, 58, 138); p.tilt = .18; p.nod = -.06; p.eyes = "up"; p.mouth = "flat"; p.look = [-.3, -.6]; break;
      case "talk": p.L = A(18 + s(t * 3) * 8, 30, 45 + s(t * 3.3) * 25); p.R = A(16 + s(t * 2.6) * 8, 26, 38 + s(t * 2.9) * 22);
        p.hands.L = p.hands.R = "open"; p.mouth = "talk"; p.open = .25 + Math.abs(s(t * 13)) * .75; break;
      case "carry": case "carrywalk":                       // holding a parcel / book / card in front
        p.L = A(-16, 64, 36); p.R = A(-16, 64, 36); p.eyes = "happy";
        if (act === "carrywalk") { p.legs = [-s(w) * 28, s(w) * 28]; p.knees = [8 + Math.max(0, s(w)) * 42, 8 + Math.max(0, -s(w)) * 42]; p.y = Math.abs(c(w)) * .05; } break;
      case "work": p.L = A(12, 48 + s(t * 9) * 9, 52); p.R = A(12, 48 - s(t * 9) * 9, 52); p.nod = .12; p.mouth = "flat"; break;
      case "point": p.R = A(84, 28, 6, 0); p.hands.R = "open"; p.mouth = "talk"; p.open = .25 + Math.abs(s(t * 11)) * .6; p.tilt = -.06; break;
      case "scan": p.turn = s(t * 1.6) * .55; p.R = A(120, 30, 0, 95); p.hands.R = "open"; p.eyes = "open"; break;
      case "assign": { const u = t % 1.6;                      // tosses a task to another agent
        if (u < .5) p.R = A(58, -40, 70); else { p.R = A(38, 82, 0); p.hands.R = "open"; } p.eyes = "happy"; p.tilt = .08; break; }
    }
    const e = EMO[o.emo] || EMO[ACT_EMO[act]] || EMO.neutral;
    [p.browY, p.browTilt, p.eyeOpen, p.smile, p.blush] = e;
    if ((o.emo === "excited" || o.emo === "proud") && p.eyes === "open" && act !== "think") p.eyes = "happy";
    if (o.emo === "concerned" || o.emo === "sad") { if (p.eyes === "happy") p.eyes = "open"; if (p.mouth === "smile") p.mouth = "curve"; }
    if (p.mouth === "smile") p.mouth = "curve";
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
    if (R.knees && p.knees) R.knees.forEach((k, i) => { k.rotation.x = p.knees[i] * D; });
    if (R.torso) R.torso.scale.set(1 + (p.breath || 0) * .008, 1 + (p.breath || 0) * .014, 1 + (p.breath || 0) * .008);
    // springy antenna: it lags behind when LDF moves, then wobbles back
    if (R.spring) { const S = R.spring, push = (p.y - S.py) * 9 + (p.tilt - S.pt) * 3 + (p.turn || 0) * .4;
      S.py = p.y; S.pt = p.tilt; S.v += (-push * .35 - S.a) * .18; S.v *= .82; S.a += S.v; S.a = Math.max(-.6, Math.min(.6, S.a));
      R.ant.rotation.z = S.a * .9; R.ant.rotation.x = S.a * .35; }
    const blink = p.eyes === "open" && (p.blink != null ? p.blink : (performance.now() % 4100) < 120);
    ["L", "R"].forEach(n => {
      const e = R.eyes[n], happy = p.eyes === "happy";
      e.ball.visible = e.hi1.visible = e.hi2.visible = !happy; e.happy.visible = happy;
      const open = p.eyeOpen == null ? 1 : p.eyeOpen;
      e.ball.scale.y = blink ? .02 : .225 * open; e.ball.scale.x = .185 * (open > 1 ? open : 1); e.hi1.visible = e.hi2.visible = !happy && !blink;
      if (e.brow) { e.brow.position.y = (p.browY || 0) * 1.2;
        e.brow.rotation.z = Math.PI / 2 - .75 + e.k * (p.browTilt || 0) * -.9; }
      if (e.cheek) e.cheek.material.opacity = .25 + (p.blush || 0) * .45;
      const up = p.eyes === "up" ? .05 : 0; e.ball.position.y = up; e.hi1.position.y = .07 + up; e.hi2.position.y = -.07 + up;
    });
    const talkish = p.mouth === "talk" || p.mouth === "o" || p.mouth === "open";
    const curve = p.mouth === "curve" || p.mouth === "smile", sm = p.smile == null ? .7 : p.smile;
    R.smile.visible = curve && Math.abs(sm) > .12; R.flat.visible = p.mouth === "flat" || (curve && Math.abs(sm) <= .12); R.open.visible = talkish;
    if (R.smile.visible) { R.smile.scale.set(.85 + Math.abs(sm) * .25, Math.sign(sm) * (.35 + Math.abs(sm) * .75), 1); R.smile.position.y = sm < 0 ? -.03 : 0; }
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
    const st = { act: "idle", t0: performance.now(), facing: 0, talking: false, look: [0, 0], cur: null, colour: "#2cc3d6", emo: null, mouth: 0, mouthAt: 0, env: null };

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
      // lip-sync: a live loudness level, or a loudness track played against the clock
      let lv = null;
      if (st.env) { const i = Math.floor((now - st.env.t0) / 1000 * st.env.fps);
        if (i >= 0 && i < st.env.v.length) lv = st.env.v[i]; else if (i >= st.env.v.length) st.env = null; }
      if (lv == null && now - st.mouthAt < 220) lv = st.mouth;
      if (lv != null) { st.cur.mouth = lv > .06 ? "talk" : "curve"; st.cur.open = Math.min(1, lv * 1.3); }
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
        if (o.look) st.look = o.look; if (o.colour && o.colour !== st.colour) setColour(o.colour);
        if (o.emo !== undefined) st.emo = o.emo;
        if (o.mouth != null) { st.mouth = o.mouth; st.mouthAt = performance.now(); } },
      // play a loudness track (numbers 0..1, fps per second) so the mouth follows real speech
      lipSync(values, fps, startAt) { st.env = values && values.length ? { v: values, fps: fps || 30, t0: startAt == null ? performance.now() : startAt } : null; },
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
