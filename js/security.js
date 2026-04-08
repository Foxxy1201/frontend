// ============================================
// SECURITY: Telegram Detection + Anti DevTools
// ============================================

const _lang = navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en';
const _msg = {
  notTelegram: {
    id: { title: 'Akses Ditolak', sub: 'Halaman ini hanya bisa dibuka melalui Telegram Mini App.', hint: 'Buka bot kami di Telegram untuk mengakses aplikasi ini.' },
    en: { title: 'Access Denied', sub: 'This page can only be accessed through Telegram Mini App.', hint: 'Open our bot on Telegram to access this application.' }
  },
  devtools: {
    id: { title: 'Akses Diblokir', sub: 'Developer tools terdeteksi.', hint: 'Tutup developer tools untuk melanjutkan.' },
    en: { title: 'Access Blocked', sub: 'Developer tools detected.', hint: 'Close developer tools to continue.' }
  }
};

function _showBlock(type) {
  const m = _msg[type][_lang];
  document.open();
  document.write("<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>" + m.title + "</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0c10;color:#e2e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px}.wrap{max-width:320px}.icon{font-size:64px;margin-bottom:24px}.title{font-size:22px;font-weight:700;color:#ef4444;margin-bottom:12px}.sub{font-size:14px;color:#94a3b8;line-height:1.6;margin-bottom:16px}.hint{font-size:12px;color:#475569;background:#1e293b;padding:12px;border-radius:8px;border:1px solid #334155}</style></head><body><div class=\"wrap\"><div class=\"icon\">&#x1F512;</div><div class=\"title\">" + m.title + "</div><div class=\"sub\">" + m.sub + "</div><div class=\"hint\">" + m.hint + "</div></div></body></html>");
  document.close();
}

// 1. Cek apakah dibuka dari Telegram
function _isTelegram() {
  if (/Telegram/i.test(navigator.userAgent || "")) return true;
  if (window.TelegramWebviewProxy) return true;
  if (window.Telegram?.WebApp?.initData && window.Telegram.WebApp.initData !== "") return true;
  if (new URLSearchParams(window.location.search).get("tgid")) return true;
  return false;
}

if (!_isTelegram()) {
  _showBlock("notTelegram");
}

// 2. Disable klik kanan
document.addEventListener("contextmenu", e => e.preventDefault());

// 3. Disable keyboard shortcuts
document.addEventListener("keydown", function(e) {
  if (e.key === "F12") { e.preventDefault(); return false; }
  if (e.ctrlKey && ["u","U","s","S"].includes(e.key)) { e.preventDefault(); return false; }
  if (e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C","k","K"].includes(e.key)) { e.preventDefault(); return false; }
  if (e.metaKey && e.altKey && ["i","I"].includes(e.key)) { e.preventDefault(); return false; }
});

// 4. Detect DevTools (window size method)
(function() {
  var threshold = 160;
  var blocked = false;
  setInterval(function() {
    var wDiff = window.outerWidth - window.innerWidth;
    var hDiff = window.outerHeight - window.innerHeight;
    if ((wDiff > threshold || hDiff > threshold) && !blocked) {
      blocked = true;
      _showBlock("devtools");
    }
  }, 1000);
})();
