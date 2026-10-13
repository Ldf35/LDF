
(() => {
  'use strict';

  const config = window.LDF_CONFIG || {};
  const current = location.pathname.split('/').pop() || 'index.html';

  // Main website navigation
  const nav = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['our-work.html', 'Our Work'],
    ['hope.html', 'HOPE'],
    ['learning.html', 'Learning Hub'],
    ['impact.html', 'Impact'],
    ['gallery.html', 'Gallery'],
    ['get-involved.html', 'Get Involved'],
    ['contact.html', 'Contact']
  ];

  // LDF application links
  const adminLinks = [
    {
      label: 'LDF Command Centre',
      url: 'https://script.google.com/macros/s/AKfycbznYDpg7g5EPeShKGuFAKV_8EJ35Ma65Ifsg0Osiol0F_CIIbp8xQDYzW3KI5in13BW/exec'
    },
    {
      label: 'HOPE Project',
      url: 'https://script.google.com/macros/s/AKfycbyXmnYe5Ri8G8bFVPamU2XUTQ7HWYsAjoyaZg_XvslBXCzIAtwJJ6gKxId8X5cZ6cg8u/exec'
    },
    {
      label: 'Learning Hub',
      url: 'https://ldf35.github.io/ldf-hub/#/login'
    }
  ];

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
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
            <span class="sr-only">Toggle navigation</span>
          </button>

          <nav
            id="primary-nav"
            class="primary-nav"
            aria-label="Main navigation"
          >
            ${nav.map(([href, label]) => link(href, label)).join('')}

            <a class="nav-cta" href="get-involved.html">
              Get involved
            </a>

            <div class="admin-menu">
              <button
                class="admin-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="admin-dropdown"
              >
                Admin <span aria-hidden="true">▾</span>
              </button>

              <div
                class="admin-dropdown"
                id="admin-dropdown"
                hidden
              >
                ${adminLinks.map(item => `
                  <a
                    href="${item.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >${item.label}</a>
                `).join('')}
              </div>
            </div>
          </nav>

        </div>
      </header>
    `;

    const toggle = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.primary-nav');
    const adminToggle = header.querySelector('.admin-toggle');
    const adminMenu = header.querySelector('.admin-menu');
    const adminDropdown = header.querySelector('.admin-dropdown');

    // Mobile main navigation
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
      });
    }

    // Admin dropdown
    if (adminToggle && adminMenu && adminDropdown) {
      adminToggle.addEventListener('click', () => {
        const open =
          adminToggle.getAttribute('aria-expanded') === 'true';

        adminToggle.setAttribute('aria-expanded', String(!open));
        adminMenu.classList.toggle('is-open', !open);
        adminDropdown.hidden = open;
      });

      // Close when clicking outside the Admin menu
      document.addEventListener('click', event => {
        if (!adminMenu.contains(event.target)) {
          adminToggle.setAttribute('aria-expanded', 'false');
          adminMenu.classList.remove('is-open');
          adminDropdown.hidden = true;
        }
      });

      // Close dropdown with Escape
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          adminToggle.setAttribute('aria-expanded', 'false');
          adminMenu.classList.remove('is-open');
          adminDropdown.hidden = true;
          adminToggle.focus();
        }
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
            ${link('about.html', 'About LDF')}
            ${link('our-work.html', 'Our work')}
            ${link('hope.html', 'HOPE Project')}
            ${link('learning.html', 'Learning Hub')}
            ${link('impact.html', 'Impact & reports')}
          </div>

          <div>
            <h2>Participate</h2>
            ${link('get-involved.html', 'Get involved')}
            ${link('gallery.html', 'Gallery')}
            ${link('contact.html', 'Contact')}
          </div>

          <div>
            <h2>Information</h2>
            ${link('privacy.html', 'Privacy policy')}
            ${link('terms.html', 'Terms of use')}
            ${link('accessibility.html', 'Accessibility')}
            <a data-email href="#">Email LDF</a>
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
})();
