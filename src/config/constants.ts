/**
 * Application constants and configuration.
 */

export const APP_NAME = 'Digital Heroes';
export const APP_DESCRIPTION =
  'A premium subscription platform combining golf performance tracking, monthly draw-based rewards, and charitable giving.';

export const ROUTES = {
  home: '/',
  about: '/about',
  howItWorks: '/how-it-works',
  charities: '/charities',
  draws: '/draws',
  login: '/auth/login',
  signup: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  verifyEmail: '/auth/verify-email',
  callback: '/auth/callback',
  dashboard: '/dashboard',
  dashboardScores: '/dashboard/scores',
  dashboardCharity: '/dashboard/charity',
  dashboardDraws: '/dashboard/draws',
  dashboardWinnings: '/dashboard/winnings',
  dashboardSettings: '/dashboard/settings',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminSubscriptions: '/admin/subscriptions',
  adminScores: '/admin/scores',
  adminDraws: '/admin/draws',
  adminCharities: '/admin/charities',
  adminWinners: '/admin/winners',
  adminPayouts: '/admin/payouts',
  adminReports: '/admin/reports',
} as const;

export const NAV_ITEMS = [
  { label: 'How It Works', href: ROUTES.howItWorks },
  { label: 'Charities', href: ROUTES.charities },
  { label: 'Draws', href: ROUTES.draws },
] as const;

export const DASHBOARD_NAV = [
  { label: 'Overview', href: ROUTES.dashboard, icon: 'LayoutDashboard' },
  { label: 'Scores', href: ROUTES.dashboardScores, icon: 'Target' },
  { label: 'Charity', href: ROUTES.dashboardCharity, icon: 'Heart' },
  { label: 'Draws', href: ROUTES.dashboardDraws, icon: 'Trophy' },
  { label: 'Winnings', href: ROUTES.dashboardWinnings, icon: 'Wallet' },
  { label: 'Settings', href: ROUTES.dashboardSettings, icon: 'Settings' },
] as const;

export const ADMIN_NAV = [
  { label: 'Dashboard', href: ROUTES.admin, icon: 'LayoutDashboard' },
  { label: 'Users', href: ROUTES.adminUsers, icon: 'Users' },
  { label: 'Subscriptions', href: ROUTES.adminSubscriptions, icon: 'CreditCard' },
  { label: 'Scores', href: ROUTES.adminScores, icon: 'Target' },
  { label: 'Draws', href: ROUTES.adminDraws, icon: 'Dices' },
  { label: 'Charities', href: ROUTES.adminCharities, icon: 'Heart' },
  { label: 'Winners', href: ROUTES.adminWinners, icon: 'Trophy' },
  { label: 'Payouts', href: ROUTES.adminPayouts, icon: 'Wallet' },
  { label: 'Reports', href: ROUTES.adminReports, icon: 'BarChart3' },
] as const;

// Score constraints from PRD
export const SCORE_MIN = 1;
export const SCORE_MAX = 45;
export const MAX_SCORES_PER_USER = 5;

// Charity constraints from PRD
export const MIN_CHARITY_PERCENTAGE = 10;
export const MAX_CHARITY_PERCENTAGE = 100;
export const DEFAULT_CHARITY_PERCENTAGE = 10;

// Prize tier percentages from PRD [EXPLICIT]
export const PRIZE_TIER_PERCENTAGES = {
  tier1: 40, // 5-number match
  tier2: 35, // 4-number match
  tier3: 25, // 3-number match
} as const;

// File upload constraints
export const PROOF_UPLOAD = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  bucket: 'winner-proofs',
} as const;
