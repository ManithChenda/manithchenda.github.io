/* ============================================================
   toggles.js — the only runtime JS on the site.
   Theme (dark/light) and language (en/km) preference.

   Loaded as a *blocking* script at the end of <head> so the theme
   attribute is set before first paint (no flash of the wrong theme).

   Language is a real URL tree (/ and /km/), so switching language is a
   plain link — this file only remembers the choice and honours it when
   someone lands on the site entry page.
   ============================================================ */
(function () {
  var root = document.documentElement;

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  /* ---------- theme ---------- */
  function osTheme() {
    try {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
        ? 'light' : 'dark';
    } catch (e) { return 'dark'; }
  }

  var stored = read('theme');
  var theme = (stored === 'dark' || stored === 'light') ? stored : osTheme();
  root.setAttribute('data-theme', theme);

  /* ---------- language ---------- */
  var pageLang = root.getAttribute('data-lang') === 'km' ? 'km' : 'en';
  var altUrl = root.getAttribute('data-alt-url');

  // ?lang=en / ?lang=km forces (and records) a language.
  var forced = (location.search.match(/[?&]lang=(en|km)/) || [])[1];
  if (forced) { write('lang', forced); }

  var prefLang = forced || read('lang');

  // Entry pages (the two about pages) honour a remembered language.
  // Deep links always render the language of the URL you asked for.
  if (root.getAttribute('data-lang-entry') === 'true' &&
      (prefLang === 'en' || prefLang === 'km') &&
      prefLang !== pageLang && altUrl) {
    location.replace(altUrl);
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        write('theme', next);
        themeBtn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      });
    }

    var langLinks = document.querySelectorAll('[data-lang-choice]');
    for (var i = 0; i < langLinks.length; i++) {
      langLinks[i].addEventListener('click', function () {
        write('lang', this.getAttribute('data-lang-choice'));
      });
    }
  });
})();
