const measurementId = 'G-WW8K4HSBZY';
const consentKey = 'smartlead-cookie-consent';
let analyticsReady = false;

function savedConsent() {
  try { return localStorage.getItem(consentKey); } catch { return null; }
}

function rememberConsent(value) {
  try { localStorage.setItem(consentKey, value); } catch {}
}

function startAnalytics() {
  if (analyticsReady) return;
  analyticsReady = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  window.gtag('js', new Date());
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}

function setupConsent() {
  const banner = document.querySelector('.cookie-banner');
  const consent = savedConsent();
  if (consent === 'accepted') startAnalytics();
  if (banner) {
    banner.hidden = consent === 'accepted' || consent === 'declined';
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      rememberConsent('accepted');
      banner.hidden = true;
      startAnalytics();
    });
    banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
      const wasTracking = analyticsReady;
      rememberConsent('declined');
      banner.hidden = true;
      if (wasTracking) location.reload();
    });
  }
  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.addEventListener('click', () => {
      if (banner) banner.hidden = false;
    });
  });
}

export function trackEvent(name, parameters = {}) {
  if (analyticsReady && savedConsent() === 'accepted') {
    window.gtag('event', name, parameters);
  }
}

setupConsent();

document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!link) return;
  let contactMethod;
  if (link.href.startsWith('tel:')) contactMethod = 'phone';
  else if (link.hostname === 't.me') contactMethod = 'telegram';
  if (contactMethod) trackEvent('contact_click', { contact_method: contactMethod });
});
