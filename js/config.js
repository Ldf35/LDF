// LDF website settings. The website is the public front door; the LDF app does the real work (giving, learning, tutoring, volunteering).
window.LDF_CONFIG = {
  siteName: 'Life Development Foundation',
  // fallback only: the live e-mail comes from the app (Admin Station → Automation & settings → Website & contact)
  contactEmail: 'lifedevelopmentfoundation.docs@gmail.com',
  appUrl: 'https://ldf-platform.vercel.app/',
  // The publishable key is public by design; the database security rules decide what visitors can read or send.
  api: {
    url: 'https://ftistdcvoojfsnjibkxs.supabase.co',
    key: 'sb_publishable_r8SfB_qzK6ShMgg5-TSicg_fk-jZLEI'
  },
  apps: {
    hope: 'https://ldf-platform.vercel.app/#/give',
    learning: 'https://ldf-platform.vercel.app/#/learn',
    ai: 'https://ldf-platform.vercel.app/#/learn',
    join: 'https://ldf-platform.vercel.app/#/join',
    login: 'https://ldf-platform.vercel.app/#/login',
    tutors: 'https://ldf-platform.vercel.app/#/tutors'
  }
};
