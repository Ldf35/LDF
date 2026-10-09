/* LDF WEBSITE SETTINGS
   Update application URLs only with verified, deployed destinations.
   Keep private admin URLs out of public configuration if they should not be advertised. */
window.LDF_CONFIG = {
  siteName: 'Life Development Foundation',
  contactEmail: 'lifedevelopmentfoundation.uk@gmail.com',
  apps: {
    hope: 'https://script.google.com/macros/s/AKfycbyXmnYe5RiG8bFVPamU2XUTQ7HWYsAjoyaZg_XvslBXCzIAtwJJ6gKxId8X5cZ6cg8u/exec',
    learning: '', // Add the verified Learning Hub deployment URL.
    ai: 'https://ldf-ai-gateway.lifedevelopmentfoundation-docs.workers.dev/',
    admin: '' // Keep blank until the correct, access-controlled Admin Central URL is confirmed.
  }
};
