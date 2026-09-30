const measurementId = 'G-WW8K4HSBZY';
const consentKey = 'smartlead-cookie-consent';
const consentRegions = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];

function savedConsent() {
  try { return localStorage.getItem(consentKey); } catch { return null; }
}

function rememberConsent(value) {
  try { localStorage.setItem(consentKey, value); } catch {}
}

window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  region: consentRegions
});
const previousChoice = savedConsent();
if (previousChoice === 'accepted' || previousChoice === 'declined') {
  window.gtag('consent', 'update', {
    analytics_storage: previousChoice === 'accepted' ? 'granted' : 'denied'
  });
}
window.gtag('js', new Date());
window.gtag('config', measurementId, {
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
const script = document.createElement('script');
script.async = true;
script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
document.head.append(script);

const banner = document.querySelector('.cookie-banner');
if (banner) {
  banner.hidden = true;
  banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
    rememberConsent('accepted');
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    banner.hidden = true;
  });
  banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
    rememberConsent('declined');
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
    banner.hidden = true;
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.addEventListener('click', () => { banner.hidden = false; });
  });
  if (!previousChoice) {
    fetch('/api/visitor-region')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(({ country }) => { banner.hidden = !consentRegions.includes(country); })
      .catch(() => { banner.hidden = false; });
  }
}

export function trackEvent(name, parameters = {}) {
  window.gtag('event', name, parameters);
}

document.addEventListener('click', event => {
  const link = event.target.closest?.('a[href]');
  if (!link) return;
  let contactMethod;
  if (link.href.startsWith('tel:')) contactMethod = 'phone';
  else if (link.hostname === 't.me') contactMethod = 'telegram';
  if (contactMethod) trackEvent('contact_click', { contact_method: contactMethod });
});
