(function () {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const navLinks = document.querySelectorAll('[data-desktop-nav] a, [data-mobile-nav] a');
  const desktopLinks = document.querySelectorAll('[data-desktop-nav] a');
  const sections = document.querySelectorAll('section[id]');
  const revealItems = document.querySelectorAll('.reveal');
  const form = document.getElementById('contact-form');
  const yearNode = document.getElementById('year');
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');

  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuToggle && mobileNav) {
    const closeMobileMenu = () => {
      mobileNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('is-open');
      body.classList.toggle('menu-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', (event) => {
      const isOpen = mobileNav.classList.contains('is-open');
      if (!isOpen) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!mobileNav.contains(target) && !menuToggle.contains(target)) closeMobileMenu();
    });
  }

  if (sections.length && desktopLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          desktopLinks.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
          });
        });
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0.1
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (form) {
    const messageNode = form.querySelector('.form-message');
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    const setMessage = (text, type) => {
      if (!messageNode) return;
      messageNode.textContent = text;
      messageNode.style.color = type === 'error' ? '#ffd0d0' : '#d8f7dc';
    };

    const validateField = (field) => {
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setMessage('', 'ok');

      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        setMessage(isEnglish ? 'Thanks, your request has been safely captured.' : 'Danke, Ihre Anfrage wurde gespeichert.', 'ok');
        form.reset();
        return;
      }

      let isValid = true;
      fields.forEach((field) => {
        if (!validateField(field)) isValid = false;
      });

      if (!isValid) {
        setMessage(isEnglish ? 'Please check the highlighted fields.' : 'Bitte prüfen Sie die markierten Felder.', 'error');
        return;
      }

      const action = (form.getAttribute('action') || '').trim();
      const isPlaceholder = action.includes('YOUR_FORMSPREE_ID');

      if (isPlaceholder) {
        setMessage(
          isEnglish
            ? 'Thank you. Formspree is still in placeholder mode, submission was simulated locally.'
            : 'Vielen Dank. Formspree ist noch im Platzhaltermodus. Anfrage wurde lokal simuliert.',
          'ok'
        );
        form.reset();
        return;
      }

      try {
        const response = await fetch(action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (!response.ok) throw new Error('Request failed');

        setMessage(
          isEnglish ? 'Thank you. Your request has been sent successfully.' : 'Danke. Ihre Anfrage wurde erfolgreich versendet.',
          'ok'
        );
        form.reset();
      } catch (error) {
        setMessage(
          isEnglish
            ? 'Sending is currently unavailable. Please email kontakt@hkdesign.ch.'
            : 'Versand aktuell nicht möglich. Bitte senden Sie eine E-Mail an kontakt@hkdesign.ch.',
          'error'
        );
      }
    });
  }
})();
