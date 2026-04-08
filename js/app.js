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
  if (page === 'deposit')   { loadDepositHistory(); updateWdBalance(); }
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
  applyLang();
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
  if (res.error) {
    showToast(res.error, 'error');
    return;
  }

  state.user = res.user;
  updateDashboard();
  loadDepositWallet();
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

  const ads = res.ads || [];
  if (ads.length === 0) {
    container.innerHTML = `<div class="empty"><div class="empty-icon">📭</div>${t('ads_empty')}</div>`;
    return;
  }

  container.innerHTML = '<div style="padding:12px 16px">' + ads.map(ad => `
    <div class="ad-card ${ad.already_viewed ? 'viewed' : ''}"
         onclick="${ad.already_viewed ? '' : `startView(${ad.id},'${escHtml(ad.title)}','${escHtml(ad.url)}',${ad.reward_per_click})`}">
      <div class="ad-icon">📢</div>
      <div class="ad-info">
        <div class="ad-title">${escHtml(ad.title)}</div>
        <div class="ad-reward">+${parseFloat(ad.reward_per_click).toFixed(8)} USDT</div>
      </div>
      <div class="ad-status ${ad.already_viewed ? 'viewed-tag' : 'available'}">
        ${ad.already_viewed ? '✓ ' + t('ads_viewed').split(' ')[0] : t('btn_watch_ad')}
      </div>
    </div>
  `).join('') + '</div>';
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

  showToast(`+${parseFloat(res.reward).toFixed(8)} USDT ditambahkan!`, 'success');

  if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

  await refreshUser();
  setTimeout(() => nav('ads'), 2000);
}

// ============================================
// DEPOSIT
// ============================================
async function loadDepositWallet() {
  const walletEl = document.getElementById('deposit-wallet-addr');
  walletEl.textContent = '0x6355fC426155c92577147152e690A4A6475045A8'; // ganti saat deploy
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
      <div class="history-icon">💳</div>
      <div class="history-info">
        <div class="history-label">${parseFloat(d.amount).toFixed(4)} USDT</div>
        <div class="history-sub">${d.txid.slice(0,10)}...${d.txid.slice(-6)}</div>
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
// START
// ============================================
init();
