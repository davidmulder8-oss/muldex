(function () {
  // Een korte entree van de bovenkant
  void document.body.offsetWidth;
  document.body.classList.add('is-in');

  // Menu op de telefoon
  var btn = document.querySelector('.menu-btn');
  var links = document.getElementById('menu');
  if (btn && links) {
    var label = btn.querySelector('.lbl');
    var setOpen = function (open) {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Sluiten' : 'Menu';
    };
    btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
  }

  // Projecten filteren
  var chips = document.querySelectorAll('.chip');
  var count = document.getElementById('count');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      var shown = 0;
      document.querySelectorAll('.project').forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-cat') === f;
        p.hidden = !show;
        if (show) shown++;
      });
      if (count) count.textContent = shown + (shown === 1 ? ' project getoond' : ' projecten getoond');
    });
  });

  // Live demo van klantwebsites
  var tabs = document.querySelectorAll('.tab');
  if (tabs.length) {
    var frame = document.getElementById('demo-frame');
    var fallback = document.getElementById('demo-fallback');
    var img = document.getElementById('demo-img');
    var note = document.getElementById('demo-note');
    var title = document.getElementById('demo-title');
    var show = function (t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
      });
      var name = t.textContent;
      title.textContent = name;
      if (t.hasAttribute('data-src')) {
        fallback.hidden = true;
        frame.hidden = false;
        frame.title = 'Live voorbeeld van ' + name;
        if (window.muldexMayEmbed && !window.muldexMayEmbed()) { frame.dataset.pending = t.getAttribute('data-src'); } else { frame.src = t.getAttribute('data-src'); }
      } else {
        frame.hidden = true;
        frame.src = 'about:blank';
        img.src = t.getAttribute('data-img');
        img.alt = 'Schermafbeelding van ' + name;
        note.textContent = t.getAttribute('data-note');
        fallback.hidden = false;
      }
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return;
        n = (n + tabs.length) % tabs.length;
        tabs[n].focus();
        show(tabs[n]);
        e.preventDefault();
      });
    });
  }
})();

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typmachine
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var words = el.getAttribute('data-words').split(',');
    if (reduce) { el.textContent = words[0]; return; }
    var wi = 0, ci = 0, del = false;
    (function tick() {
      var w = words[wi];
      el.textContent = w.slice(0, ci);
      if (!del && ci === w.length) { del = true; return setTimeout(tick, 1600); }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
      ci += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 85);
    })();
  });

  // Verschijnen bij scrollen
  if (reduce || !('IntersectionObserver' in window)) return;
  var sel = 'section:not(.hero) .section-head, .service, .plan, .help, .steps li, .feature, .phones figure, .route li, .project, .values > div, .rows li, .demo .tabs, .demo .window, .closing-inner > *, .contact > *, .partners h2';
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('shown');
      io.unobserve(el);
      // Daarna weer vrijgeven, zodat de hover-beweging werkt
      setTimeout(function () { el.classList.remove('reveal', 'shown'); }, 900);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll(sel).forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--d', Math.min(i, 5) * 60 + 'ms');
    el.classList.add('reveal');
    io.observe(el);
  });
})();

// Balken bij "Wat ik kan" vullen zich als ze in beeld komen
(function () {
  var bars = document.querySelectorAll('.bar');
  if (!bars.length) return;
  if (!('IntersectionObserver' in window)) { bars.forEach(function (b) { b.classList.add('on'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  bars.forEach(function (b) { io.observe(b); });
})();

// Filmpje in de hero: geluid aan/uit en stil bij minder beweging
(function () {
  var v = document.getElementById('hero-video');
  var b = document.querySelector('.sound-btn');
  if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; if (b) b.hidden = true; }
  if (b) b.addEventListener('click', function () {
    v.muted = !v.muted;
    if (!v.muted) v.play();
    b.setAttribute('aria-pressed', String(!v.muted));
    b.textContent = v.muted ? 'Geluid aan' : 'Geluid uit';
  });
})();

// Carrousel met werk
(function () {
  var track = document.querySelector('.case-track');
  if (!track) return;
  document.querySelectorAll('.round-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = track.querySelector('.case');
      var step = card ? card.getBoundingClientRect().width + 24 : 400;
      track.scrollBy({ left: step * Number(btn.getAttribute('data-dir')), behavior: 'smooth' });
    });
  });
})();

// Cookies: alleen noodzakelijk, of ook externe inhoud (de live demo's van klantwebsites)
(function () {
  var KEY = 'muldex-cookies';
  var get = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var set = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
  window.muldexMayEmbed = function () { return get() === 'all'; };

  var frame = document.getElementById('demo-frame');
  var loadDemo = function () {
    if (!frame) return;
    var gate = document.querySelector('.demo-consent');
    if (gate) gate.remove();
    frame.style.display = '';
    var src = frame.dataset.pending || frame.getAttribute('data-first');
    if (src && !frame.hidden) frame.src = src;
  };

  var box = null;
  var hide = function () {
    if (!box) return;
    var b = box;
    box = null;
    b.classList.remove('show');
    setTimeout(function () { b.remove(); }, 300);
  };
  var show = function () {
    if (box) return;
    box = document.createElement('div');
    box.className = 'cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'cookie-h');
    box.innerHTML =
      '<div class="cookie-top"><span class="cookie-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/></svg></span><h2 id="cookie-h">Cookies</h2></div>' +
      '<p>Muldex plaatst zelf geen tracking cookies. Alleen de live demo’s van klantwebsites kunnen cookies plaatsen. Kies wat je goed vindt. <a href="privacy.html">Lees de privacyverklaring</a></p>' +
      '<div class="cookie-actions"><button type="button" class="deny">Alleen noodzakelijk</button><button type="button" class="accept">Alles toestaan</button></div>';
    document.body.appendChild(box);
    void box.offsetWidth;
    box.classList.add('show');
    box.querySelector('.deny').addEventListener('click', function () { set('necessary'); hide(); });
    box.querySelector('.accept').addEventListener('click', function () { set('all'); hide(); loadDemo(); });
  };

  if (frame) {
    if (window.muldexMayEmbed()) {
      loadDemo();
    } else {
      var gate = document.createElement('div');
      gate.className = 'demo-consent';
      gate.innerHTML = '<p>De live demo laat de echte websites van klanten zien. Die websites kunnen hun eigen cookies plaatsen.</p><button type="button" class="btn btn-primary">Toon live demo’s</button>';
      frame.parentNode.insertBefore(gate, frame);
      frame.style.display = 'none';
      gate.querySelector('button').addEventListener('click', function () { set('all'); hide(); loadDemo(); });
    }
  }

  if (!get()) setTimeout(show, 600);
  document.querySelectorAll('.cookie-link').forEach(function (l) { l.addEventListener('click', show); });
})();

// Telefoonmenu: pagina scrolt niet mee zolang het menu open is
(function () {
  var btn = document.querySelector('.menu-btn');
  if (!btn) return;
  new MutationObserver(function () {
    document.body.classList.toggle('menu-open', btn.getAttribute('aria-expanded') === 'true');
  }).observe(btn, { attributes: true, attributeFilter: ['aria-expanded'] });
})();

// Bovenbalk krijgt pas een donkere tint als je scrolt
(function () {
  var h = document.querySelector('.site-header');
  if (!h) return;
  var on = function () { h.classList.toggle('is-scrolled', window.scrollY > 8); };
  on();
  window.addEventListener('scroll', on, { passive: true });
})();
