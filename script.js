// script.js
// Interacciones:
// - Menu hamburguesa (mobile)
// - Smooth scroll for anchor links
// - Animación de números al hacer scroll (IntersectionObserver)
// - Filtrado de proyectos
// - Validación básica del formulario con feedback

document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.querySelector('.hamburger').classList.toggle('open');
    nav.classList.toggle('open');
    // Toggle simple display for small screens
    if(nav.style.display === 'block') nav.style.display = '';
    else nav.style.display = 'block';
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:'smooth', block:'start'});
          // close menu on mobile
          if(window.innerWidth < 700 && nav.style.display === 'block'){
            nav.style.display = '';
            menuToggle.setAttribute('aria-expanded','false');
          }
        }
      }
    });
  });

  // Animate numbers when in view
  const animateNumber = (el, target) => {
    const isFloat = String(target).includes('.') || String(target).includes(',');
    const duration = 1200;
    const start = 0;
    const range = Number(String(target).replace(',', '.')) - start;
    let startTime = null;

    const step = (timestamp) => {
      if(!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = start + range * easeOutCubic(progress);
      el.textContent = isFloat ? formatFloat(value, target) : Math.round(value);
      if(progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const easeOutCubic = t => (--t)*t*t+1;
  const formatFloat = (v, target) => {
    const decimals = (String(target).split('.')[1] || '').length;
    return Number(v).toFixed(decimals);
  };

  const metricEls = document.querySelectorAll('.metric-num');
  const metricObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const raw = el.getAttribute('data-target') || '0';
        if(raw === '0' || raw === '0.00'){ el.textContent = raw; obs.unobserve(el); return; }
        animateNumber(el, raw);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.6});

  metricEls.forEach(el => metricObserver.observe(el));

  // Project filtering
  const filters = document.querySelectorAll('.filter');
  const projectsGrid = document.getElementById('projectsGrid');
  const projects = Array.from(projectsGrid.querySelectorAll('.project'));

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      const filter = btn.getAttribute('data-filter');
      projects.forEach(p => {
        const cat = p.getAttribute('data-category');
        if(filter === 'all' || (cat && cat.includes(filter))){
          p.style.display = '';
          p.classList.add('reveal');
        } else {
          p.style.display = 'none';
          p.classList.remove('reveal');
        }
      });
    });
  });

  // Basic form validation & submission behavior
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if(!name || !email || !message){
      feedback.textContent = 'Por favor completa todos los campos antes de enviar.';
      feedback.style.color = '#C2410C';
      return;
    }
    // simple email pattern
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){
      feedback.textContent = 'Por favor escribe un correo válido.';
      feedback.style.color = '#C2410C';
      return;
    }

    // Simular envío: abrir mailto con contenido (client-side fallback)
    const subject = encodeURIComponent(`Contacto desde web - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    const mailto = `mailto:angelicarangel.luz@gmail.com?subject=${subject}&body=${body}`;

    // Try to open mail client and show success
    window.location.href = mailto;
    feedback.textContent = 'Se ha abierto tu cliente de correo. También puedes contactarme por WhatsApp.';
    feedback.style.color = '#065F46';
    contactForm.reset();
  });

  // small accessibility improvement: close mobile nav on resize
  window.addEventListener('resize', () => {
    if(window.innerWidth > 700){
      nav.style.display = '';
      menuToggle.setAttribute('aria-expanded','false');
    }
  });
});