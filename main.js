(() => {
  const config = window.LDF_CONFIG || {};
  const current = location.pathname.split('/').pop() || 'index.html';
  const nav = [
    ['index.html','Home'],['about.html','About'],['our-work.html','Our Work'],['hope.html','HOPE'],['learning.html','Learning Hub'],['impact.html','Impact'],['gallery.html','Gallery'],['get-involved.html','Get Involved'],['contact.html','Contact']
  ];
  const link = (href,label,cls='') => `<a class="${cls}" href="${href}"${current===href?' aria-current="page"':''}>${label}</a>`;
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="container nav-wrap"><a class="brand" href="index.html" aria-label="Life Development Foundation home"><img src="assets/images/ldf-mark.svg" alt=""><span><strong>LDF</strong><small>Life Development Foundation</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span><span class="sr-only">Toggle navigation</span></button><nav id="primary-nav" class="primary-nav" aria-label="Main navigation">${nav.map(([href,label])=>link(href,label)).join('')}<a class="nav-cta" href="get-involved.html">Get involved</a></nav></div></header>`;
    const toggle=header.querySelector('.menu-toggle'), menu=header.querySelector('.primary-nav');
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('is-open',!open);});
    menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}});
  }
  const footer = document.getElementById('site-footer');
  if(footer) footer.innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div><a class="brand brand-footer" href="index.html"><img src="assets/images/ldf-mark.svg" alt=""><span><strong>LDF</strong><small>Life Development Foundation</small></span></a><p>Encouraging learning, dignity and positive community development.</p></div><div><h2>Explore</h2>${link('about.html','About LDF')}${link('our-work.html','Our work')}${link('hope.html','HOPE Project')}${link('learning.html','Learning Hub')}${link('impact.html','Impact & reports')}</div><div><h2>Participate</h2>${link('get-involved.html','Get involved')}${link('gallery.html','Gallery')}${link('contact.html','Contact')}</div><div><h2>Information</h2>${link('privacy.html','Privacy policy')}${link('terms.html','Terms of use')}${link('accessibility.html','Accessibility')}<a data-email href="#">Email LDF</a></div></div><div class="container footer-bottom"><span>© <span id="year"></span> Life Development Foundation</span><span>People first. Progress with purpose.</span></div></footer>`;
  const main = document.querySelector('main'); if(main) main.id='main-content';
  document.querySelectorAll('[data-email]').forEach(a=>{const email=config.contactEmail||'lifedevelopmentfoundation.uk@gmail.com';a.href=`mailto:${email}`;if(a.textContent.trim()==='LDF')a.textContent=email;else a.textContent=email;});
  document.querySelectorAll('[data-app]').forEach(a=>{const key=a.dataset.app,url=config.apps&&config.apps[key];if(url){a.href=url;a.target='_blank';a.rel='noopener noreferrer';}else{a.href='contact.html?topic='+encodeURIComponent(key);a.textContent=key==='learning'?'Ask about Learning Hub':'Contact LDF about this service';}});
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  const topic=new URLSearchParams(location.search).get('topic');const select=document.getElementById('topic');if(topic&&select&&[...select.options].some(o=>o.value===topic))select.value=topic;
  const form=document.getElementById('contact-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const email=config.contactEmail||'lifedevelopmentfoundation.uk@gmail.com';const subject=`LDF website enquiry — ${d.get('topic')}`;const body=`Name: ${d.get('name')}
Reply email: ${d.get('email')}
Enquiry type: ${d.get('topic')}

${d.get('message')}`;const status=document.getElementById('form-message');if(status)status.textContent='Your email application should open with a prepared message. Please review it and press Send to submit your enquiry.';location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;});
})();
