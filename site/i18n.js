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
    'nav.bio':               { en: 'Real-time visuals, computer vision, and sensor-driven installations', fr: 'Visuels temps réel, vision par ordinateur et installations pilotées par capteurs' },

    // About overlay — bio paragraphs
    'about.bio.p1': {
      en: 'Creative technologist based in Montreal specializing in real-time graphics, computer vision, sensor integration, and projection mapping. I design and build interactive systems for large-scale art installations, live performance, and public space, creating works that respond to the presence, movement, and biometrics of their audiences.',
      fr: 'Technologue créatif basé à Montréal, spécialisé en graphisme temps réel, vision par ordinateur, intégration de capteurs et projection architecturale. Je conçois et développe des systèmes interactifs pour des installations artistiques à grande échelle, la performance en direct et l\'espace public, créant des œuvres qui réagissent à la présence, au mouvement et aux données biométriques du public.'
    },
    'about.bio.p2': {
      en: 'Since 2021, Lead Creative Developer at Atelier Lozano-Hemmer, where I research, prototype, program, and install interactive artworks exhibited across four continents and collected by major institutions. Recent projects include Abu Dhabi\'s MANAR festival, Madrid\'s LuzMadrid, Crystal Bridges Museum, and the Museo de Arte Moderno de Mexico. Previously at Moment Factory, where I built visual systems for international tours including Arcade Fire (Infinite Content Tour, Frame Award, Set Design of the Year), Red Hot Chili Peppers (Getaway Tour), and Billie Eilish, alongside permanent installations like Nova Lumina and Kontinuum.',
      fr: 'Depuis 2021, Lead Creative Developer à l\'Atelier Lozano-Hemmer, où je conçois, prototype, programme et installe des œuvres interactives exposées sur quatre continents et collectionnées par des institutions majeures. Parmi les projets récents : le festival MANAR d\'Abu Dhabi, LuzMadrid, le Crystal Bridges Museum et le Museo de Arte Moderno de Mexico. Auparavant chez Moment Factory, j\'ai développé les systèmes visuels de tournées internationales incluant Arcade Fire (Infinite Content Tour, Frame Award, Set Design of the Year), Red Hot Chili Peppers (Getaway Tour) et Billie Eilish, ainsi que des installations permanentes comme Nova Lumina et Kontinuum.'
    },
    'about.bio.p3': {
      en: 'B.A. in Interactive Media & Digital Art, UQAM. TouchDesigner specialist. Over 60 projects delivered across 15+ countries.',
      fr: 'Baccalauréat en médias interactifs et art numérique, UQAM. Spécialiste TouchDesigner. Plus de 60 projets livrés dans plus de 15 pays.'
    },

    // About section headings
    'about.specialties':     { en: 'Specialties', fr: 'Spécialités' },

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
