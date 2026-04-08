// ============================================
// i18n — LANGUAGE SYSTEM
// ============================================

const i18n = {
  id: {
    // Dashboard
    earning:        'Earning',
    deposit_bal:    'Deposit',
    btn_watch:      '👁 Tonton',
    btn_deposit:    '💳 Deposit',
    btn_withdraw:   '💸 Withdraw',
    quick_actions:  'Aksi Cepat',
    btn_post_ad:    '📢 Pasang Iklan',
    btn_referral:   '🔗 Referral',

    // Ads
    ads_title:      '👁 Iklan Tersedia',
    ads_refresh:    '↻ Refresh',
    ads_loading:    'Memuat iklan...',
    ads_empty:      'Tidak ada iklan tersedia saat ini.',
    ads_viewed:     'Sudah ditonton hari ini',
    btn_watch_ad:   'Tonton',

    // Viewer
    viewer_title:       'Sedang Ditonton',
    viewer_open:        '🔗 Buka Halaman Iklan',
    viewer_seconds:     'detik',
    viewer_reward_lbl:  'Reward Kamu',
    viewer_claim_btn:   '✅ Klaim Reward',
    viewer_wait:        '⏳ Tetap di tab iklan selama 30 detik...',
    viewer_done:        '✅ Timer selesai! Klaim reward kamu.',
    viewer_claimed:     '🎉 Reward berhasil diklaim!',
    viewer_cancel:      '❌ Gagal! Kamu meninggalkan tab iklan sebelum 30 detik.',
    viewer_tab_warning: 'Kamu harus berada di tab iklan selama 30 detik!',

    // Deposit
    deposit_title:       '💳 Deposit',
    deposit_wallet_lbl:  'Alamat Wallet BEP-20',
    deposit_copy_wallet: '📋 Copy Alamat',
    deposit_warning:     '⚠️ Pastikan jaringan <b>BNB Smart Chain (BEP-20)</b>! Jangan kirim dari chain lain.',
    deposit_amount_lbl:  'Jumlah USDT yang Dikirim',
    deposit_amount_ph:   'contoh: 10',
    deposit_amount_hint: 'Minimum 1 USDT',
    deposit_txid_lbl:    'TXID / Hash Transaksi',
    deposit_txid_hint:   'Bisa dicek di BSCScan',
    deposit_submit:      '📤 Submit Deposit',
    deposit_history:     'Riwayat Deposit',

    // Withdraw
    withdraw_title:      '💸 Withdraw',
    withdraw_bal_lbl:    'Earning Balance',
    withdraw_amount_lbl: 'Jumlah Withdraw (USDT)',
    withdraw_amount_ph:  'Minimum 1 USDT',
    withdraw_addr_lbl:   'Alamat Wallet BEP-20 Tujuan',
    withdraw_submit:     '💸 Ajukan Withdraw',
    withdraw_history:    'Riwayat Withdraw',

    // Create Ad
    create_ad_title:     '📢 Pasang Iklan',
    create_ad_dep_lbl:   'Deposit Balance',
    create_ad_title_lbl: 'Judul Iklan',
    create_ad_title_ph:  'Nama / judul iklan kamu',
    create_ad_url_lbl:   'URL Tujuan',
    create_ad_clicks_lbl:'Jumlah Klik',
    create_ad_clicks_ph: 'Minimum 1000',
    create_ad_hint:      'Harga per klik: 0.002 USDT | Reward user: 0.0005 USDT',
    create_ad_cost:      'Total Biaya',
    create_ad_reward:    'Total Reward Dibagi',
    create_ad_submit:    '🚀 Buat Iklan',

    // Referral
    referral_title:      '🔗 Referral',
    referral_code_lbl:   'Kode Referral Kamu',
    referral_copy:       '📋 Copy Link Referral',
    referral_info:       '💡 Setiap user yang daftar via link kamu dan klik iklan,<br/>kamu dapat <b style="color:var(--green)">10% dari reward</b> mereka secara otomatis!',
    referral_total:      'Total Referral',
    referral_earned:     'Total Komisi (USDT)',
    referral_list:       'Daftar Referral',

    // Nav
    nav_home:     'Home',
    nav_ads:      'Iklan',
    nav_deposit:  'Deposit',
    nav_withdraw: 'Withdraw',
    nav_referral: 'Referral',

    // Toast
    toast_copied:        'Link referral disalin!',
    toast_wallet_copied: 'Alamat wallet disalin!',
    toast_no_server:     'Tidak bisa konek server',
    toast_open_tg:       'Buka dari Telegram Bot ya!',
    toast_fill_fields:   'Isi semua field dulu',
    toast_min_clicks:    'Minimum 1000 klik',
    toast_dep_submitted: 'Deposit disubmit! Tunggu konfirmasi admin.',
    toast_wd_submitted:  'Withdraw disubmit! Proses 1x24 jam.',
    toast_ad_created:    'Iklan berhasil dibuat! 🎉',

    // Dynamic messages
    ads_load_fail:       'Gagal memuat iklan',
    view_fail:           'Gagal mulai tonton',
    claim_fail:          'Gagal claim',
    claim_processing:    '⏳ Memproses...',
    ref_load_fail:       'Gagal memuat data',

    // History status
    status_pending:  'Pending',
    status_approved: 'Disetujui',
    status_rejected: 'Ditolak',
    status_active:   'Aktif',
    status_finished: 'Selesai',
    history_empty:   'Belum ada riwayat.',
    ref_empty:       'Belum ada referral.',

    // History inline
    dep_history_empty: 'Belum ada riwayat deposit',
    wd_history_empty:  'Belum ada riwayat withdraw',
    ref_list_empty:    'Belum ada referral',
  },

  en: {
    // Dashboard
    earning:        'Earning',
    deposit_bal:    'Deposit',
    btn_watch:      '👁 Watch',
    btn_deposit:    '💳 Deposit',
    btn_withdraw:   '💸 Withdraw',
    quick_actions:  'Quick Actions',
    btn_post_ad:    '📢 Post Ad',
    btn_referral:   '🔗 Referral',

    // Ads
    ads_title:      '👁 Available Ads',
    ads_refresh:    '↻ Refresh',
    ads_loading:    'Loading ads...',
    ads_empty:      'No ads available right now.',
    ads_viewed:     'Already watched today',
    btn_watch_ad:   'Watch',

    // Viewer
    viewer_title:       'Watching',
    viewer_open:        '🔗 Open Ad Page',
    viewer_seconds:     'sec',
    viewer_reward_lbl:  'Your Reward',
    viewer_claim_btn:   '✅ Claim Reward',
    viewer_wait:        '⏳ Stay on the ad tab for 30 seconds...',
    viewer_done:        '✅ Timer done! Claim your reward.',
    viewer_claimed:     '🎉 Reward claimed successfully!',
    viewer_cancel:      '❌ Failed! You left the ad tab before 30 seconds.',
    viewer_tab_warning: 'You must stay on the ad tab for 30 seconds!',

    // Deposit
    deposit_title:       '💳 Deposit',
    deposit_wallet_lbl:  'BEP-20 Wallet Address',
    deposit_copy_wallet: '📋 Copy Address',
    deposit_warning:     '⚠️ Make sure to use <b>BNB Smart Chain (BEP-20)</b>! Do not send from other chains.',
    deposit_amount_lbl:  'USDT Amount Sent',
    deposit_amount_ph:   'e.g. 10',
    deposit_amount_hint: 'Minimum 1 USDT',
    deposit_txid_lbl:    'TXID / Transaction Hash',
    deposit_txid_hint:   'Can be verified on BSCScan',
    deposit_submit:      '📤 Submit Deposit',
    deposit_history:     'Deposit History',

    // Withdraw
    withdraw_title:      '💸 Withdraw',
    withdraw_bal_lbl:    'Earning Balance',
    withdraw_amount_lbl: 'Withdraw Amount (USDT)',
    withdraw_amount_ph:  'Minimum 1 USDT',
    withdraw_addr_lbl:   'BEP-20 Destination Wallet',
    withdraw_submit:     '💸 Request Withdraw',
    withdraw_history:    'Withdraw History',

    // Create Ad
    create_ad_title:     '📢 Post Ad',
    create_ad_dep_lbl:   'Deposit Balance',
    create_ad_title_lbl: 'Ad Title',
    create_ad_title_ph:  'Your ad name / title',
    create_ad_url_lbl:   'Target URL',
    create_ad_clicks_lbl:'Number of Clicks',
    create_ad_clicks_ph: 'Minimum 1000',
    create_ad_hint:      'Price per click: 0.002 USDT | User reward: 0.0005 USDT',
    create_ad_cost:      'Total Cost',
    create_ad_reward:    'Total Reward Shared',
    create_ad_submit:    '🚀 Create Ad',

    // Referral
    referral_title:      '🔗 Referral',
    referral_code_lbl:   'Your Referral Code',
    referral_copy:       '📋 Copy Referral Link',
    referral_info:       '💡 Every user who signs up via your link and clicks ads,<br/>you earn <b style="color:var(--green)">10% of their reward</b> automatically!',
    referral_total:      'Total Referrals',
    referral_earned:     'Total Commission (USDT)',
    referral_list:       'Referral List',

    // Nav
    nav_home:     'Home',
    nav_ads:      'Ads',
    nav_deposit:  'Deposit',
    nav_withdraw: 'Withdraw',
    nav_referral: 'Referral',

    // Toast
    toast_copied:        'Referral link copied!',
    toast_wallet_copied: 'Wallet address copied!',
    toast_no_server:     'Cannot connect to server',
    toast_open_tg:       'Please open from Telegram Bot!',
    toast_fill_fields:   'Please fill all fields',
    toast_min_clicks:    'Minimum 1000 clicks',
    toast_dep_submitted: 'Deposit submitted! Awaiting admin confirmation.',
    toast_wd_submitted:  'Withdraw submitted! Processing within 24 hours.',
    toast_ad_created:    'Ad created successfully! 🎉',

    // Dynamic messages
    ads_load_fail:       'Failed to load ads',
    view_fail:           'Failed to start viewing',
    claim_fail:          'Failed to claim',
    claim_processing:    '⏳ Processing...',
    ref_load_fail:       'Failed to load data',

    // History status
    status_pending:  'Pending',
    status_approved: 'Approved',
    status_rejected: 'Rejected',
    status_active:   'Active',
    status_finished: 'Finished',
    history_empty:   'No history yet.',
    ref_empty:       'No referrals yet.',

    // History inline
    dep_history_empty: 'No deposit history yet',
    wd_history_empty:  'No withdraw history yet',
    ref_list_empty:    'No referrals yet',
  }
};

let currentLang = localStorage.getItem('ptc_lang') || 'id';

function t(key) {
  return i18n[currentLang]?.[key] ?? i18n['id']?.[key] ?? key;
}

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('ptc_lang', currentLang);
  applyLang();
}

function applyLang() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = currentLang === 'id' ? '🌐 EN' : '🌐 ID';

  // Dashboard
  _setText('btn-watch-text',      t('btn_watch'));
  _setText('btn-deposit-text',    t('btn_deposit'));
  _setText('btn-withdraw-text',   t('btn_withdraw'));
  _setText('quick-actions-title', t('quick_actions'));
  _setText('btn-post-ad-text',    t('btn_post_ad'));
  _setText('btn-referral-text',   t('btn_referral'));

  // Ads
  _setText('ads-page-title',  t('ads_title'));
  _setText('ads-refresh-btn', t('ads_refresh'));

  // Viewer
  _setText('viewer-page-title',   t('viewer_title'));
  _setText('viewer-open-link',    t('viewer_open'));
  _setText('viewer-seconds-lbl',  t('viewer_seconds'));
  _setText('viewer-reward-label', t('viewer_reward_lbl'));
  _setHtml('claim-btn',           t('viewer_claim_btn'));

  const claimInfoEl = document.getElementById('claim-info');
  if (claimInfoEl) {
    const state = claimInfoEl.dataset.state;
    const msgMap = { wait: 'viewer_wait', done: 'viewer_done', cancel: 'viewer_cancel' };
    _setText('claim-info', t(msgMap[state] ?? 'viewer_wait'));
  }

  // Deposit
  _setText('deposit-page-title', t('deposit_title'));
  _setText('deposit-wallet-lbl', t('deposit_wallet_lbl'));
  _setText('deposit-copy-btn',   t('deposit_copy_wallet'));
  _setHtml('deposit-warning',    t('deposit_warning'));
  _setText('dep-amount-lbl',     t('deposit_amount_lbl'));
  _setAttr('dep-amount', 'placeholder', t('deposit_amount_ph'));
  _setText('dep-amount-hint',    t('deposit_amount_hint'));
  _setText('dep-txid-lbl',       t('deposit_txid_lbl'));
  _setText('dep-txid-hint',      t('deposit_txid_hint'));
  _setText('dep-submit-btn',     t('deposit_submit'));
  _setText('dep-history-title',  t('deposit_history'));

  // Withdraw
  _setText('withdraw-page-title', t('withdraw_title'));
  _setText('wd-bal-lbl',          t('withdraw_bal_lbl'));
  _setText('wd-amount-lbl',       t('withdraw_amount_lbl'));
  _setAttr('wd-amount', 'placeholder', t('withdraw_amount_ph'));
  _setText('wd-addr-lbl',         t('withdraw_addr_lbl'));
  _setText('wd-submit-btn',       t('withdraw_submit'));
  _setText('wd-history-title',    t('withdraw_history'));

  // Create Ad
  _setText('create-ad-page-title',  t('create_ad_title'));
  _setText('create-ad-dep-lbl',     t('create_ad_dep_lbl'));
  _setText('create-ad-title-lbl',   t('create_ad_title_lbl'));
  _setAttr('ad-title', 'placeholder', t('create_ad_title_ph'));
  _setText('create-ad-url-lbl',     t('create_ad_url_lbl'));
  _setText('create-ad-clicks-lbl',  t('create_ad_clicks_lbl'));
  _setAttr('ad-clicks', 'placeholder', t('create_ad_clicks_ph'));
  _setText('create-ad-hint',        t('create_ad_hint'));
  _setText('create-ad-cost-lbl',    t('create_ad_cost'));
  _setText('create-ad-reward-lbl',  t('create_ad_reward'));
  _setText('create-ad-submit-btn',  t('create_ad_submit'));

  // Referral
  _setText('referral-page-title', t('referral_title'));
  _setText('referral-code-lbl',   t('referral_code_lbl'));
  _setText('referral-copy-btn',   t('referral_copy'));
  _setHtml('referral-info',       t('referral_info'));
  _setText('referral-total-lbl',  t('referral_total'));
  _setText('referral-earned-lbl', t('referral_earned'));
  _setText('referral-list-title', t('referral_list'));

  // Bottom Nav
  _setText('nav-home-lbl',     t('nav_home'));
  _setText('nav-ads-lbl',      t('nav_ads'));
  _setText('nav-deposit-lbl',  t('nav_deposit'));
  _setText('nav-withdraw-lbl', t('nav_withdraw'));
  _setText('nav-referral-lbl', t('nav_referral'));
}

// DOM helpers
function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function _setHtml(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}
function _setAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}
