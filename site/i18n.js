// i18n.js — Bilingual translation engine (EN / FR)
// Professional language switching for hugodaoust.com

(function () {
  'use strict';

  var SUPPORTED = ['en', 'fr'];
  var DEFAULT_LANG = 'en';

  // ── UI string dictionary ──────────────────────────────────────────────
  var UI = {
    // Meta / head
    'meta.title':            { en: 'Hugo Daoust – Creative Technologist', fr: 'Hugo Daoust – Technologue Créatif' },
    'meta.description':      { en: 'Interactive installations, projection mapping, computer vision, and real-time systems.', fr: 'Installations interactives, projection architecturale, vision par ordinateur et systèmes temps réel.' },

    // Navigation / sidebar
    'nav.title':             { en: 'Creative Technologist', fr: 'Technologue Créatif' },
    'nav.location':          { en: 'Montreal', fr: 'Montréal' },

    // Mobile hero
    'hero.subtitle':         { en: 'Creative Technologist', fr: 'Technologue Créatif' },

    // Loading states
    'loading.projects':      { en: 'Loading projects', fr: 'Chargement des projets' },
    'loading.network':       { en: 'Generating neural network', fr: 'Génération du réseau neuronal' },
    'loading.error':         { en: 'Error loading projects', fr: 'Erreur de chargement des projets' },
    'loading.empty':         { en: 'No projects loaded. Check data.js.', fr: 'Aucun projet chargé. Vérifiez data.js.' },

    // Overlay / project detail
    'overlay.back':          { en: '← All projects', fr: '← Tous les projets' },
    'overlay.back_aria':     { en: 'Back to projects', fr: 'Retour aux projets' },

    // Project page
    'project.not_found':     { en: 'Project not found.', fr: 'Projet introuvable.' },
    'project.back':          { en: 'Back to projects', fr: 'Retour aux projets' },

    // Language switcher
    'lang.switch':           { en: 'FR', fr: 'EN' },
    'lang.switch_aria':      { en: 'Switch to French', fr: 'Passer en anglais' },
    'lang.current_aria':     { en: 'Current language: English', fr: 'Langue actuelle : français' },

    // Section headers (fullDescription parsing)
    'section.technical':     { en: 'Technical details and implementation', fr: 'Détails techniques et implémentation' },
    'section.challenges':    { en: 'Challenges and solutions', fr: 'Défis et solutions' },
    'section.impact':        { en: 'Impact and results', fr: 'Impact et résultats' },
    'section.process':       { en: 'Process and methodology', fr: 'Processus et méthodologie' },

    // Sidebar bio
    'nav.bio':               { en: 'Interactive installations, concert visuals & immersive experiences', fr: 'Installations interactives, visuels de concert et expériences immersives' },

    // Footer
    'footer.heading':        { en: 'Get in touch', fr: 'Contact' },
    'footer.location':       { en: 'Montreal, Canada', fr: 'Montréal, Canada' },

    // Misc
    'untitled':              { en: 'Untitled Project', fr: 'Projet sans titre' }
  };

  // ── Role translations ─────────────────────────────────────────────────
  var ROLES = {
    'Lead Creative Technologist': 'Technologue Créatif Principal',
    'Creative Technologist':      'Technologue Créatif',
    'Creative Developer':         'Développeur Créatif',
    'Artist':                     'Artiste'
  };

  // ── Language detection ─────────────────────────────────────────────────
  function getLang() {
    // 1. URL parameter  ?lang=fr
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && SUPPORTED.indexOf(urlLang) !== -1) {
      localStorage.setItem('site_lang', urlLang);
      return urlLang;
    }
    // 2. localStorage
    var stored = localStorage.getItem('site_lang');
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    // 3. Browser language
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('fr') === 0) return 'fr';
    // 4. Default
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem('site_lang', lang);
    document.documentElement.lang = lang;
  }

  // ── Translate a UI key ─────────────────────────────────────────────────
  function t(key) {
    var entry = UI[key];
    if (!entry) return key;
    return entry[getLang()] || entry[DEFAULT_LANG] || key;
  }

  // ── Translate a project field ──────────────────────────────────────────
  // Looks up the French override in window.projectTranslationsFr
  function tp(project, field) {
    var lang = getLang();
    if (lang === 'fr' && window.projectTranslationsFr) {
      var tr = window.projectTranslationsFr[project.id];
      if (tr && tr[field] !== undefined) return tr[field];
    }
    return project[field] || '';
  }

  // ── Translate a role string ────────────────────────────────────────────
  function tRole(roleStr) {
    if (getLang() !== 'fr') return roleStr;
    return ROLES[roleStr] || roleStr;
  }

  // ── Switch language & reload ───────────────────────────────────────────
  function switchLang() {
    var next = getLang() === 'fr' ? 'en' : 'fr';
    setLang(next);
    var url = new URL(window.location);
    url.searchParams.set('lang', next);
    window.location.href = url.toString();
  }

  // ── Build lang-aware href  (preserves ?lang= across internal links) ───
  function localHref(path) {
    var lang = getLang();
    if (lang === DEFAULT_LANG) return path;
    var hashIdx = path.indexOf('#');
    var hash = '';
    var base = path;
    if (hashIdx !== -1) {
      hash = path.substring(hashIdx);
      base = path.substring(0, hashIdx);
    }
    var sep = base.indexOf('?') === -1 ? '?' : '&';
    return base + sep + 'lang=' + lang + hash;
  }

  // ── Apply lang on page load ────────────────────────────────────────────
  var lang = getLang();
  setLang(lang);

  // ── Public API ─────────────────────────────────────────────────────────
  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    t: t,
    tp: tp,
    tRole: tRole,
    switchLang: switchLang,
    localHref: localHref,
    SUPPORTED: SUPPORTED
  };
})();
