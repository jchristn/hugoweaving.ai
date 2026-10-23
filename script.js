// Agent Smith Website - Interactive Behavior

(function () {
  'use strict';

  var html = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Mobile Navigation Toggle ---
  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Dark Mode Toggle (dark is the default) ---
  var themeToggle = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem('agentsmith-theme');
      if (saved) return saved;
    } catch (e) { /* storage unavailable */ }
    return 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('agentsmith-theme', theme); } catch (e) { /* storage unavailable */ }
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Sticky Nav Scroll Effect ---
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY || window.pageYOffset;
    if (nav) {
      if (scrollY > 20) { nav.classList.add('scrolled'); }
      else { nav.classList.remove('scrolled'); }
    }
  }, { passive: true });

  // --- Tab Switching (scoped per tab group) ---
  document.querySelectorAll('.term-tabs').forEach(function (tabGroup) {
    var panelsWrap = tabGroup.nextElementSibling;
    var groupTabs = tabGroup.querySelectorAll('.term-tab');

    groupTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = this.getAttribute('data-tab');

        groupTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        if (panelsWrap) {
          panelsWrap.querySelectorAll('.term-panel').forEach(function (p) { p.classList.remove('active'); });
        }

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        var target = document.getElementById('panel-' + key);
        if (target) { target.classList.add('active'); }
      });
    });
  });

  // --- Copy-to-clipboard for code blocks ---
  document.querySelectorAll('[data-copy]').forEach(function (block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'copy';
    btn.addEventListener('click', function () {
      var code = block.querySelector('code');
      if (!code) return;
      // Strip the "$ " prompts so the copied text runs as-is
      var text = code.innerText.split('\n').map(function (line) {
        return line.replace(/^\$ /, '');
      }).join('\n');
      var done = function () {
        btn.textContent = 'copied';
        setTimeout(function () { btn.textContent = 'copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
    block.appendChild(btn);
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = parseInt(getComputedStyle(html).getPropertyValue('--nav-height')) || 68;
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // --- Digital rain (paused off-screen, skipped for reduced motion) ---
  function startRain(canvas) {
    if (!canvas || !canvas.getContext || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var glyphs = 'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロ0123456789';
    var fontSize = 16;
    var columns = [];
    var running = true;
    var last = 0;

    var resize = function () {
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      var count = Math.ceil(canvas.width / fontSize);
      columns = [];
      for (var i = 0; i < count; i++) {
        columns.push(Math.random() * -canvas.height / fontSize);
      }
    };

    var draw = function (t) {
      if (!running) return;
      requestAnimationFrame(draw);
      if (t - last < 55) return;
      last = t;

      var light = html.getAttribute('data-theme') === 'light';
      ctx.fillStyle = light ? 'rgba(239, 234, 219, 0.16)' : 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px "IBM Plex Mono", monospace';

      for (var i = 0; i < columns.length; i++) {
        var y = columns[i] * fontSize;
        var ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillStyle = light ? '#0b6e2e' : (Math.random() > 0.97 ? '#e8fff0' : '#00ff41');
        ctx.fillText(ch, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) { columns[i] = 0; }
        else { columns[i] += 1; }
      }
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(draw); }
        else if (!visible) { running = false; }
      }).observe(canvas);
    }
  }

  startRain(document.getElementById('rain'));
  startRain(document.getElementById('rain-finale'));

  // --- Scroll-triggered Fade-in Animation ---
  if (!('IntersectionObserver' in window) || reduceMotion) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.row, .timeline li, .benefit, .case, .checklist li, .start-steps li, .memo, .ledger tbody tr'
  ).forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i % 6, 5) * 0.06) + 's';
    observer.observe(el);
  });

})();
