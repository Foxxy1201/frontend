// ============================================
// TELEGRAM WEBAPP
// ============================================
const tg = window.Telegram?.WebApp;

// ============================================
// NAVIGATION
// ============================================
const PAGE_MAP = {
  'dashboard': 'page-dashboard',
  'ads':       'page-ads',
  'viewer':    'page-viewer',
  'deposit':   'page-deposit',
  'withdraw':  'page-withdraw',
  'create-ad': 'page-create-ad',
  'referral':  'page-referral',
  'my-ads':    'page-my-ads',
};
const NAV_PAGES = ['dashboard', 'ads', 'deposit', 'withdraw', 'referral'];

function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const el = document.getElementById(PAGE_MAP[page]);
  if (el) el.classList.add('active');

  const navEl = document.getElementById(`nav-${page}`);
  if (navEl) navEl.classList.add('active');

  // Lazy-load page data
  if (page === 'ads')       loadAds();
  if (page === 'deposit')   { loadDepositHistory(); updateWdBalance(); loadFaucetPayConfig(); }
  if (page === 'withdraw')  { loadWithdrawHistory(); updateWdBalance(); }
  if (page === 'create-ad') updateAdDepBal();
  if (page === 'referral')  loadReferral();
  if (page === 'my-ads')    loadMyAds();
  if (page === 'withdraw')  loadWithdrawMethods();

  window.scrollTo(0, 0);
}

// ============================================
// APP INIT
// ============================================
async function init() {
  const tgId = getTelegramId();

  if (!tgId) {
    showToast(t('toast_open_tg'), 'error');
    return;
  }

  state.telegramId = tgId;
  state.username = tg?.initDataUnsafe?.user?.username || 'user';

  const deviceId = getDeviceId();

  const res = await apiPost('/api/users/register', {
    telegram_id:   tgId,
    username:      state.username,
    device_id:     deviceId,
    referral_code: new URLSearchParams(window.location.search).get('ref') || undefined,
  });

  if (!res) {
    showToast(t('toast_no_server'), 'error');
    return;
  }

  // Banned → tampilkan halaman banned, stop semua
  if (res.error && (res.error.toLowerCase().includes('banned') || res.error.toLowerCase().includes('suspicious'))) {
    showBannedScreen(res.error);
    return;
  }

  if (res.error) {
    showToast(res.error, 'error');
    return;
  }

  state.user = res.user;

  // Warning: suspicious tapi masih bisa akses
  if (res.warning) {
    showToast('⚠️ ' + res.warning, 'error');
  }

  updateDashboard();
  loadDepositWallet();
}

// ============================================
// BANNED / SUSPICIOUS SCREEN
// ============================================
function showBannedScreen(reason) {
  const isSuspicious = reason && reason.toLowerCase().includes('suspicious');
  const icon    = isSuspicious ? '⚠️' : '🚫';
  const title   = isSuspicious ? 'Account Restricted' : 'Account Banned';
  const message = isSuspicious
    ? 'Your account has been flagged for suspicious activity. Some features are temporarily restricted pending review.'
    : 'Your account has been banned due to multiple account usage or suspicious activity.';
  const sub = isSuspicious
    ? 'If you believe this is a mistake, please contact support.'
    : 'Each user is only allowed one account per device. This action is final.';

  // Hide semua page & nav
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.querySelector('.bottom-nav') && (document.querySelector('.bottom-nav').style.display = 'none');

  // Inject banned screen
  const el = document.createElement('div');
  el.id = 'banned-screen';
  el.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:#0a0c10;
    display:flex;align-items:center;justify-content:center;
    flex-direction:column;text-align:center;padding:32px;
    z-index:9999;
  `;
  el.innerHTML = `
    <div style="font-size:64px;margin-bottom:24px">${icon}</div>
    <div style="font-size:22px;font-weight:700;color:${isSuspicious ? '#f59e0b' : '#ef4444'};margin-bottom:12px">
      ${title}
    </div>
    <div style="font-size:14px;color:#94a3b8;line-height:1.7;margin-bottom:16px;max-width:300px">
      ${message}
    </div>
    <div style="font-size:12px;color:#475569;background:#1e293b;padding:12px 16px;border-radius:8px;border:1px solid #334155;max-width:300px">
      ${sub}
    </div>
  `;
  document.body.appendChild(el);
}

// ============================================
// DASHBOARD
// ============================================
function updateDashboard() {
  if (!state.user) return;
  document.getElementById('hdr-username').textContent = '@' + (state.user.username || 'user');
  document.getElementById('earn-bal').textContent = parseFloat(state.user.earning_balance).toFixed(8);
  document.getElementById('dep-bal').textContent  = parseFloat(state.user.deposit_balance).toFixed(8);
}

async function refreshUser() {
  const res = await apiGet(`/api/users/${state.telegramId}`);
  if (res?.error && res.error.toLowerCase().includes('banned')) {
    showBannedScreen(res.error);
    return;
  }
  if (res?.user) {
    state.user = res.user;
    updateDashboard();
  }
}

// ============================================
// ADS LIST
// ============================================
async function loadAds() {
  const container = document.getElementById('ads-list');
  container.innerHTML = `<div class="loading"><div class="spinner"></div>${t('ads_loading')}</div>`;

  const res = await apiGet('/api/ads', { telegram_id: state.telegramId });
  if (!res || res.error) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div>${res?.error || t('ads_load_fail')}</div>`;
    return;
  }

  const ads       = res.ads || [];
  const available = ads.filter(ad => !ad.already_viewed);
  const totalAds  = ads.length;
  const doneAds   = ads.filter(ad => ad.already_viewed).length;

  if (totalAds === 0) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">📭</div>${t('ads_empty')}</div>`;
    return;
  }

  if (available.length === 0) {
    container.innerHTML = `
      <div style="padding:24px 16px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">🎉</div>
        <div style="font-size:16px;font-weight:700;color:var(--accent);margin-bottom:8px">${t('ads_all_done_title')}</div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:20px">${t('ads_all_done_sub')}</div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;display:inline-block;min-width:160px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${t('ads_watched_today')}</div>
          <div style="font-size:22px;font-weight:700;color:var(--green)">${doneAds} / ${totalAds}</div>
        </div>
      </div>`;
    return;
  }

  // Pilih 1 iklan random dari yang tersedia
  const ad = available[Math.floor(Math.random() * available.length)];

  container.innerHTML = `
    <div style="padding:16px">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:2px">${t('ads_progress_today')}</div>
          <div style="font-size:13px;font-weight:600;color:var(--accent)">${doneAds} ${t('ads_done_of')} ${totalAds} ${t('ads_done_label')}</div>
        </div>
        <div style="font-size:22px;font-weight:700;color:var(--green)">${Math.round((doneAds/totalAds)*100)}%</div>
      </div>

      <div style="background:var(--surface);border:2px solid var(--accent);border-radius:14px;padding:20px;text-align:center;margin-bottom:16px">
        <div style="font-size:36px;margin-bottom:12px">📢</div>
        <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px;line-height:1.4">${escHtml(ad.title)}</div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:16px;word-break:break-all">${escHtml(ad.url)}</div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px;margin-bottom:16px">
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">${t('ads_reward_label')}</div>
          <div style="font-size:20px;font-weight:700;color:var(--green)">+${parseFloat(ad.reward_per_click).toFixed(8)} USDT</div>
        </div>
        <button class="btn btn-primary btn-full" onclick="startView(${ad.id},'${escHtml(ad.title)}','${escHtml(ad.url)}',${ad.reward_per_click})">
          <span style="font-size:16px">👁</span> ${t('btn_watch_ad')}
        </button>
      </div>

      <button onclick="loadAds()" style="width:100%;background:none;border:1px solid var(--border);color:var(--muted);padding:10px;border-radius:8px;font-size:13px;cursor:pointer">
        🔀 ${t('ads_shuffle')}
      </button>

      <div style="text-align:center;margin-top:12px;font-size:11px;color:var(--muted)">
        ${available.length} ${t('ads_remaining')}
      </div>
    </div>`;
}

// ============================================
// AD VIEWER
// ============================================
async function startView(adId, title, url, reward) {
  const res = await apiPost('/api/ads/view', {
    telegram_id: state.telegramId,
    ad_id:       adId,
  });

  if (!res || res.error) {
    showToast(res?.error || t('view_fail'), 'error');
    return;
  }

  state.sessionToken   = res.session_token;
  state.currentAd      = { id: adId, title, url, reward };
  state.watchSeconds   = res.watch_seconds || 30;
  state.timerCancelled = false;

  window.open(url, '_blank');
  nav('viewer');

  document.getElementById('viewer-title').textContent  = title;
  document.getElementById('viewer-reward').textContent = `+${parseFloat(reward).toFixed(8)}`;
  document.getElementById('viewer-link').href          = url;

  const claimBtn  = document.getElementById('claim-btn');
  const claimInfo = document.getElementById('claim-info');
  claimBtn.style.display    = 'none';
  claimInfo.textContent     = t('viewer_wait');
  claimInfo.dataset.state   = 'wait';

  startTimer(state.watchSeconds);
}

function startTimer(seconds) {
  if (state.timerInterval) clearInterval(state.timerInterval);

  const circle        = document.getElementById('timer-circle');
  const numEl         = document.getElementById('timer-num');
  const infoEl        = document.getElementById('claim-info');
  const claimBtn      = document.getElementById('claim-btn');
  const circumference = 2 * Math.PI * 65;

  circle.style.strokeDasharray  = circumference;
  circle.style.strokeDashoffset = 0;
  circle.style.stroke            = 'var(--accent)';

  const startAt = Date.now();
  const endAt   = startAt + (seconds * 1000);
  state.timerCancelled = false;

  numEl.textContent = seconds;

  function onVisibilityChange() {
    if (document.hidden) return; // user pergi ke tab lain = oke

    const elapsed = (Date.now() - startAt) / 1000;
    if (elapsed < seconds && !state.timerCancelled) {
      state.timerCancelled = true;
      clearInterval(state.timerInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      circle.style.stroke = '#ef4444';
      numEl.textContent   = '✕';

      infoEl.textContent   = t('viewer_cancel');
      infoEl.dataset.state = 'cancel';
      claimBtn.style.display = 'none';

      if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
      showToast(t('viewer_tab_warning'), 'error');

      setTimeout(() => nav('ads'), 2000);
    }
  }

  document.removeEventListener('visibilitychange', onVisibilityChange);
  document.addEventListener('visibilitychange', onVisibilityChange);

  state.timerInterval = setInterval(() => {
    if (state.timerCancelled) return;

    const elapsed   = (Date.now() - startAt) / 1000;
    const remaining = Math.max(0, Math.ceil(seconds - elapsed));

    numEl.textContent = remaining;
    const progress = elapsed / seconds;
    circle.style.strokeDashoffset = circumference * (1 - Math.min(progress, 1));

    if (Date.now() >= endAt) {
      clearInterval(state.timerInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      claimBtn.style.display = 'flex';
      infoEl.textContent     = t('viewer_done');
      infoEl.dataset.state   = 'done';
      circle.style.stroke    = 'var(--green)';

      if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    }
  }, 250);
}

async function claimReward() {
  const btn = document.getElementById('claim-btn');
  btn.textContent = t('claim_processing');
  btn.disabled    = true;

  const res = await apiPost('/api/ads/claim', {
    telegram_id:   state.telegramId,
    session_token: state.sessionToken,
  });

  btn.disabled = false;

  if (!res || res.error) {
    showToast(res?.error || t('claim_fail'), 'error');
    btn.innerHTML = t('viewer_claim_btn');
    return;
  }

  btn.style.display = 'none';
  const infoEl = document.getElementById('claim-info');
  infoEl.textContent   = t('viewer_claimed');
  infoEl.dataset.state = 'claimed';

  // Suspicious: reward ditahan, tampil warning
  if (res.warning || parseFloat(res.reward) === 0) {
    showToast('⚠️ ' + (res.warning || 'Reward restricted: account under review.'), 'error');
  } else {
    showToast(`+${parseFloat(res.reward).toFixed(8)} USDT added!`, 'success');
  }

  if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

  await refreshUser();
  // Load iklan random berikutnya setelah 2 detik
  setTimeout(() => {
    nav('ads');
    loadAds();
  }, 2000);
}

// ============================================
// DEPOSIT
// ============================================
// ============================================
// DEPOSIT TAB SWITCH
// ============================================
function switchDepositTab(tab) {
  const fpPanel  = document.getElementById('dep-panel-faucetpay');
  const manPanel = document.getElementById('dep-panel-manual');
  const fpBtn    = document.getElementById('dep-tab-fp');
  const manBtn   = document.getElementById('dep-tab-manual');

  if (tab === 'faucetpay') {
    fpPanel.style.display  = '';
    manPanel.style.display = 'none';
    fpBtn.style.background  = 'var(--accent)';
    fpBtn.style.color       = '#000';
    fpBtn.style.borderColor = 'var(--accent)';
    manBtn.style.background  = 'var(--surface)';
    manBtn.style.color       = 'var(--muted)';
    manBtn.style.borderColor = 'var(--border)';
  } else {
    fpPanel.style.display  = 'none';
    manPanel.style.display = '';
    manBtn.style.background  = 'var(--accent)';
    manBtn.style.color       = '#000';
    manBtn.style.borderColor = 'var(--accent)';
    fpBtn.style.background  = 'var(--surface)';
    fpBtn.style.color       = 'var(--muted)';
    fpBtn.style.borderColor = 'var(--border)';
  }
}

// ============================================
// FAUCETPAY DEPOSIT
// ============================================
let fpConfig = null;

async function loadFaucetPayConfig() {
  if (fpConfig) return; // already loaded
  const res = await apiGet('/api/deposits/faucetpay/config', { telegram_id: state.telegramId });
  if (res && !res.error) {
    fpConfig = res;
    document.getElementById('fp-merchant').value  = fpConfig.merchant_username;
    document.getElementById('fp-custom').value    = fpConfig.custom;
    document.getElementById('fp-callback').value  = fpConfig.callback_url;
    document.getElementById('fp-success').value   = fpConfig.success_url;
    document.getElementById('fp-cancel').value    = fpConfig.cancel_url;
  }
}

async function submitFaucetPay() {
  const amount = parseFloat(document.getElementById('fp-amount').value);
  if (!amount || amount < 1) {
    showToast('Enter a valid amount (minimum 1 USDT)', 'error');
    return;
  }

  await loadFaucetPayConfig();

  if (!fpConfig) {
    showToast('Failed to load payment config. Try again.', 'error');
    return;
  }

  document.getElementById('fp-amount1').value = amount.toFixed(2);
  document.getElementById('fp-form').submit();
  showToast('Redirecting to FaucetPay...', 'info');
}

async function loadDepositWallet() {
  const walletEl = document.getElementById('deposit-wallet-addr');
  walletEl.textContent = '0x6355fC426155c92577147152e690A4A6475045A8';
}

function copyWallet() {
  const addr = document.getElementById('deposit-wallet-addr').textContent;
  navigator.clipboard.writeText(addr).then(() => showToast(t('toast_wallet_copied'), 'success'));
}

async function submitDeposit() {
  const amount = document.getElementById('dep-amount').value.trim();
  const txid   = document.getElementById('dep-txid').value.trim();

  if (!amount || !txid) {
    showToast(t('toast_fill_fields'), 'error');
    return;
  }

  const res = await apiPost('/api/deposits', {
    telegram_id: state.telegramId,
    amount:      parseFloat(amount),
    txid,
  });

  if (!res || res.error) {
    showToast(res?.error || 'Gagal submit deposit', 'error');
    return;
  }

  showToast(t('toast_dep_submitted'), 'success');
  document.getElementById('dep-amount').value = '';
  document.getElementById('dep-txid').value   = '';
  loadDepositHistory();
}

async function loadDepositHistory() {
  const el = document.getElementById('dep-history');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  const res  = await apiGet('/api/deposits', { telegram_id: state.telegramId });
  const deps = res?.deposits || [];

  if (deps.length === 0) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📭</div>${t('dep_history_empty')}</div>`;
    return;
  }

  el.innerHTML = deps.map(d => `
    <div class="history-item">
      <div class="history-icon">${d.type === 'auto' ? '⚡' : '🔗'}</div>
      <div class="history-info">
        <div class="history-label">${parseFloat(d.amount).toFixed(4)} USDT</div>
        <div class="history-sub">${d.txid.slice(0,10)}...${d.txid.slice(-6)}</div>
        <div style="font-size:10px;color:var(--muted)">${d.type === 'auto' ? 'FaucetPay' : 'Manual BEP-20'}</div>
      </div>
      <div class="history-amount status-${d.status}">${t('status_' + d.status) || d.status}</div>
    </div>
  `).join('');
}

// ============================================
// WITHDRAW
// ============================================
function updateWdBalance() {
  if (state.user) {
    document.getElementById('wd-earn-bal').textContent = parseFloat(state.user.earning_balance).toFixed(8);
  }
}

async function submitWithdraw() {
  const amount    = document.getElementById('wd-amount').value.trim();
  const address   = document.getElementById('wd-address').value.trim();
  const methodSel = document.getElementById('wd-method');
  const method_id = parseInt(methodSel?.value) || null;
  const method    = wdMethods.find(m => m.id === method_id);

  if (!amount || !address) {
    showToast(t('toast_fill_fields'), 'error');
    return;
  }

  const minAmt = method ? parseFloat(method.min_amount) : 1;
  if (parseFloat(amount) < minAmt) {
    showToast(`Minimum withdraw ${minAmt} untuk metode ini`, 'error');
    return;
  }

  const res = await apiPost('/api/withdrawals', {
    telegram_id: state.telegramId,
    amount:      parseFloat(amount),
    address,
    method_id,
  });

  if (!res || res.error) {
    showToast(res?.error || 'Gagal submit withdraw', 'error');
    return;
  }

  showToast(t('toast_wd_submitted'), 'success');
  document.getElementById('wd-amount').value  = '';
  document.getElementById('wd-address').value = '';
  await refreshUser();
  updateWdBalance();
  loadWithdrawHistory();
}

async function loadWithdrawHistory() {
  const el = document.getElementById('wd-history');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  const res = await apiGet('/api/withdrawals', { telegram_id: state.telegramId });
  const wds = res?.withdrawals || [];

  if (wds.length === 0) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📭</div>${t('wd_history_empty')}</div>`;
    return;
  }

  el.innerHTML = wds.map(w => `
    <div class="history-item">
      <div class="history-icon">💸</div>
      <div class="history-info">
        <div class="history-label">${parseFloat(w.amount).toFixed(4)} USDT</div>
        <div class="history-sub">${w.address.slice(0,10)}...${w.address.slice(-6)}</div>
      </div>
      <div class="history-amount status-${w.status}">${t('status_' + w.status) || w.status}</div>
    </div>
  `).join('');
}

// ============================================
// CREATE AD
// ============================================
function updateAdDepBal() {
  if (state.user) {
    document.getElementById('ad-dep-bal').textContent = parseFloat(state.user.deposit_balance).toFixed(8);
  }
}

function calcAdPrice() {
  const clicks = parseInt(document.getElementById('ad-clicks').value) || 0;
  const price  = (clicks * 0.002).toFixed(8);
  const reward = (clicks * 0.0005).toFixed(8);
  document.getElementById('ad-price-display').textContent  = clicks > 0 ? `${price} USDT` : '-';
  document.getElementById('ad-reward-display').textContent = clicks > 0 ? `${reward} USDT` : '-';
}

async function submitCreateAd() {
  const title  = document.getElementById('ad-title').value.trim();
  const url    = document.getElementById('ad-url').value.trim();
  const clicks = parseInt(document.getElementById('ad-clicks').value);

  if (!title || !url || !clicks) {
    showToast(t('toast_fill_fields'), 'error');
    return;
  }
  if (clicks < 1000) {
    showToast(t('toast_min_clicks'), 'error');
    return;
  }

  const res = await apiPost('/api/ads/create', {
    telegram_id:  state.telegramId,
    title, url,
    total_clicks: clicks,
  });

  if (!res || res.error) {
    showToast(res?.error || 'Gagal buat iklan', 'error');
    return;
  }

  showToast(t('toast_ad_created'), 'success');
  document.getElementById('ad-title').value  = '';
  document.getElementById('ad-url').value    = '';
  document.getElementById('ad-clicks').value = '';
  calcAdPrice();
  await refreshUser();
  updateAdDepBal();
}

// ============================================
// REFERRAL
// ============================================
async function loadReferral() {
  if (!state.user) return;

  const code = state.user.referral_code;
  document.getElementById('ref-code').textContent = code;

  const el = document.getElementById('ref-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  const res = await apiGet(`/api/users/${state.telegramId}/referrals`);
  if (!res) {
    el.innerHTML = `<div class="empty">${t('ref_load_fail')}</div>`;
    return;
  }

  document.getElementById('ref-total').textContent  = res.total_referrals || 0;
  document.getElementById('ref-earned').textContent = parseFloat(res.total_earned || 0).toFixed(8);

  const refs = res.referrals || [];
  if (refs.length === 0) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">👤</div>${t('ref_list_empty')}</div>`;
    return;
  }

  el.innerHTML = refs.map(r => `
    <div class="history-item">
      <div class="history-icon">👤</div>
      <div class="history-info">
        <div class="history-label">@${r.username || 'user'}</div>
        <div class="history-sub">${r.total_klik || 0} klik</div>
      </div>
      <div class="history-amount" style="color:var(--green)">
        +${parseFloat(r.komisi_dari_user || 0).toFixed(8)}
      </div>
    </div>
  `).join('');
}

function copyRef() {
  const code = state.user?.referral_code;
  if (!code) return;
  // Ganti ptcearning_bot dengan username bot lo
  const link = `https://t.me/ptcearning_bot?start=${code}`;
  navigator.clipboard.writeText(link).then(() => showToast(t('toast_copied'), 'success'));
}


// ============================================
// MY ADS - Statistik Iklan User
// ============================================
async function loadMyAds() {
  const el = document.getElementById('my-ads-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  const res = await apiGet('/api/ads/my', { telegram_id: state.telegramId });
  const ads = res?.ads || [];

  if (ads.length === 0) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📢</div>${t('my_ads_empty')}</div>`;
    return;
  }

  el.innerHTML = '<div style="padding:12px 16px">' + ads.map(ad => {
    const done    = ad.total_clicks - ad.remaining_clicks;
    const pct     = ad.total_clicks > 0 ? Math.round((done / ad.total_clicks) * 100) : 0;
    const barColor = pct >= 100 ? 'var(--green)' : 'var(--accent)';
    const statusColor = ad.status === 'active' ? 'var(--green)' : ad.status === 'paused' ? 'var(--gold)' : 'var(--muted)';

    return `
    <div class="card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div style="font-size:14px;font-weight:600;color:var(--text);flex:1;margin-right:8px">${escHtml(ad.title)}</div>
        <div style="font-size:11px;font-weight:700;color:${statusColor};background:${statusColor}22;padding:2px 8px;border-radius:20px;white-space:nowrap">${ad.status.toUpperCase()}</div>
      </div>

      <div style="font-size:11px;color:var(--muted);margin-bottom:10px;word-break:break-all">${escHtml(ad.url)}</div>

      <div style="background:var(--surface2);border-radius:6px;height:6px;margin-bottom:8px;overflow:hidden">
        <div style="background:${barColor};height:100%;width:${pct}%;transition:width 0.5s;border-radius:6px"></div>
      </div>

      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px">
        <span style="color:var(--muted)">${t('my_ads_clicks')}</span>
        <span style="color:var(--accent);font-weight:700">${done} / ${ad.total_clicks} (${pct}%)</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--surface2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--muted);margin-bottom:4px">${t('my_ads_reward_per_click')}</div>
          <div style="font-size:13px;font-weight:700;color:var(--green)">${parseFloat(ad.reward_per_click).toFixed(4)}</div>
          <div style="font-size:10px;color:var(--muted)">USDT</div>
        </div>
        <div style="background:var(--surface2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--muted);margin-bottom:4px">${t('my_ads_total_spent')}</div>
          <div style="font-size:13px;font-weight:700;color:var(--gold)">${(done * parseFloat(ad.reward_per_click)).toFixed(4)}</div>
          <div style="font-size:10px;color:var(--muted)">USDT</div>
        </div>
      </div>

      <div style="font-size:11px;color:var(--muted);margin-top:10px">📅 ${new Date(ad.created_at).toLocaleDateString('id-ID')}</div>
    </div>`;
  }).join('') + '</div>';
}

// ============================================
// WITHDRAW METHODS
// ============================================
let wdMethods = [];

async function loadWithdrawMethods() {
  const res = await apiGet('/api/withdrawals/methods');
  wdMethods = res?.methods || [];

  const sel = document.getElementById('wd-method');
  if (!sel) return;

  if (wdMethods.length === 0) {
    sel.innerHTML = '<option value="">Tidak ada metode tersedia</option>';
    return;
  }

  sel.innerHTML = wdMethods.map(m =>
    `<option value="${m.id}">${m.name}</option>`
  ).join('');

  onMethodChange();
}

function onMethodChange() {
  const sel = document.getElementById('wd-method');
  const methodId = parseInt(sel?.value);
  const method = wdMethods.find(m => m.id === methodId);
  if (!method) return;

  // Update address label & placeholder
  const addrLbl = document.getElementById('wd-addr-lbl');
  const addrInp = document.getElementById('wd-address');
  if (addrLbl) addrLbl.textContent = method.address_label;
  if (addrInp) addrInp.placeholder = method.address_placeholder;

  // Update desc
  const desc = document.getElementById('wd-method-desc');
  if (desc) desc.textContent = method.description || '';

  // Update min
  const minVal = document.getElementById('wd-min-val');
  if (minVal) minVal.textContent = `${parseFloat(method.min_amount).toFixed(2)}`;

  // Update fee display
  const feeVal = document.getElementById('wd-fee-val');
  if (feeVal) {
    if (method.fee_type === 'fixed') {
      feeVal.textContent = parseFloat(method.fee_value) > 0 ? `${parseFloat(method.fee_value).toFixed(4)}` : 'Gratis';
    } else {
      feeVal.textContent = parseFloat(method.fee_value) > 0 ? `${parseFloat(method.fee_value)}%` : 'Gratis';
    }
  }

  calcWdReceived();
}

function calcWdReceived() {
  const sel = document.getElementById('wd-method');
  const methodId = parseInt(sel?.value);
  const method = wdMethods.find(m => m.id === methodId);
  const amt = parseFloat(document.getElementById('wd-amount')?.value) || 0;
  const el  = document.getElementById('wd-received-val');
  if (!el || !method) return;

  let fee = 0;
  if (method.fee_type === 'fixed') fee = parseFloat(method.fee_value);
  else fee = amt * (parseFloat(method.fee_value) / 100);

  const received = Math.max(0, amt - fee);
  el.textContent = received > 0 ? `${received.toFixed(4)}` : '-';
}

// ============================================
// TOAST
// ============================================
let toastTimeout;
function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast ${type} show`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 3000);
}

// ============================================
// HELPERS
// ============================================
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// HELPERS: Telegram ID + Device Fingerprint
// ============================================

function getTelegramId() {
  // 1. Dari Telegram WebApp initDataUnsafe
  const fromTg = tg?.initDataUnsafe?.user?.id;
  if (fromTg) return String(fromTg);

  // 2. Fallback: dari URL param ?tgid=
  const fromUrl = new URLSearchParams(window.location.search).get('tgid');
  if (fromUrl) return fromUrl;

  return null;
}

// Generate canvas fingerprint
function _canvasFingerprint() {
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('ptc-fp', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('ptc-fp', 4, 17);
    return c.toDataURL().slice(-32);
  } catch (e) {
    return 'no-canvas';
  }
}

// Build browser fingerprint hash
function _buildFingerprint() {
  const parts = [
    navigator.userAgent || '',
    navigator.language || '',
    screen.width + 'x' + screen.height,
    screen.colorDepth || '',
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    navigator.hardwareConcurrency || '',
    navigator.platform || '',
    _canvasFingerprint(),
  ];
  // Simple hash
  const str = parts.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Get or create persistent localStorage ID
function _getLocalId() {
  let id = localStorage.getItem('_ptc_lid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('_ptc_lid', id);
  }
  return id;
}

// Combine fingerprint + localStorage ID as device_id
function getDeviceId() {
  const fp      = _buildFingerprint();
  const localId = _getLocalId();
  return `${fp}_${localId}`;
}

// ============================================
// START
// ============================================
init();
