// ============================================
// CONFIG — GANTI INI
// ============================================
const API_BASE = 'https://gasoline-qty-pasta-mental.trycloudflare.com'; // ← ganti URL Cloudflare Tunnel lo

// ============================================
// GLOBAL STATE
// ============================================
const state = {
  telegramId:     null,
  username:       null,
  user:           null,
  sessionToken:   null,
  currentAd:      null,
  timerInterval:  null,
  watchSeconds:   30,
  timerCancelled: false,
};

// ============================================
// TELEGRAM MINI APP INIT
// ============================================
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#0a0c10');
  tg.setBackgroundColor('#0a0c10');
}

// Ambil telegram_id dari query param atau dari Telegram WebApp
function getTelegramId() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('tgid');
  if (fromUrl) return fromUrl;
  if (tg?.initDataUnsafe?.user?.id) return String(tg.initDataUnsafe.user.id);
  return null;
}

// ============================================
// DEVICE ID — persistent via localStorage
// ============================================
function getDeviceId() {
  let id = localStorage.getItem('ptc_did');
  if (!id) {
    id = 'web_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('ptc_did', id);
  }
  return id;
}

// ============================================
// API HELPERS
// ============================================
async function apiGet(path, params = {}) {
  try {
    const qs  = new URLSearchParams(params).toString();
    const url = `${API_BASE}${path}${qs ? '?' + qs : ''}`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    return await res.json();
  } catch (e) {
    console.error('GET error', path, e);
    return null;
  }
}

async function apiPost(path, body = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('POST error', path, e);
    return null;
  }
}
