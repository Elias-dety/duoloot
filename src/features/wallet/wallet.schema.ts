import { z } from 'zod';

// ---------------------------------------------------------------------------
// Wallet Account
// ---------------------------------------------------------------------------

export const WalletAccountSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  available_balance: z.number(),
  pending_balance: z.number(),
  locked_balance: z.number(),
  lifetime_earned: z.number(),
  lifetime_redeemed: z.number(),
  status: z.enum(['active', 'frozen', 'closed']),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type WalletAccount = z.infer<typeof WalletAccountSchema>;

// ---------------------------------------------------------------------------
// Wallet Ledger Entry
// ---------------------------------------------------------------------------

export const WalletLedgerEntrySchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  user_id: z.string().uuid(),
  direction: z.enum(['credit', 'debit']),
  amount: z.number(),
  balance_after: z.number(),
  type: z.enum([
    'mission_reward',
    'event_bonus',
    'admin_credit',
    'admin_debit',
    'redemption_debit',
    'redemption_refund',
    'fraud_reversal',
    'manual_adjustment',
  ]),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'reversed']),
  source: z.string(),
  source_id: z.string().uuid().nullable(),
  idempotency_key: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  created_by: z.string().uuid().nullable(),
  created_at: z.string(),
});

export type WalletLedgerEntry = z.infer<typeof WalletLedgerEntrySchema>;

// ---------------------------------------------------------------------------
// Wallet Redemption
// ---------------------------------------------------------------------------

export const WalletRedemptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  account_id: z.string().uuid(),
  amount: z.number(),
  reward_type: z.enum([
    'internal_badge',
    'duocoins_bonus',
    'gift_card',
    'coupon',
    'pix',
    'manual',
  ]),
  reward_label: z.string(),
  status: z.enum([
    'requested',
    'under_review',
    'approved',
    'paid',
    'rejected',
    'cancelled',
  ]),
  payout_method: z.string().nullable().optional(),
  payout_payload: z.record(z.string(), z.unknown()).nullable().optional(),
  requested_at: z.string(),
  reviewed_at: z.string().nullable().optional(),
  paid_at: z.string().nullable().optional(),
  cancelled_at: z.string().nullable().optional(),
  reviewed_by: z.string().uuid().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type WalletRedemption = z.infer<typeof WalletRedemptionSchema>;

// ---------------------------------------------------------------------------
// Reward Catalog Item
// ---------------------------------------------------------------------------

export const RewardCatalogItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  cost: z.number(),
  reward_type: z.string(),
  status: z.enum(['active', 'inactive', 'sold_out', 'archived']),
  stock_total: z.number().nullable().optional(),
  stock_available: z.number().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type RewardCatalogItem = z.infer<typeof RewardCatalogItemSchema>;
