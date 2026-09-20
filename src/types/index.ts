// Digital Heroes — TypeScript Type Definitions
// All monetary values are in minor units (pence/cents) unless otherwise noted

// ============================================
// Database row types (mirrors PostgreSQL schema)
// ============================================

export type UserRole = 'subscriber' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  charity_id: string | null;
  charity_percentage: number;
  stripe_customer_id: string | null;
  handicap?: number | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_amount: number; // BIGINT minor units
  currency: string;
  interval: 'month' | 'year';
  stripe_price_id: string | null;
  prize_pool_contribution_pct: number;
  is_active: boolean;
  created_at: string;
}

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'trialing'
  | 'unpaid'
  | 'paused';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id?: string;
  stripe_subscription_id?: string | null;
  stripe_customer_id?: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at?: string | null;
  charity_id?: string | null;
  charity_percentage?: number;
  created_at?: string;
  updated_at?: string;
  // Joined
  plan?: SubscriptionPlan;
}

export interface Score {
  id: string;
  user_id: string;
  score_value: number; // 1-45
  played_date: string; // DATE string
  created_at: string;
  updated_at: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  logo_url: string | null;
  website_url: string | null;
  category: string | null;
  total_received?: number;
  is_featured: boolean;
  is_active: boolean;
  upcoming_events: CharityEvent[];
  created_at: string;
  updated_at: string;
}

export interface CharityEvent {
  title: string;
  date: string;
  description: string;
}

export interface CharityContribution {
  id: string;
  user_id: string;
  charity_id: string;
  charity_percentage?: number;
  amount?: number; // BIGINT minor units
  currency?: string;
  type?: 'subscription' | 'donation';
  subscription_id?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  created_at?: string;
  // Joined
  charity?: Charity;
}

export interface DrawUserEntry {
  userId: string;
  numbers: number[];
}

export type DrawStatus = 'draft' | 'simulated' | 'published' | 'cancelled';
export type DrawMode = 'random' | 'algorithmic';

export interface Draw {
  id: string;
  draw_date: string;
  month: number;
  year: number;
  status: DrawStatus;
  mode: DrawMode;
  winning_numbers: number[] | null;
  total_prize_pool: number; // BIGINT minor units
  tier1_pool: number;
  tier2_pool: number;
  tier3_pool: number;
  rollover_in: number;
  rollover_out: number;
  eligible_count: number;
  algorithm_metadata: Record<string, unknown> | null;
  simulation_data: SimulationData | null;
  published_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  results?: DrawResult;
}

export interface SimulationData {
  winning_numbers: number[];
  tier1_winners: number;
  tier2_winners: number;
  tier3_winners: number;
  tier1_share: number;
  tier2_share: number;
  tier3_share: number;
  total_distributed: number;
  eligible_count: number;
  total_prize_pool: number;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  user_numbers: number[];
  match_count: number;
  created_at: string;
  // Joined
  profile?: Profile;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  tier1_winners: number;
  tier2_winners: number;
  tier3_winners: number;
  tier1_share: number; // Per-winner amount
  tier2_share: number;
  tier3_share: number;
  total_distributed: number;
  created_at: string;
}

export type VerificationStatus = 'pending' | 'proof_submitted' | 'approved' | 'rejected';
export type PayoutStatus = 'pending' | 'paid';

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  tier: 3 | 4 | 5;
  match_count: number;
  matched_numbers: number[] | null;
  prize_amount: number; // BIGINT minor units
  currency: string;
  verification_status: VerificationStatus;
  payout_status: PayoutStatus;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Profile;
  draw?: Draw;
  proofs?: WinnerProof[];
}

export interface WinnerProof {
  id: string;
  winner_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export type PayoutRecordStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Payout {
  id: string;
  winner_id: string;
  user_id: string;
  amount: number; // BIGINT minor units
  currency: string;
  status: PayoutRecordStatus;
  paid_at: string | null;
  paid_by: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  winner?: Winner;
  profile?: Profile;
}

export interface PlatformConfig {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  // Joined
  admin?: Profile;
}

// ============================================
// Application types
// ============================================

export interface TierPrizes {
  tier1: number; // 40% — minor units
  tier2: number; // 35%
  tier3: number; // 25%
}

export interface DrawSimulationResult {
  winning_numbers: number[];
  entries: {
    user_id: string;
    user_numbers: number[];
    match_count: number;
    matched_numbers: number[];
  }[];
  tier_counts: {
    tier5: number;
    tier4: number;
    tier3: number;
  };
  prize_pool: number;
  tier_prizes: TierPrizes;
  rollover_in: number;
  rollover_out: number;
  tier_shares: {
    tier5: number;
    tier4: number;
    tier3: number;
  };
}

export interface DashboardStats {
  total_users: number;
  active_subscribers: number;
  total_prize_pool: number;
  total_charity_contributions: number;
  total_draws: number;
  pending_verifications: number;
  pending_payouts: number;
}
