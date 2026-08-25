

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeToggle();
  initMobileMenu();
  initNavbarScroll();
  initActiveNav();
  initScrollProgress();
  initScrollReveal();
  initBackgroundSymbols();
  initTerminalTyping();
  initCounters();
  initProjectFilters();
  initProjectRepoLinks();
  initContactForm();
  initBackToTop();
  initMagneticButtons();
  initResumeButton();
  initDynamicYear();
});

/* ---------- Page loader ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('is-hidden'), 2500);
}

/* ---------- Theme toggle (dark default) ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = safeGet('rg-theme');

  if (stored === 'light') {
    root.setAttribute('data-theme', 'light');
    toggle && toggle.setAttribute('aria-pressed', 'true');
  }

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      toggle.setAttribute('aria-pressed', 'false');
      safeSet('rg-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      toggle.setAttribute('aria-pressed', 'true');
      safeSet('rg-theme', 'light');
    }
  });
}

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, val) {
  try { window.localStorage.setItem(key, val); } catch (e) { /* ignore */ }
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  const close = () => {
    btn.classList.remove('is-open');
    links.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Navbar blur on scroll ---------- */
function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Active section highlight ---------- */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  if (!links.length) return;
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------- Ambient background code symbols ---------- */
function initBackgroundSymbols() {
  const layer = document.getElementById('bgSymbols');
  if (!layer) return;
  const glyphs = ['{ }', '</>', '01', '=>', '[ ]', 'SELECT', 'O(n)', ';'];
  const count = window.innerWidth < 700 ? 6 : 12;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = glyphs[i % glyphs.length];
    span.style.left = `${Math.random() * 96}%`;
    span.style.top = `${Math.random() * 96}%`;
    layer.appendChild(span);
  }
}

/* ---------- Terminal typing effect ---------- */
function initTerminalTyping() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: 'rishi@developer:~$ whoami' },
    { type: 'out', text: 'Rishi Garg' },
    { type: 'blank' },
    { type: 'prompt', text: 'rishi@developer:~$ focus' },
    { type: 'out', text: 'Backend Development' },
    { type: 'out', text: 'Data Structures & Algorithms' },
    { type: 'out', text: 'Problem Solving' },
    { type: 'blank' },
    { type: 'prompt', text: 'rishi@developer:~$ status' },
    { type: 'ok', text: 'Building... \u2713' },
    { type: 'ok', text: 'Learning... \u2713' },
    { type: 'ok', text: 'Improving... \u2713' },
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    body.innerHTML = lines.map(renderLineStatic).join('\n');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let currentEl = null;

  function typeNext() {
    if (lineIndex >= lines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      body.appendChild(cursor);
      return;
    }

    const line = lines[lineIndex];

    if (line.type === 'blank') {
      body.appendChild(document.createElement('br'));
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 120);
      return;
    }

    if (!currentEl) {
      currentEl = document.createElement('div');
      currentEl.className = line.type === 'prompt' ? 'prompt' : line.type === 'ok' ? 'ok' : 'out';
      body.appendChild(currentEl);
    }

    if (charIndex < line.text.length) {
      currentEl.textContent += line.text[charIndex];
      charIndex++;
      const speed = line.type === 'prompt' ? 28 : 14;
      setTimeout(typeNext, speed);
    } else {
      lineIndex++;
      charIndex = 0;
      currentEl = null;
      setTimeout(typeNext, line.type === 'prompt' ? 220 : 90);
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeNext();
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(body);
}

function renderLineStatic(line) {
  if (line.type === 'blank') return '';
  return line.text;
}

/* ---------- Animated counters (numeric stats only) ---------- */
function initCounters() {
  const nodes = document.querySelectorAll('[data-count]');
  if (!nodes.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = String(target).includes('.');
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nodes.forEach(el => io.observe(el));
}

/* ---------- Project filtering ---------- */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');
  if (!buttons.length || !projects.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');
      projects.forEach(project => {
        const tags = (project.getAttribute('data-tags') || '').split(' ');
        const match = filter === 'all' || tags.includes(filter);
        project.classList.toggle('is-hidden', !match);
      });
    });
  });
}

/* ---------- Project GitHub links (configurable, never invented) ---------- */
function initProjectRepoLinks() {
  // Add real repository URLs here as they become available, e.g.:
  // { title: 'Analytics Dashboard Backend Service', url: 'https://github.com/...' }
  const REPOS = [];

  document.querySelectorAll('.project-gh').forEach(link => {
    const projectTitle = link.closest('.project')?.querySelector('.project__title')?.textContent.trim();
    const match = REPOS.find(r => r.title === projectTitle);

    if (match && match.url) {
      link.href = match.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'View on GitHub';
    } else {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
      link.setAttribute('aria-disabled', 'true');
    }
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');

  const validators = {
    name: v => v.trim().length >= 2 || 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Add a short subject.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach(name => {
      const input = form.elements[name];
      const field = input.closest('.field');
      const errorEl = document.getElementById(`err-${name}`);
      const result = validators[name](input.value);

      if (result !== true) {
        field.classList.add('has-error');
        errorEl.textContent = result;
        valid = false;
      } else {
        field.classList.remove('has-error');
        errorEl.textContent = '';
      }
    });

    if (!valid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = '#F87171';
      return;
    }

    status.style.color = '';
    status.textContent = 'Message ready — connect a backend or email service to deliver it.';
    form.reset();
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 700);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Magnetic hover on primary buttons ---------- */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const buttons = document.querySelectorAll('.magnetic');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ---------- Resume download (configurable, no fake claims) ---------- */
function initResumeButton() {
  const btn = document.getElementById('resumeBtn');
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    try {
      const res = await fetch(btn.getAttribute('href'), { method: 'HEAD' });
      if (!res.ok) throw new Error('missing');
    } catch (err) {
      e.preventDefault();
      alert('Resume file not added yet. Place your PDF at assets/resume/Rishi_Garg_Resume.pdf to enable this button.');
    }
  });
}

/* ---------- Dynamic year ---------- */
function initDynamicYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}