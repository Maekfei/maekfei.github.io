// Homepage interactions: theme toggle, smooth nav highlight, year, BibTeX modal
(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle (persist in localStorage)
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('mfl-theme');
  if (saved === 'light') {
    root.setAttribute('data-theme', 'light');
    if (btn) btn.querySelector('i').className = 'fa-solid fa-sun';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme');
      var next = cur === 'light' ? 'dark' : 'light';
      if (next === 'dark') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      localStorage.setItem('mfl-theme', next);
      btn.querySelector('i').className = next === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
  }

  // Active nav link on scroll
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.topnav__links a');
  function onScroll() {
    var pos = window.scrollY + 120;
    var current = '';
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.style.color = '';
      a.style.background = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--text)';
        a.style.background = 'var(--surface)';
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // BibTeX clipboard
  var BIBTEX = {
    'newborn-impact-2026':
      '@inproceedings{lu2026newborn,\n' +
      '  title     = {From Newborn to Impact: Bias-Aware Citation Prediction},\n' +
      '  author    = {Lu, Mingfei and Wu, Mengjia and Xu, Jiawei and Li, Weikai and Liu, Feng and Ding, Ying and Sun, Yizhou and Lu, Jie and Zhang, Yi},\n' +
      '  booktitle = {Proceedings of The Web Conference (WWW)},\n' +
      '  year      = {2026}\n' +
      '}'
  };
  document.querySelectorAll('a[data-bibtex]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var key = a.getAttribute('data-bibtex');
      var bib = BIBTEX[key];
      if (!bib) return;
      navigator.clipboard.writeText(bib).then(
        function () {
          var orig = a.innerHTML;
          a.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(function () { a.innerHTML = orig; }, 1500);
        },
        function () {
          window.prompt('Copy BibTeX:', bib);
        }
      );
    });
  });

  // Reveal-on-scroll (subtle)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section, .paper, .project, .news__item').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }
})();
