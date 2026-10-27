
(() => {
  'use strict';

  const config = window.LDF_CONFIG || {};
  const current = location.pathname.split('/').pop() || 'index.html';

  // Main website navigation
  const nav = [
    ['index.html', 'Home'],
    ['about.html', 'About us'],
    ['projects.html', 'What we do'],
    ['hope.html', 'Hope for Families'],
    ['market.html', 'LDF Market'],
    ['abroad.html', 'From abroad'],
    ['learning.html', 'Learning Hub'],
    ['tutors.html', 'Tutors'],
    ['stories.html', 'Stories'],
    ['app.html', 'LDF App'],
    ['index.html#join', 'Join us'],
    ['contact.html', 'Contact']
  ];

  // on wide screens these sit under "More" so the menu fits on one line
  const MORE = new Set(['market.html', 'abroad.html', 'tutors.html', 'app.html']);

  const APP = config.appUrl || 'https://ldf-platform.vercel.app/';

  const link = (href, label, cls = '') =>
    `<a class="${cls}" href="${href}"${
      current === href ? ' aria-current="page"' : ''
    }>${label}</a>`;

  // Shared website header
  const header = document.getElementById('site-header');

  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>

      <header class="site-header">
        <div class="container nav-wrap">

          <a class="brand" href="index.html"
             aria-label="Life Development Foundation home">
            <img
              src="assets/7e64c73a-b2e1-4843-b294-a0825088490c.jpeg"
              alt="LDF logo"
            >
            <span>
              <strong>LDF</strong>
              <small>Life Development Foundation</small>
            </span>
          </a>

          <button
            class="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="primary-nav"
            aria-label="Open menu"
          >
            <img src="assets/ldf-icon.png" alt="" width="34" height="34">
            <span class="menu-label">Menu</span>
          </button>

          <nav
            id="primary-nav"
            class="primary-nav"
            aria-label="Main navigation"
          >
            ${nav.filter(([h]) => !MORE.has(h)).map(([href, label]) => link(href, label, href === 'index.html' ? 'nav-home' : '')).join('')}
            <details class="nav-more"><summary>More</summary><div class="nav-more-list">${nav.filter(([h]) => MORE.has(h)).map(([href, label]) => link(href, label)).join('')}</div></details>
            ${nav.filter(([h]) => MORE.has(h)).map(([href, label]) => link(href, label, 'nav-mobile-only')).join('')}

            <a class="nav-cta" href="${APP}" target="_blank" rel="noopener noreferrer">Open the app</a>
          </nav>

        </div>
      </header>
    `;

    const toggle = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.primary-nav');
    // Mobile main navigation
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
      });
    }

    // Close mobile menu after choosing a normal navigation link
    if (menu && toggle) {
      menu.addEventListener('click', event => {
        const clickedLink = event.target.closest('a');

        if (clickedLink) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Shared website footer
  const footer = document.getElementById('site-footer');

  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">

          <div>
            <a class="brand brand-footer" href="index.html">
              <img
                src="assets/7e64c73a-b2e1-4843-b294-a0825088490c.jpeg"
                alt="LDF logo"
              >
              <span>
                <strong>LDF</strong>
                <small>Life Development Foundation</small>
              </span>
            </a>

            <p>
              Encouraging learning, dignity and positive community development.
            </p>
          </div>

          <div>
            <h2>Explore</h2>
            ${link('about.html', 'About us')}
            ${link('projects.html', 'What we do')}
            ${link('hope.html', 'Hope for Families')}
            ${link('learning.html', 'Learning Hub')}
            ${link('tutors.html', 'Tutors')}
            ${link('stories.html', 'Real stories')}
            ${link('gallery.html', 'Photo gallery')}
            ${link('app.html', 'The LDF app')}
          </div>

          <div>
            <h2>Join in</h2>
            ${link('index.html#join', 'Join our team')}
            <a href="${APP}#/join" target="_blank" rel="noopener noreferrer">Volunteer or partner</a>
            <a href="${APP}#/give" target="_blank" rel="noopener noreferrer">Give through LDF Hope</a>
            ${link('contact.html', 'Contact us')}
          </div>

          <div>
            <h2>Information</h2>
            <a href="${APP}#/policies/privacy" target="_blank" rel="noopener noreferrer">Privacy policy</a>
            <a href="${APP}#/policies/terms" target="_blank" rel="noopener noreferrer">Terms of use</a>
            <a href="${APP}#/policies/safeguarding" target="_blank" rel="noopener noreferrer">Child safeguarding</a>
            <a data-email href="#">Email LDF</a>
            <div class="foot-socials" id="foot-socials"></div>
          </div>

        </div>

        <div class="container footer-bottom">
          <span>
            © <span id="year"></span> Life Development Foundation
          </span>
          <span>People first. Progress with purpose.</span>
        </div>
      </footer>
    `;
  }

  // Main content accessibility
  const main = document.querySelector('main');

  if (main) {
    main.id = 'main-content';
  }

  // Contact email links
  const email = config.contactEmail ||
    'lifedevelopmentfoundation.uk@gmail.com';

  document.querySelectorAll('[data-email]').forEach(anchor => {
    anchor.href = `mailto:${email}`;
    anchor.textContent = email;
  });

  // Application links configured through LDF_CONFIG
  document.querySelectorAll('[data-app]').forEach(anchor => {
    const key = anchor.dataset.app;
    const url = config.apps && config.apps[key];

    if (url) {
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    } else {
      anchor.href =
        'contact.html?topic=' + encodeURIComponent(key);

      anchor.textContent =
        key === 'learning'
          ? 'Ask about Learning Hub'
          : 'Contact LDF about this service';
    }
  });

  // Current year
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Preselect contact form topic from URL
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const select = document.getElementById('topic');

  if (
    topic &&
    select &&
    [...select.options].some(option => option.value === topic)
  ) {
    select.value = topic;
  }

  // Contact form: prepare an email for the visitor to send
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const data = new FormData(form);

      const subject =
        `LDF website enquiry — ${data.get('topic') || 'General'}`;

      const body = [
        `Name: ${data.get('name') || ''}`,
        `Reply email: ${data.get('email') || ''}`,
        `Enquiry type: ${data.get('topic') || ''}`,
        '',
        `${data.get('message') || ''}`
      ].join('\n');

      const status = document.getElementById('form-message');

      if (status) {
        status.textContent =
          'Your email application should open with a prepared message. ' +
          'Please review it and press Send to submit your enquiry.';
      }

      location.href =
        `mailto:${email}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    });
  }

  // LDF, the 3D guide (loads itself after the page is ready)
  const guide = document.createElement('script');
  guide.src = 'js/ldf-guide.js';
  guide.defer = true;
  document.body.appendChild(guide);
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-more[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
})();
