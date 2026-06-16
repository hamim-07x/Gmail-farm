/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string; // Internal unique ID or telegram_id
  telegram_id: string;
  first_name: string;
  username: string;
  balance: number; // Stored in USD with 2 decimal points
  referral_code: string;
  referred_by?: string; // Telegram ID of the referrer
  created_at: string;
}

export type TaskStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface Task {
  id: string;
  user_id: string;
  first_name: string;
  email: string;
  password: string;
  status: TaskStatus;
  reward_amount: number; // e.g. 0.20 USD
  admin_note?: string;
  submitted_at?: string;
  created_at: string;
}

export type TransactionType = 'task_reward' | 'referral_commission' | 'withdrawal' | 'refund';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  reference_id?: string; // ID of the related task or withdrawal
  created_at: string;
}

export type WithdrawalStatus = 'pending' | 'completed' | 'rejected';

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: string; // e.g. 'PayPal' or 'Crypto'
  account_number: string;
  status: WithdrawalStatus;
  admin_note?: string;
  processed_at?: string;
  created_at: string;
}

export interface ReferralEarning {
  id: string;
  referrer_id: string; // user's telegram_id
  referred_user_id: string; // child's telegram_id
  level: number; // 1, 2, or 3
  task_id: string;
  commission: number; // USD earned
  created_at: string;
}

export interface SystemSettings {
  task_reward: number; // USD default, e.g. 0.20
  min_withdrawal: number; // e.g. 5
  level_1_commission: number; // percentage, e.g. 10 (10%)
  level_2_commission: number; // e.g. 2 (2%)
  level_3_commission: number; // e.g. 1 (1%)
  mandatory_channel_id: string; // e.g. "@mychannel"
  mandatory_channel_url: string; // e.g. "https://t.me/mychannel"
  channel_check_enabled: boolean;
}

export interface AppStats {
  totalUsers: number;
  totalTasksCompleted: number;
  totalWithdrawn: number;
  activeTasksPending: number;
}
