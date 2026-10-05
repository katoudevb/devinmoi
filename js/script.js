const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const form = document.querySelector('#contact-form');

function closeMenu() {
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Ouvrir le menu');
}

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

document.querySelector('#year').textContent = new Date().getFullYear();

form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Envoi en cours…';
  status.textContent = '';

  const data = new FormData(form);
  const visitorSubject = data.get('subject');
  data.set('subject', `[Dev'in Moi] ${visitorSubject}`);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    const result = await response.json();

    if (!response.ok || !result.success) throw new Error(result.message || 'Envoi impossible');

    form.reset();
    status.textContent = 'Votre message a bien été envoyé. Je vous répondrai dès que possible.';
  } catch (error) {
    status.textContent = "Le message n'a pas pu être envoyé. Réessayez ou contactez-moi à katoudevb@gmail.com.";
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
