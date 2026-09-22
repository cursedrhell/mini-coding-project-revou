/* ===================================================
   SCUDERIA FERRARI — Main Script
   =================================================== */

'use strict';

/* ---------------------------------------------------
   1. NAVBAR — scroll effect + hamburger
   --------------------------------------------------- */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // prevent body scroll while menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---------------------------------------------------
   2. HERO — speed lines generator
   --------------------------------------------------- */
function generateSpeedLines() {
  const container = document.getElementById('speedLines');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.classList.add('speed-line');

    const top      = Math.random() * 100;
    const duration = (1.2 + Math.random() * 2.5).toFixed(2);
    const delay    = (Math.random() * 4).toFixed(2);
    const height   = Math.random() > 0.5 ? '1px' : '2px';

    line.style.cssText = `
      top: ${top}%;
      --duration: ${duration}s;
      --delay: ${delay}s;
      height: ${height};
      animation-delay: ${delay}s;
    `;
    container.appendChild(line);
  }
}

generateSpeedLines();

/* ---------------------------------------------------
   3. SCROLL REVEAL — IntersectionObserver
   --------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // once revealed, stop observing
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---------------------------------------------------
   4. STAT COUNTERS — animate numbers on scroll
   --------------------------------------------------- */
const statData = [
  { id: 'stat-constructors', target: 16 },
  { id: 'stat-drivers',      target: 15 },
  { id: 'stat-wins',         target: 250 },
  { id: 'stat-seasons',      target: 77 },
  { id: 'stat-podiums',      target: 845 },
];

function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quart
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats-banner');
let countersTriggered = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersTriggered) {
    countersTriggered = true;
    statData.forEach(({ id, target }) => {
      const el = document.getElementById(id);
      if (el) animateCounter(el, target);
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

/* ---------------------------------------------------
   5. CARS TAB SWITCHER
   --------------------------------------------------- */
const carDatabase = {
  f2004: {
    name:   'Ferrari F2004',
    year:   'Musim: 2004',
    desc:   'Dianggap sebagai salah satu mobil F1 terbaik sepanjang masa. Michael Schumacher memenangkan 13 dari 18 balapan musim itu, dengan Ferrari meraih gelar konstruktor ke-6 berturut-turut.',
    engine: '3.0L V10',
    power:  '900+ hp',
    speed:  '~370 km/h',
    driver: 'Schumacher / Barrichello',
    emoji:  '🏎️',
  },
  f1975: {
    name:   'Ferrari 312T',
    year:   'Musim: 1975',
    desc:   'Mobil yang membawa Niki Lauda dan Clay Regazzoni mendominasi musim 1975. Desain flat-12 longitudinal transversalnya revolusioner untuk masanya.',
    engine: '3.0L Flat-12',
    power:  '~500 hp',
    speed:  '~310 km/h',
    driver: 'Niki Lauda / Regazzoni',
    emoji:  '🚗',
  },
  f156: {
    name:   'Ferrari 156 "Sharknose"',
    year:   'Musim: 1961',
    desc:   'Dijuluki "Sharknose" karena hidungnya yang unik dengan dua lubang intake. Phil Hill memenangkan gelar dunia dengan mobil ini, menjadi pembalap Amerika pertama yang juara F1.',
    engine: '1.5L V6',
    power:  '~190 hp',
    speed:  '~270 km/h',
    driver: 'Phil Hill / Wolfgang von Trips',
    emoji:  '🏁',
  },
  sf23: {
    name:   'Ferrari SF-23',
    year:   'Musim: 2023',
    desc:   'Pengembangan dari SF-21 yang kompetitif. Carlos Sainz memenangkan GP Singapura dengan mobil ini dalam kondisi yang sangat menantang, salah satu kemenangan terbaik Ferrari era modern.',
    engine: '1.6L V6 Turbo Hybrid',
    power:  '~1000 hp',
    speed:  '~365 km/h',
    driver: 'Leclerc / Sainz',
    emoji:  '🏎️',
  },
  sf25: {
    name:   'Ferrari SF-25',
    year:   'Musim: 2025',
    desc:   'Era baru Ferrari dengan Lewis Hamilton di belakang kemudi. Mobil ini dibangun dengan ambisi merebut kembali gelar juara dunia yang sudah lama absen dari Maranello.',
    engine: '1.6L V6 Turbo Hybrid',
    power:  '~1000+ hp',
    speed:  '~370 km/h',
    driver: 'Leclerc / Hamilton',
    emoji:  '🔴',
  },
};

const carTabs     = document.querySelectorAll('.car-tab');
const carName     = document.getElementById('carName');
const carYear     = document.getElementById('carYear');
const carDesc     = document.getElementById('carDesc');
const carEngine   = document.getElementById('carEngine');
const carPower    = document.getElementById('carPower');
const carSpeed    = document.getElementById('carSpeed');
const carDriver   = document.getElementById('carDriver');
const carVisual   = document.getElementById('carVisual');
const carInfo     = document.getElementById('carInfo');

function switchCar(key) {
  const data = carDatabase[key];
  if (!data) return;

  // animate out
  carInfo.classList.add('car-transition');

  setTimeout(() => {
    carName.textContent   = data.name;
    carYear.textContent   = data.year;
    carDesc.textContent   = data.desc;
    carEngine.textContent = data.engine;
    carPower.textContent  = data.power;
    carSpeed.textContent  = data.speed;
    carDriver.textContent = data.driver;
    carVisual.textContent = data.emoji;
    carInfo.classList.remove('car-transition');
  }, 200);
}

carTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    carTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-pressed', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    switchCar(tab.dataset.car);
  });
});

/* ---------------------------------------------------
   6. ACTIVE NAV LINK — highlight on scroll
   --------------------------------------------------- */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.4,
});

sections.forEach(s => sectionObserver.observe(s));

/* ---------------------------------------------------
   7. CURSOR GLOW (desktop only)
   --------------------------------------------------- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(220,0,0,0.06) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  let gx = 0, gy = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function updateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = `${gx}px`;
    glow.style.top  = `${gy}px`;
    raf = requestAnimationFrame(updateGlow);
  }

  updateGlow();

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

/* ---------------------------------------------------
   8. DRIVER CARD — flip detail on click (mobile)
   --------------------------------------------------- */
document.querySelectorAll('.driver-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('focused');
    }
  });
});

/* ---------------------------------------------------
   9. SMOOTH PARALLAX — subtle hero offset
   --------------------------------------------------- */
const heroContent = document.querySelector('.hero-content');
const heroCar     = document.querySelector('.hero-car-container');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;
  if (heroCar)     heroCar.style.transform      = `translateY(${y * 0.15}px)`;
}, { passive: true });

/* ---------------------------------------------------
   10. PAGE LOAD — trigger hero animations
   --------------------------------------------------- */
window.addEventListener('DOMContentLoaded', () => {
  // stagger hero elements
  const heroElements = document.querySelectorAll('.hero .reveal-up');
  heroElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
});
