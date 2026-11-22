// Manavea website settings. The website is the public front door; the Manavea app does the real work (giving, learning, tutoring, volunteering).
window.LDF_CONFIG = {
  siteName: 'Manavea',
  // fallback only: the live e-mail comes from the app (Admin Station → Automation & settings → Website & contact)
  contactEmail: 'lifedevelopmentfoundation.docs@gmail.com',
  appUrl: 'https://manavea-platform.vercel.app/',
  // The publishable key is public by design; the database security rules decide what visitors can read or send.
  api: {
    url: 'https://ftistdcvoojfsnjibkxs.supabase.co',
    key: 'sb_publishable_r8SfB_qzK6ShMgg5-TSicg_fk-jZLEI'
  },
  apps: {
    hope: 'https://manavea-platform.vercel.app/#/give',
    learning: 'https://manavea-platform.vercel.app/#/learn',
    ai: 'https://manavea-platform.vercel.app/#/learn',
    join: 'https://manavea-platform.vercel.app/#/join',
    login: 'https://manavea-platform.vercel.app/#/login',
    tutors: 'https://manavea-platform.vercel.app/#/tutors'
  }
};
