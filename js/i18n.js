// ============================================
// i18n — ENGLISH ONLY
// ============================================

const i18n = {
  // Dashboard
  earning:        'Earning',
  deposit_bal:    'Deposit',
  btn_watch:      '👁 Watch',
  btn_deposit:    '💳 Deposit',
  btn_withdraw:   '💸 Withdraw',
  quick_actions:  'Quick Actions',
  btn_post_ad:    '📢 Post Ad',
  btn_referral:   '🔗 Referral',

  // Ads list
  ads_title:      '👁 Available Ads',
  ads_refresh:    '↻ Refresh',
  ads_loading:    'Loading ads...',
  ads_empty:      'No ads available right now.',
  ads_viewed:     'Already watched today',
  btn_watch_ad:   'Watch',
  ads_load_fail:  'Failed to load ads',
  ads_shuffle:    'Shuffle',
  ads_remaining:  'ads remaining',

  // Ads — all done state
  ads_all_done_title:   'All done for today! 🎉',
  ads_all_done_sub:     'Come back tomorrow for more ads.',
  ads_watched_today:    'Watched today',
  ads_progress_today:   "Today's progress",
  ads_done_of:          'of',
  ads_done_label:       'ads',
  ads_reward_label:     'Reward per ad',

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
  view_fail:          'Failed to start viewing',
  claim_fail:         'Failed to claim',
  claim_processing:   '⏳ Processing...',

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
  withdraw_amount_ph:  'Minimum 0.01 USDT',
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

  // My Ads
  my_ads_empty:            'No ads created yet.',
  my_ads_clicks:           'clicks',
  my_ads_reward_per_click: 'Reward / click',
  my_ads_total_spent:      'Total spent',

  // Referral
  referral_title:      '🔗 Referral',
  referral_code_lbl:   'Your Referral Code',
  referral_copy:       '📋 Copy Referral Link',
  referral_info:       '💡 Every user who signs up via your link and clicks ads,<br/>you earn <b style="color:var(--green)">10% of their reward</b> automatically!',
  referral_total:      'Total Referrals',
  referral_earned:     'Total Commission (USDT)',
  referral_list:       'Referral List',
  ref_load_fail:       'Failed to load data',

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
};

function t(key) {
  return i18n[key] ?? key;
}
