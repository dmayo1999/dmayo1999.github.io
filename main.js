/* dgib.me — main.js */

/* --- DARK MODE TOGGLE --------------------------------------- */
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Set stored or detected theme
  root.setAttribute('data-theme', theme);
  updateToggleIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateToggleIcon(theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  function updateToggleIcon(t) {
    if (!toggle) return;
    toggle.innerHTML = t === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

/* --- MOBILE NAV -------------------------------------------- */
const mobileToggle = document.getElementById('mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');
let navOpen = false;

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    navOpen = !navOpen;
    mobileNav.classList.toggle('is-open', navOpen);
    mobileNav.setAttribute('aria-hidden', String(!navOpen));
    mobileToggle.setAttribute('aria-expanded', String(navOpen));
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navOpen = false;
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --- NAV SCROLL SHADOW ------------------------------------- */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- SCROLL REVEAL ----------------------------------------- */
const revealEls = document.querySelectorAll(
  '.service-card, .process__step, .pricing-card, .problem__item, .about__card, .about__text, .hero__proof'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* --- STAGGERED REVEALS ------------------------------------- */
document.querySelectorAll('.services__grid, .process__steps, .pricing__grid').forEach(grid => {
  const children = grid.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* --- CONTACT FORM ------------------------------------------ */
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  // Simple validation
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  const emailField = document.getElementById('email');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Simulate send — in production, wire to Formspree, EmailJS, or mailto
  const name = document.getElementById('name').value.trim();
  const business = document.getElementById('business').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Website inquiry from ${name} — ${business}`);
  const body = encodeURIComponent(`Name: ${name}\nBusiness: ${business}\nEmail: ${email}\n\n${message}`);
  
  // Open mailto with prefilled content
  window.location.href = `mailto:david@dgib.me?subject=${subject}&body=${body}`;

  // Show success state
  btn.disabled = true;
  btn.textContent = 'Message sent ✓';
  successMsg.hidden = false;
  form.querySelectorAll('input, textarea').forEach(f => f.value = '');

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send Message →';
    successMsg.hidden = true;
  }, 5000);
}

/* --- SMOOTH ANCHOR CLICKS ---------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
