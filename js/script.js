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

  const setMenuLabel = (isOpen) => {
    if (!menuToggle) return;
    const labelNode = menuToggle.querySelector('.sr-only');
    if (!labelNode) return;
    labelNode.textContent = isOpen
      ? isEnglish
        ? 'Close menu'
        : 'Menue schliessen'
      : isEnglish
        ? 'Open menu'
        : 'Menue oeffnen';
  };

  setHeaderState();
  setMenuLabel(false);
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuToggle && mobileNav) {
    const closeMobileMenu = () => {
      mobileNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
      setMenuLabel(false);
    };

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      menuToggle.setAttribute('aria-expanded', String(next));
      mobileNav.classList.toggle('is-open', next);
      body.classList.toggle('menu-open', next);
      setMenuLabel(next);
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

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobileMenu();
    });
  }

  if (sections.length && desktopLinks.length) {
    const clearAriaCurrent = () => {
      desktopLinks.forEach((link) => link.removeAttribute('aria-current'));
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          clearAriaCurrent();

          desktopLinks.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'true');
          });
        });
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0.15
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (form) {
    const messageNode = form.querySelector('.form-message');
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    const setMessage = (text, type) => {
      if (!messageNode) return;
      messageNode.textContent = text;
      if (type) messageNode.dataset.state = type;
      else messageNode.removeAttribute('data-state');
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
      setMessage('', null);

      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        setMessage(
          isEnglish ? 'Thanks. Your request has been safely captured.' : 'Danke. Ihre Anfrage wurde sicher erfasst.',
          'ok'
        );
        form.reset();
        return;
      }

      let isValid = true;
      let firstInvalid = null;

      fields.forEach((field) => {
        const fieldValid = validateField(field);
        if (!fieldValid && !firstInvalid) firstInvalid = field;
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        setMessage(
          isEnglish ? 'Please check the highlighted fields.' : 'Bitte pruefen Sie die markierten Felder.',
          'error'
        );
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const action = (form.getAttribute('action') || '').trim();
      const isPlaceholder = action.includes('YOUR_FORMSPREE_ID');

      if (isPlaceholder) {
        setMessage(
          isEnglish
            ? 'Formspree is still in placeholder mode. Submission was simulated locally.'
            : 'Formspree ist noch im Platzhaltermodus. Versand wurde lokal simuliert.',
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
          isEnglish ? 'Thank you. Your inquiry was sent successfully.' : 'Danke. Ihre Anfrage wurde erfolgreich gesendet.',
          'ok'
        );
        form.reset();
      } catch (error) {
        setMessage(
          isEnglish
            ? 'Sending is currently unavailable. Please use kontakt@hkdesign.ch.'
            : 'Versand aktuell nicht moeglich. Bitte nutzen Sie kontakt@hkdesign.ch.',
          'error'
        );
      }
    });
  }
})();
