// Muldex prijscalculator (gebruikt op prijs.html en de homepage)
(function () {
  // Prijzen in euro, exclusief btw. De basis is altijd een pakket (Start, Pro of Premium).
  var PACK = [
    { n: 'Start', p: 189, inc: ['Website op één pagina', 'Werkt op elke telefoon', 'Contactformulier', 'Basis-SEO'] },
    { n: 'Pro', p: 289, inc: ['Website tot 6 pagina’s', 'Eigen ontwerp', 'SEO-optimalisatie', 'Google Bedrijfsprofiel', 'Ondersteuning'] },
    { n: 'Premium', p: 399, inc: ['Maatwerk website of webshop', 'Premium ontwerp van hoge kwaliteit', 'Doorlopende ondersteuning', 'Wekelijks onderhoud'] }
  ];
  // pk = welk pakket minimaal nodig is (0 Start, 1 Pro, 2 Premium); p = extra eenmalig; m = per maand
  var Q = [
    { id: 'soort', q: 'Wat voor website heb je nodig?', hint: 'Kies wat het beste past. Twijfel je? Kies dan de tweede.', opts: [
      { t: 'Website op één pagina', d: 'Wie je bent, wat je doet en hoe je contact opneemt', pk: 0 },
      { t: 'Website tot 6 pagina’s', d: 'Bijvoorbeeld home, over ons, diensten, menu en contact', pk: 1 },
      { t: 'Grotere website', d: 'Meer dan 6 pagina’s met veel diensten of informatie', pk: 2 },
      { t: 'Webshop', d: 'Producten verkopen met winkelwagen en online betalen', pk: 2 } ] },
    { id: 'design', q: 'Hoe uniek moet het ontwerp zijn?', hint: 'Elke website maak ik zelf, maar hoe ver gaan we?', opts: [
      { t: 'Strak en eenvoudig', d: 'Een net, modern ontwerp in jouw kleuren', pk: 0 },
      { t: 'Eigen ontwerp', d: 'Een ontwerp dat past bij jouw zaak en klanten', pk: 1 },
      { t: 'Premium maatwerk', d: 'Volledig op maat, met extra aandacht voor elk detail', pk: 2 } ] },
    { id: 'functies', multi: true, q: 'Wat wil je er nog meer op?', hint: 'Kies er zoveel als je wilt, of geen. Een contactformulier zit er altijd bij.', opts: [
      { t: 'Reserveren of afspraken maken', d: 'Klanten boeken direct via je website', p: 15 },
      { t: 'Menukaart of prijslijst', d: 'Je aanbod overzichtelijk op een rij', p: 10 },
      { t: 'Fotogalerij of portfolio', d: 'Je werk, zaak of producten mooi in beeld', p: 5 },
      { t: 'Reviews van klanten', d: 'Laat zien wat klanten van je vinden', p: 5 },
      { t: 'Sociale media en Google Maps', d: 'Je Instagram, Facebook en route op je website', p: 5 },
      { t: 'WhatsApp-knop', d: 'Klanten sturen je met één tik een bericht', p: 5 },
      { t: 'Veelgestelde vragen', d: 'Antwoorden op wat klanten vaak vragen', p: 5 },
      { t: 'Offerte- of aanvraagformulier', d: 'Klanten vragen direct een offerte bij jou aan', p: 10 },
      { t: 'Nieuwsberichten', d: 'Zelf berichten en acties plaatsen', p: 10 },
      { t: 'Inschrijven voor nieuwsbrief', d: 'Bouw een lijst op met vaste klanten', p: 10 },
      { t: 'Vacatures', d: 'Laat zien dat je personeel zoekt', p: 10 },
      { t: 'Meerdere talen', d: 'Bijvoorbeeld Nederlands en Engels', p: 20 },
      { t: 'Online betalen', d: 'Betalen met iDEAL bij een bestelling of reservering', p: 20 } ] },
    { id: 'huisstijl', q: 'Heb je al een logo en huisstijl?', hint: 'Een herkenbare stijl maakt je website sterker.', opts: [
      { t: 'Ja, dat heb ik al', d: 'Ik gebruik jouw logo en kleuren', p: 0 },
      { t: 'Ik heb een logo nodig', x: 'Nieuw logo', d: 'Een nieuw logo voor je zaak', p: 25 },
      { t: 'Complete huisstijl', d: 'Logo, kleuren, lettertypes en visitekaartje', p: 45 } ] },
    { id: 'content', q: 'Wie zorgt voor de teksten en foto’s?', hint: 'Goede teksten helpen ook om gevonden te worden.', opts: [
      { t: 'Die lever ik zelf aan', d: 'Ik zet ze netjes op je website', p: 0 },
      { t: 'Hulp bij de teksten', d: 'Ik schrijf de teksten met jouw input', p: 15 },
      { t: 'Teksten en foto’s', d: 'Teksten en beeld, helemaal geregeld', p: 30 } ] },
    { id: 'seo', q: 'Hoe belangrijk is gevonden worden in Google?', hint: 'Basis-SEO zit altijd in de prijs.', opts: [
      { t: 'Basis is genoeg', d: 'Goede titels, een snelle website en vindbaar in Google', p: 0 },
      { t: 'Beter gevonden worden in de buurt', d: 'SEO-optimalisatie en een Google Bedrijfsprofiel', seo: 1 } ] },
    { id: 'onderhoud', q: 'Wil je maandelijks onderhoud?', hint: 'Dit is een bedrag per maand, los van de eenmalige prijs. Je zit nergens lang aan vast.', opts: [
      { t: 'Nee, ik regel het zelf', d: 'Je krijgt alle bestanden mee', m: 0 },
      { t: 'Maandelijks onderhoud', d: 'Hosting, updates, back-ups en kleine aanpassingen', m: 9 },
      { t: 'Wekelijks onderhoud', d: 'Elke week een controle, aanpassingen en snel antwoord', m: 15 } ] }
  ];
  var SEO_START = 15;
  var MAX = 399;    // normaal betaal je eenmalig nooit meer dan dit
  var RUIMTE = 475; // pas boven dit ruwe bedrag (heel veel wensen) gaat de prijs verder omhoog // extra voor SEO-optimalisatie bij Start (bij Pro en Premium zit het erin)
  var A = {}, i = 0;
  var body = document.getElementById('calc-body'), count = document.getElementById('calc-count'), fill = document.getElementById('calc-fill');
  var back = document.getElementById('calc-back'), next = document.getElementById('calc-next'), top = document.querySelector('.calc-top');
  var eur = function (n) { return '€ ' + n.toLocaleString('nl-NL'); };
  var pack = function () { return Math.max(A.soort != null ? Q[0].opts[A.soort].pk : 0, A.design != null ? Q[1].opts[A.design].pk : 0); };
  // Bij Premium zit wekelijks onderhoud erin: die vraag slaan we dan over
  var skip = function (s) { return s.id === 'onderhoud' && pack() === 2; };
  var list = function () { return Q.filter(function (s) { return !skip(s); }); };

  function show() {
    if (i < Q.length && skip(Q[i])) { i++; }
    if (i >= Q.length) return result();
    var s = Q[i], cur = A[s.id], L = list(), n = L.indexOf(s);
    top.hidden = false;
    count.textContent = 'Vraag ' + (n + 1) + ' van ' + L.length;
    fill.style.width = (n / L.length * 100) + '%';
    body.innerHTML = '<h2 class="calc-q" tabindex="-1">' + s.q + '</h2><p class="calc-hint">' + s.hint + '</p><div class="calc-opts' + (s.multi ? ' multi' : '') + '" role="group">' +
      s.opts.map(function (o, k) {
        var on = s.multi ? (cur || []).indexOf(k) > -1 : cur === k;
        return '<button type="button" class="calc-opt" aria-pressed="' + on + '" data-k="' + k + '"><span class="calc-mark" aria-hidden="true"></span><span><b>' + o.t + '</b><small>' + o.d + '</small></span></button>';
      }).join('') + '</div>';
    back.hidden = i === 0;
    next.hidden = !s.multi;
    next.textContent = s.multi && !(cur || []).length ? 'Geen extra’s, verder' : 'Volgende';
    body.querySelectorAll('.calc-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = +b.getAttribute('data-k');
        if (s.multi) {
          var arr = (A[s.id] || []).slice(), at = arr.indexOf(k);
          if (at > -1) arr.splice(at, 1); else arr.push(k);
          A[s.id] = arr; b.setAttribute('aria-pressed', String(at < 0));
          next.textContent = arr.length ? 'Volgende' : 'Geen extra’s, verder';
        } else {
          A[s.id] = k;
          body.querySelectorAll('.calc-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          setTimeout(function () { i++; show(); focusQ(); }, 220);
        }
      });
    });
  }
  function focusQ() { var h = body.querySelector('h2'); if (h) h.focus({ preventScroll: true }); var c = document.getElementById('calc'); if (c.getBoundingClientRect().top < 0) c.scrollIntoView({ behavior: 'smooth' }); }

  function result() {
    var pk = pack(), P = PACK[pk], once = P.p, month = 0, extra = [], lines = [];
    Q.forEach(function (s) {
      if (skip(s)) return;
      var a = A[s.id];
      if (s.multi) {
        (a || []).forEach(function (k) { once += s.opts[k].p; extra.push(s.opts[k].t); });
        lines.push(s.q + ' ' + ((a || []).length ? a.map(function (k) { return s.opts[k].t; }).join(', ') : 'Geen'));
      } else {
        var o = s.opts[a];
        if (o.seo) { if (pk === 0) { once += SEO_START; extra.push('SEO-optimalisatie en Google Bedrijfsprofiel'); } }
        else if (o.p) { once += o.p; extra.push(o.x || o.t); }
        month += o.m || 0;
        lines.push(s.q + ' ' + o.t);
      }
    });
    if (pk === 2) month = 15;
    var raw = once, capped = raw > MAX && raw <= RUIMTE, over = raw > RUIMTE;
    if (capped) once = MAX; if (over) once = MAX + (raw - RUIMTE);
    top.hidden = true; back.hidden = true; next.hidden = true;
    var perM = month ? ' + ' + eur(month) + ' per maand' : '';
    var mail = 'mailto:info.muldex@gmail.com?subject=' + encodeURIComponent('Gratis preview aanvragen') + '&body=' + encodeURIComponent('Hoi David,\n\nIk heb de prijscalculator ingevuld en wil graag een gratis preview.\n\nPakket: ' + P.n + '\nPrijs: vanaf ' + eur(once) + ' excl. btw' + perM + '\n\nMijn antwoorden:\n- ' + lines.join('\n- ') + '\n\nNaam van mijn zaak:\nMijn telefoonnummer:\n');
    var li = function (t) { return '<li>' + t + '</li>'; };
    body.innerHTML = '<p class="calc-count mono">Jouw prijs</p>' +
      '<h2 class="calc-price" tabindex="-1"><span>vanaf</span> ' + eur(once) + '</h2>' +
      '<p class="calc-sub">Eenmalig, exclusief btw' + (month ? ' &middot; plus ' + eur(month) + ' per maand voor onderhoud' : '') + '</p>' +
      '<div class="calc-pack"><div class="calc-pack-head"><span>Pakket</span><b>' + P.n + ' &middot; vanaf ' + eur(P.p) + '</b></div><ul>' + P.inc.map(li).join('') + '</ul>' +
      (extra.length ? '<div class="calc-pack-head calc-extra"><span>Plus jouw extra’s</span></div><ul>' + extra.map(li).join('') + '</ul>' : '') + '</div>' +
      (capped ? '<p class="calc-hint"><b>Je blijft op ' + eur(MAX) + '.</b> Een deel van je wensen zit er gratis bij.</p>' : '') + (over ? '<p class="calc-hint"><b>Jij wilt veel, en alles wordt voor je geregeld.</b> Daarom komt de prijs net boven ' + eur(MAX) + '. Een flink deel van je wensen zit er alsnog gratis bij.</p>' : '') + '<p class="calc-hint">De precieze prijs spreken we samen af na een vrijblijvend gesprek. De eerste preview is altijd gratis.</p>' +
      '<div class="actions"><a class="btn btn-primary btn-arrow" href="' + mail + '">Vraag je gratis preview aan<span class="arrow-box"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></span></a><button type="button" class="btn btn-secondary" id="calc-again">Opnieuw berekenen</button></div>';
    document.getElementById('calc-again').addEventListener('click', function () { A = {}; i = 0; show(); focusQ(); });
    focusQ();
  }
  back.addEventListener('click', function () { if (i > 0) { i--; while (i > 0 && skip(Q[i])) i--; show(); focusQ(); } });
  next.addEventListener('click', function () { if (!A[Q[i].id]) A[Q[i].id] = []; i++; show(); focusQ(); });
  show();
})();
