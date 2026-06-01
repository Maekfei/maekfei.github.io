// Homepage interactions: theme toggle, smooth nav highlight, year, BibTeX modal
(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle (persist in localStorage). Default is LIGHT.
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('mfl-theme');
  if (saved === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (btn) btn.querySelector('i').className = 'fa-solid fa-moon';
  } else {
    if (btn) btn.querySelector('i').className = 'fa-solid fa-sun';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      if (next === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      localStorage.setItem('mfl-theme', next);
      btn.querySelector('i').className = next === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
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
      '  booktitle = {Proceedings of the ACM Web Conference (WWW)},\n' +
      '  pages     = {7600--7609},\n' +
      '  year      = {2026}\n' +
      '}',
    'fluxmem-2026':
      '@article{lu2026fluxmem,\n' +
      '  title   = {Choosing How to Remember: Adaptive Memory Structures for LLM Agents},\n' +
      '  author  = {Lu, Mingfei and Wu, Mengjia and Liu, Feng and Xu, Jiawei and Li, Weikai and Wang, Hao and Hu, Zhen and Ding, Ying and Sun, Yizhou and Lu, Jie and others},\n' +
      '  journal = {arXiv preprint arXiv:2602.14038},\n' +
      '  year    = {2026}\n' +
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

  // Get-in-touch: copy email + show feedback (still allows mailto: as fallback on long-press / right-click)
  var gitBtn = document.getElementById('getInTouchBtn');
  if (gitBtn) {
    gitBtn.addEventListener('click', function (e) {
      var email = gitBtn.getAttribute('data-email');
      if (!email || !navigator.clipboard) return; // let mailto: fire normally
      e.preventDefault();
      navigator.clipboard.writeText(email).then(
        function () {
          var label = gitBtn.querySelector('.btn-label');
          var icon = gitBtn.querySelector('i');
          var origLabel = label.textContent;
          var origIcon = icon.className;
          label.textContent = 'Email copied!';
          icon.className = 'fa-solid fa-check';
          setTimeout(function () {
            label.textContent = origLabel;
            icon.className = origIcon;
          }, 1800);
        },
        function () {
          // Fallback: open mail client
          window.location.href = 'mailto:' + email;
        }
      );
    });
  }

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
