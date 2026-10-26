/* jf.hobby: gedeelde basis (inloggen via jf-core, projecten opslaan in de jf.drive-opslag) */
(function () {
  'use strict';
  var LOGO = '<svg viewBox="0 0 220 220" class="jc-logo"><defs><linearGradient id="jcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4fa3"/><stop offset=".2" stop-color="#8b5cf6"/><stop offset=".4" stop-color="#3b82f6"/><stop offset=".6" stop-color="#22c55e"/><stop offset=".8" stop-color="#facc15"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs><rect width="220" height="220" rx="48" fill="#15161a"/><g transform="translate(110 110)"><path d="M0-62L54-31V31L0 62-54 31V-31Z" fill="none" stroke="url(#jcg)" stroke-width="12" stroke-linejoin="round"/><path d="M0-62V0M0 0L54 31M0 0L-54 31" stroke="url(#jcg)" stroke-width="7" stroke-linecap="round" opacity=".85"/><circle r="12" fill="#fff"/></g></svg>';

  var TOOLS = [
    { key: 'design', name: 'Design', color: '#ff4fa3', url: 'design.html', desc: 'Posts, posters, thumbnails en flyers', ext: 'Canva-stijl' },
    { key: 'code', name: 'Code', color: '#22c55e', url: 'code.html', desc: 'HTML, CSS en JavaScript met live voorbeeld', ext: 'Code-editor' },
    { key: 'beats', name: 'Beats', color: '#f97316', url: 'beats.html', desc: 'Drums, synths en melodieën maken', ext: 'Muziekmaker' },
    { key: 'cad', name: '3D', color: '#8b5cf6', url: 'cad.html', desc: '3D-modellen bouwen en exporteren naar STL', ext: '3D-ontwerp' },
    { key: 'pixel', name: 'Pixel', color: '#3b82f6', url: 'pixel.html', desc: 'Pixel-art en sprites met animatie', ext: 'Pixel-editor' },
    { key: 'game', name: 'Game', color: '#eab308', url: 'game.html', desc: 'Je eigen platformgame bouwen en spelen', ext: 'Game-maker' }
  ];
  var ICO = {
    design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>',
    beats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    cad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/></svg>',
    pixel: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1" opacity=".5"/></svg>',
    game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r=".6" fill="currentColor"/><circle cx="18" cy="13.5" r=".6" fill="currentColor"/></svg>'
  };

  var CSS = [
    '.jc-logo{width:30px;height:30px;display:block;border-radius:22%}',
    'header.top{gap:10px}',
    'header.top .brand b{font-weight:650;color:var(--accent)}',
    '.jc-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;background:var(--tint);color:var(--accent);font-size:12px;font-weight:650}',
    '.jc-pill svg{width:14px;height:14px}',
    '.jc-title{height:32px;border:1px solid transparent;background:transparent;border-radius:8px;padding:0 9px;font-size:15px;font-weight:600;min-width:80px;max-width:320px;outline:none;color:var(--text)}',
    '.jc-title:hover{border-color:var(--line)}.jc-title:focus{border-color:var(--accent);background:var(--bg)}',
    '.jc-av{width:32px;height:32px;border-radius:50%;background:var(--accent);color:var(--onacc);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;cursor:pointer;border:0}',
    '.jc-tools{display:flex;align-items:center;gap:6px}',
    '@media(max-width:760px){.jc-title{max-width:120px}.jc-hide-s{display:none!important}}'
  ].join('\n');

  var lc = 0;
  function logo() { lc++; return LOGO.replace(/jcg/g, 'jcg' + lc); }
  var JC = window.JC = {
    tools: TOOLS, ico: ICO, logo: logo, project: null, dirty: false, saving: false, getData: null, getThumb: null, onTitle: null,
    tool: function (k) { return TOOLS.filter(function (t) { return t.key === k; })[0]; }
  };
  function root() { return JF.user.id + '/jimcreation'; }
  function store() { return JF.sb.storage.from('drive'); }
  function path(type, id) { return root() + '/' + type + '/' + id + '.json'; }
  JC.path = path;
  function blob(o) { return new Blob([typeof o === 'string' ? o : JSON.stringify(o)], { type: 'application/json' }); }
  function put(p, o) {
    return store().upload(p, blob(o), { upsert: true, contentType: 'application/json', cacheControl: '0' }).then(function (r) {
      if (!r.error) return r;
      return store().remove([p]).then(function () { return store().upload(p, blob(o), { contentType: 'application/json', cacheControl: '0' }); });
    });
  }
  function getPlain(p) { return store().download(p).then(function (r) { if (r.error) throw r.error; return r.data.text(); }).then(function (t) { return JSON.parse(t); }); }

  /* ---------- index ---------- */
  var indexCache = null;
  JC.list = function () {
    return getPlain(root() + '/index.json').then(function (x) { indexCache = Array.isArray(x) ? x : []; return indexCache; }).catch(function () { indexCache = []; return indexCache; });
  };
  function writeIndex(fn) {
    return JC.list().then(function (l) { l = fn(l.slice()) || l; indexCache = l; return put(root() + '/index.json', l).then(function (r) { if (r.error) throw r.error; return l; }); });
  }
  JC.load = function (type, id) { return getPlain(path(type, id)); };
  JC.save = function (type, id, title, data, thumb) {
    var now = new Date().toISOString();
    return put(path(type, id), { v: 1, type: type, id: id, title: title, updated: now, data: data }).then(function (r) {
      if (r.error) throw r.error;
      return writeIndex(function (l) {
        var e = l.filter(function (x) { return x.id === id; })[0];
        if (!e) { e = { id: id, type: type, created: now }; l.unshift(e); }
        e.title = title; e.updated = now; if (thumb) e.thumb = thumb;
        return l;
      });
    });
  };
  JC.remove = function (type, id) {
    return store().remove([path(type, id)]).then(function () { return writeIndex(function (l) { return l.filter(function (x) { return x.id !== id; }); }); });
  };
  JC.rename = function (type, id, title) {
    return JC.load(type, id).then(function (p) { p.title = title; return put(path(type, id), p); }).then(function () {
      return writeIndex(function (l) { l.forEach(function (x) { if (x.id === id) x.title = title; }); return l; });
    });
  };
  JC.duplicate = function (e) {
    return JC.load(e.type, e.id).then(function (p) { return JC.save(e.type, JF.uid(), (e.title || 'Naamloos') + ' (kopie)', p.data, e.thumb); });
  };
  JC.shareUrl = function (type, id) {
    return store().createSignedUrl(path(type, id), 60 * 60 * 24 * 365).then(function (r) { if (r.error) throw r.error; return r.data.signedUrl; });
  };

  /* ---------- in een tool ---------- */
  function setStatus(t) { var s = JF.$('status'); if (s) s.textContent = t; }
  JC.status = setStatus;
  var saveTimer = null;
  JC.changed = function () {
    if (!JC.project) return;
    JC.dirty = true; setStatus('Niet opgeslagen');
    clearTimeout(saveTimer); saveTimer = setTimeout(JC.saveNow, 1500);
  };
  JC.saveNow = function () {
    clearTimeout(saveTimer);
    if (!JC.project || !JC.getData) return Promise.resolve();
    if (JC.saving) { saveTimer = setTimeout(JC.saveNow, 800); return Promise.resolve(); }
    JC.saving = true; JC.dirty = false; setStatus('Opslaan...');
    var data, thumb = null;
    try { data = JC.getData(); } catch (e) { JC.saving = false; setStatus('Opslaan lukte niet'); return Promise.resolve(); }
    var tp = Promise.resolve(null);
    try { if (JC.getThumb) tp = Promise.resolve(JC.getThumb()).catch(function () { return null; }); } catch (e) {}
    return tp.then(function (t) {
      thumb = t;
      return JC.save(JC.project.type, JC.project.id, JC.project.title, data, thumb);
    }).then(function () {
      JC.saving = false;
      if (JC.project.isNew) { JC.project.isNew = false; history.replaceState(null, '', location.pathname + '?id=' + JC.project.id); }
      setStatus(JC.dirty ? 'Niet opgeslagen' : 'Opgeslagen');
    }).catch(function (e) {
      JC.saving = false; JC.dirty = true;
      setStatus('Opslaan lukte niet');
      JF.toast('Opslaan lukte niet: ' + JF.vertaal(e && e.message));
    });
  };
  window.addEventListener('beforeunload', function (e) { if (JC.dirty || JC.saving) { JC.saveNow(); e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); JC.saveNow(); } });

  /* thumbnail van een canvas maken (max 320 breed) */
  JC.thumbFrom = function (canvas, bg) {
    var w = 320, h = Math.max(1, Math.round(320 * canvas.height / canvas.width));
    if (h > 240) { h = 240; w = Math.max(1, Math.round(240 * canvas.width / canvas.height)); }
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.fillStyle = bg || '#fff'; x.fillRect(0, 0, w, h); x.imageSmoothingEnabled = !canvas.dataset || canvas.dataset.pixel !== '1';
    x.drawImage(canvas, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.72);
  };

  /* kop met logo, titel, status, account */
  JC.header = function (toolKey, extra) {
    var t = JC.tool(toolKey);
    return '<header class="top"><a class="brand" href="../jf-office/" title="Naar jf.office">' + logo() + '<span class="jc-hide-s">jf.<b>hobby</b></span></a>' +
      (t ? '<span class="jc-pill">' + ICO[t.key] + t.name + '</span><input class="jc-title" id="jcTitle" spellcheck="false" aria-label="Naam van je project"><span id="status"></span>' : '') +
      '<div class="spacer"></div><div class="jc-tools">' + (extra || '') + '</div>' +
      '<button class="icon-btn themeBtn jc-hide-s"></button>' +
      '<details class="menu"><summary class="jc-av" id="jcAv">?</summary><div class="pop"><div class="info" id="jcWho"></div>' +
      '<a href="../jf-office/">jf.office startscherm</a><a href="./">Alle hobby-projecten</a><hr><button id="jcName">Naam wijzigen</button><button id="jcPw">Wachtwoord wijzigen</button><button id="jcOut">Uitloggen</button></div></details></header>';
  };
  JC.displayName = function () {
    var u = JF.user || {}, n = u.user_metadata && u.user_metadata.name; if (n) return n;
    var e = (u.email || '').split('@')[0]; return e ? e[0].toUpperCase() + e.slice(1) : '';
  };
  function wireHeader() {
    var n = JC.displayName();
    if (JF.$('jcAv')) JF.$('jcAv').textContent = (n || '?')[0].toUpperCase();
    if (JF.$('jcWho')) JF.$('jcWho').textContent = (n ? n + ' · ' : '') + ((JF.user.email || '').replace('@jimchat.app', ''));
    if (JF.$('jcOut')) JF.$('jcOut').onclick = function () { JC.saveNow().then(JF.logout); };
    if (JF.$('jcPw')) JF.$('jcPw').onclick = JF.changePassword;
    if (JF.$('jcName')) JF.$('jcName').onclick = function () {
      var v = prompt('Hoe mogen we je noemen?', JC.displayName()); if (v === null) return;
      JF.sb.auth.updateUser({ data: { name: v.trim() } }).then(function (r) { if (r.error) return alert(r.error.message); JF.user = r.data.user; wireHeader(); });
    };
    var ti = JF.$('jcTitle');
    if (ti && JC.project) {
      ti.value = JC.project.title;
      ti.oninput = function () { JC.project.title = ti.value.trim() || 'Naamloos'; document.title = JC.project.title + ' · jf.hobby'; JC.changed(); if (JC.onTitle) JC.onTitle(JC.project.title); };
      ti.onkeydown = function (e) { if (e.key === 'Enter') ti.blur(); };
      document.title = JC.project.title + ' · jf.hobby';
    }
  }

  /* opstarten
     opts: { tool, newTitle, onOpen(project|null, isNew), public(fn) } */
  JC.start = function (opts) {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    JF.icons.creation = logo().replace('class="jc-logo"', '');
    var qs = new URLSearchParams(location.search);
    if (opts.publicParam && qs.get(opts.publicParam)) {
      var b = JF.$('boot'); if (b) b.remove();
      JF.applyTheme(); opts.onPublic(qs.get(opts.publicParam)); return;
    }
    JF.start({
      app: 'creation', name: 'jf.hobby', tagline: 'Maak designs, code, beats, 3D-modellen, pixel-art en games.',
      onLogin: function () {
        var id = qs.get('id');
        var done = function (p, isNew) {
          JC.project = p; wireHeader();
          try { opts.onOpen(p, isNew); } catch (e) { console.error(e); JF.toast('Er ging iets mis bij het openen'); }
          setStatus(isNew ? '' : 'Opgeslagen');
        };
        if (!opts.tool) { wireHeader(); opts.onOpen(null); return; }
        if (id) {
          setStatus('Laden...');
          JC.load(opts.tool, id).then(function (p) { done({ type: opts.tool, id: id, title: p.title || 'Naamloos', data: p.data }, false); })
            .catch(function () { JF.toast('Dit project bestaat niet meer'); done({ type: opts.tool, id: JF.uid(), title: opts.newTitle || 'Naamloos', data: null, isNew: true }, true); });
        } else done({ type: opts.tool, id: JF.uid(), title: opts.newTitle || 'Naamloos', data: null, isNew: true }, true);
      },
      onLogout: function () { JC.project = null; }
    });
    /* inloggen met gebruikersnaam (jimchat) of e-mail */
    var em = JF.$('jfEmail');
    if (em) {
      em.type = 'text'; em.autocomplete = 'username'; em.placeholder = 'e-mail of gebruikersnaam';
      var lab = em.parentNode.querySelector('span'); if (lab) lab.textContent = 'E-mail of gebruikersnaam';
      JF.$('jfAuthForm').addEventListener('submit', function () {
        var v = em.value.trim(); if (v && v.indexOf('@') < 0) em.value = v.toLowerCase() + '@jimchat.app';
      }, true);
    }
  };

  /* ---------- hulpjes ---------- */
  JC.undo = function (getState, setState, limit) {
    var past = [], fut = [], last = null;
    return {
      reset: function () { past = []; fut = []; last = JSON.stringify(getState()); },
      push: function () { var s = JSON.stringify(getState()); if (s === last) return; if (last !== null) past.push(last); if (past.length > (limit || 80)) past.shift(); fut = []; last = s; },
      undo: function () { if (!past.length) return false; fut.push(last); last = past.pop(); setState(JSON.parse(last)); return true; },
      redo: function () { if (!fut.length) return false; past.push(last); last = fut.pop(); setState(JSON.parse(last)); return true; }
    };
  };
  JC.modal = function (html, cls) {
    var bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal ' + (cls || '') + '">' + html + '</div>';
    bg.addEventListener('mousedown', function (e) { if (e.target === bg) bg.remove(); });
    document.body.appendChild(bg);
    bg.close = function () { bg.remove(); };
    bg.querySelectorAll('[data-close]').forEach(function (b) { b.onclick = bg.close; });
    return bg;
  };
  JC.pickFile = function (accept, multiple) {
    return new Promise(function (res) {
      var i = document.createElement('input'); i.type = 'file'; i.accept = accept || ''; i.multiple = !!multiple;
      i.onchange = function () { res(Array.from(i.files || [])); }; i.click();
    });
  };
  JC.readImage = function (file, max) {
    max = max || 1600;
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var s = Math.min(1, max / Math.max(img.width, img.height)), w = Math.round(img.width * s), h = Math.round(img.height * s);
          if (/svg/.test(file.type) || (s === 1 && file.size < 400000 && !/heic/.test(file.type))) return res({ src: r.result, w: img.width || w, h: img.height || h });
          var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
          res({ src: /png|gif|webp/.test(file.type) ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86), w: w, h: h });
        };
        img.onerror = rej; img.src = r.result;
      };
      r.onerror = rej; r.readAsDataURL(file);
    });
  };
})();
