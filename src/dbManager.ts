/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { User, Task, Transaction, Withdrawal, ReferralEarning, SystemSettings, AppStats } from './types.js';

interface DBStructure {
  users: User[];
  tasks: Task[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  referralEarnings: ReferralEarning[];
  settings: SystemSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const FIRST_NAMES = [
  'Raymon', 'James', 'Sarah', 'Sophia', 'Liam', 'John', 'Robert', 'Michael',
  'David', 'Emily', 'Jessica', 'Amanda', 'George', 'William', 'Karen', 'Olivia',
  'Emma', 'Ava', 'Isabella', 'Mia', 'Lucas', 'Matthew', 'Daniel', 'Sophia',
  'Thomas', 'Jacob', 'Ashley', 'Brian', 'Donald', 'Melissa', 'Stephanie'
];

function generateRandomPassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$^*()_+-=";
  const all = upper + lower + digits + special;
  
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const length = 10 + Math.floor(Math.random() * 3); // 10 to 12 characters
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export class DBManager {
  private data!: DBStructure;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Failed to parse DB file. Initializing a new one.', err);
        this.data = this.getDefaultDBState();
        this.save();
      }
    } else {
      this.data = this.getDefaultDBState();
      this.save();
    }
  }

  private getDefaultDBState(): DBStructure {
    return {
      users: [
        // Seed default system users for simulation and showcase
        {
          id: 'admin_sys',
          telegram_id: '12345678',
          first_name: 'Apple Master',
          username: 'applemaster',
          balance: 85.00,
          referral_code: 'ref12345678',
          created_at: new Date().toISOString()
        },
        {
          id: 'demo_user_1',
          telegram_id: '87654321',
          first_name: 'David Smith',
          username: 'david_123',
          balance: 14.00,
          referral_code: 'ref87654321',
          referred_by: 'ref12345678',
          created_at: new Date().toISOString()
        }
      ],
      tasks: [
        {
          id: 'task_demo_1',
          user_id: '87654321',
          first_name: 'Donald',
          email: 'donald710482@gmail.com',
          password: 'P@ssw0rd99!1',
          status: 'approved',
          reward_amount: 0.20,
          submitted_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ],
      transactions: [
        {
          id: 'tx_demo_1',
          user_id: '87654321',
          amount: 0.20,
          type: 'task_reward',
          reference_id: 'task_demo_1',
          created_at: new Date().toISOString()
        },
        {
          id: 'tx_demo_2',
          user_id: '12345678',
          amount: 0.02,
          type: 'referral_commission',
          reference_id: 'task_demo_1',
          created_at: new Date().toISOString()
        }
      ],
      withdrawals: [
        {
          id: 'wd_demo_1',
          user_id: '87654321',
          amount: 10.00,
          method: 'PayPal',
          account_number: 'david@example.com',
          status: 'completed',
          admin_note: 'Processed successfully',
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ],
      referralEarnings: [
        {
          id: 'ref_earn_demo_1',
          referrer_id: '12345678',
          referred_user_id: '87654321',
          level: 1,
          task_id: 'task_demo_1',
          commission: 0.02,
          created_at: new Date().toISOString()
        }
      ],
      settings: {
        task_reward: 0.20,
        min_withdrawal: 5.00,
        level_1_commission: 10, // 10%
        level_2_commission: 2,  // 2%
        level_3_commission: 1,  // 1%
        mandatory_channel_id: '@PremiumTasksBD',
        mandatory_channel_url: 'https://t.me/PremiumTasksBD',
        channel_check_enabled: true
      }
    };
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to database file', err);
    }
  }

  // --- SETTINGS OPERATIONS ---
  public getSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // --- USER OPERATIONS ---
  public getUser(telegramId: string): User | undefined {
    return this.data.users.find(u => u.telegram_id === telegramId);
  }

  public getUserByReferralCode(refCode: string): User | undefined {
    return this.data.users.find(u => u.referral_code === refCode);
  }

  public createOrUpdateUser(telegramId: string, firstName: string, username: string, refCode?: string): User {
    let user = this.getUser(telegramId);
    if (!user) {
      let finalRefBy: string | undefined = undefined;
      if (refCode && refCode !== `ref${telegramId}`) {
        const referrer = this.getUserByReferralCode(refCode);
        if (referrer) {
          finalRefBy = refCode;
        }
      }

      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        telegram_id: telegramId,
        first_name: firstName || 'User_' + telegramId.substring(0, 4),
        username: username || 'user_' + telegramId.substring(0, 4),
        balance: 0.00,
        referral_code: `ref${telegramId}`,
        referred_by: finalRefBy,
        created_at: new Date().toISOString()
      };
      this.data.users.push(user);
      this.save();
    } else {
      let changed = false;
      if (firstName && user.first_name !== firstName) {
        user.first_name = firstName;
        changed = true;
      }
      if (username && user.username !== username) {
        user.username = username;
        changed = true;
      }
      if (changed) {
        this.save();
      }
    }
    return user;
  }

  public getAllUsers(): User[] {
    return this.data.users;
  }

  // --- TASK OPERATIONS ---
  public assignNewTask(telegramId: string): Task {
    const activeTask = this.data.tasks.find(t => t.user_id === telegramId && (t.status === 'pending' || t.status === 'submitted'));
    if (activeTask) {
      return activeTask; // return active task if one is already working/pending review
    }

    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const email = `${firstName.toLowerCase()}${randomDigits}@gmail.com`;
    const password = generateRandomPassword();

    const task: Task = {
      id: 'tsk_' + Math.random().toString(36).substring(2, 10),
      user_id: telegramId,
      first_name: firstName,
      email: email,
      password: password,
      status: 'pending',
      reward_amount: this.data.settings.task_reward,
      created_at: new Date().toISOString()
    };

    this.data.tasks.push(task);
    this.save();
    return task;
  }

  public submitTask(taskId: string): Task | null {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = 'submitted';
    task.submitted_at = new Date().toISOString();
    this.save();
    return task;
  }

  public cancelTask(taskId: string): boolean {
    const idx = this.data.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return false;
    const task = this.data.tasks[idx];
    if (task.status === 'pending' || task.status === 'submitted') {
      this.data.tasks.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public getMyTasks(telegramId: string): Task[] {
    return this.data.tasks.filter(t => t.user_id === telegramId).sort((a,b) => b.created_at.localeCompare(a.created_at));
  }

  public getSubmittedTasksForAdmin(): Task[] {
    return this.data.tasks.filter(t => t.status === 'submitted').sort((a,b) => (a.submitted_at || '').localeCompare(b.submitted_at || ''));
  }

  public getAllTasksForAdmin(): Task[] {
    return this.data.tasks.sort((a,b) => b.created_at.localeCompare(a.created_at));
  }

  public approveTask(taskId: string, adminNote?: string): Task | null {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'submitted') return null;

    task.status = 'approved';
    task.admin_note = adminNote || 'Task approved. Reward credited.';
    
    // Credit user of the task
    const user = this.getUser(task.user_id);
    if (user) {
      user.balance = parseFloat((user.balance + task.reward_amount).toFixed(2));
      
      // Post transaction log
      const tx: Transaction = {
        id: 'tx_rwd_' + Math.random().toString(36).substring(2, 10),
        user_id: task.user_id,
        amount: task.reward_amount,
        type: 'task_reward',
        reference_id: task.id,
        created_at: new Date().toISOString()
      };
      this.data.transactions.push(tx);

      // Perform recursive commissions
      this.distributeCommissionsRecursive(user, task.id, task.reward_amount);
    }

    this.save();
    return task;
  }

  public rejectTask(taskId: string, reason: string): Task | null {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'submitted') return null;

    task.status = 'rejected';
    task.admin_note = reason || 'Declined key validation check.';
    this.save();
    return task;
  }

  // --- MULTI-LEVEL COMMISSION FLOW ---
  private distributeCommissionsRecursive(childUser: User, taskId: string, rewardAmount: number) {
    if (!childUser.referred_by) return;

    // LEVEL 1 COMMISSION
    const parent1 = this.getUserByReferralCode(childUser.referred_by);
    if (!parent1) return;

    const commRate1 = this.data.settings.level_1_commission;
    const commission1 = parseFloat((rewardAmount * commRate1 / 100).toFixed(2));
    if (commission1 > 0) {
      parent1.balance = parseFloat((parent1.balance + commission1).toFixed(2));
      
      const tx1: Transaction = {
        id: 'tx_c1_' + Math.random().toString(36).substring(2, 10),
        user_id: parent1.telegram_id,
        amount: commission1,
        type: 'referral_commission',
        reference_id: taskId,
        created_at: new Date().toISOString()
      };
      this.data.transactions.push(tx1);

      const refEarn1: ReferralEarning = {
        id: 're_1_' + Math.random().toString(36).substring(2, 10),
        referrer_id: parent1.telegram_id,
        referred_user_id: childUser.telegram_id,
        level: 1,
        task_id: taskId,
        commission: commission1,
        created_at: new Date().toISOString()
      };
      this.data.referralEarnings.push(refEarn1);
    }

    if (!parent1.referred_by) return;

    // LEVEL 2 COMMISSION
    const parent2 = this.getUserByReferralCode(parent1.referred_by);
    if (!parent2) return;

    const commRate2 = this.data.settings.level_2_commission;
    const commission2 = parseFloat((rewardAmount * commRate2 / 100).toFixed(2));
    if (commission2 > 0) {
      parent2.balance = parseFloat((parent2.balance + commission2).toFixed(2));

      const tx2: Transaction = {
        id: 'tx_c2_' + Math.random().toString(36).substring(2, 10),
        user_id: parent2.telegram_id,
        amount: commission2,
        type: 'referral_commission',
        reference_id: taskId,
        created_at: new Date().toISOString()
      };
      this.data.transactions.push(tx2);

      const refEarn2: ReferralEarning = {
        id: 're_2_' + Math.random().toString(36).substring(2, 10),
        referrer_id: parent2.telegram_id,
        referred_user_id: childUser.telegram_id,
        level: 2,
        task_id: taskId,
        commission: commission2,
        created_at: new Date().toISOString()
      };
      this.data.referralEarnings.push(refEarn2);
    }

    if (!parent2.referred_by) return;

    // LEVEL 3 COMMISSION
    const parent3 = this.getUserByReferralCode(parent2.referred_by);
    if (!parent3) return;

    const commRate3 = this.data.settings.level_3_commission;
    const commission3 = parseFloat((rewardAmount * commRate3 / 100).toFixed(2));
    if (commission3 > 0) {
      parent3.balance = parseFloat((parent3.balance + commission3).toFixed(2));

      const tx3: Transaction = {
        id: 'tx_c3_' + Math.random().toString(36).substring(2, 10),
        user_id: parent3.telegram_id,
        amount: commission3,
        type: 'referral_commission',
        reference_id: taskId,
        created_at: new Date().toISOString()
      };
      this.data.transactions.push(tx3);

      const refEarn3: ReferralEarning = {
        id: 're_3_' + Math.random().toString(36).substring(2, 10),
        referrer_id: parent3.telegram_id,
        referred_user_id: childUser.telegram_id,
        level: 3,
        task_id: taskId,
        commission: commission3,
        created_at: new Date().toISOString()
      };
      this.data.referralEarnings.push(refEarn3);
    }
  }

  // --- REFERRAL STATS ---
  public getReferralMetrics(telegramId: string) {
    const directUsers = this.data.users.filter(u => u.referred_by === `ref${telegramId}`);
    
    // Level 1, 2, 3 calculations
    const level1Earn = this.data.referralEarnings.filter(e => e.referrer_id === telegramId && e.level === 1);
    const level2Earn = this.data.referralEarnings.filter(e => e.referrer_id === telegramId && e.level === 2);
    const level3Earn = this.data.referralEarnings.filter(e => e.referrer_id === telegramId && e.level === 3);

    const totalEarningSum = parseFloat([...level1Earn, ...level2Earn, ...level3Earn].reduce((sum, e) => sum + e.commission, 0).toFixed(2));

    // Gather descendants
    const directIds = directUsers.map(u => u.telegram_id);
    const lvl2Users = this.data.users.filter(u => u.referred_by && directIds.includes(u.referred_by.replace('ref', '')));
    
    const lvl2Ids = lvl2Users.map(u => u.telegram_id);
    const lvl3Users = this.data.users.filter(u => u.referred_by && lvl2Ids.includes(u.referred_by.replace('ref', '')));

    return {
      referral_code: `ref${telegramId}`,
      level1_count: directUsers.length,
      level2_count: lvl2Users.length,
      level3_count: lvl3Users.length,
      total_commission: totalEarningSum,
      history: this.data.referralEarnings.filter(e => e.referrer_id === telegramId).sort((a,b) => b.created_at.localeCompare(a.created_at))
    };
  }

  // --- WITHDRAWAL SYSTEM ---
  public requestWithdrawal(telegramId: string, amount: number, method: string, accountNumber: string): { success: boolean; message: string; withdrawal?: Withdrawal } {
    const user = this.getUser(telegramId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (amount < this.data.settings.min_withdrawal) {
      return { success: false, message: `Minimum withdrawal amount is $${this.data.settings.min_withdrawal}` };
    }

    if (user.balance < amount) {
      return { success: false, message: "Insufficient balance for this withdrawal" };
    }

    // Deduct immediately on request to prevent double spends
    user.balance = parseFloat((user.balance - amount).toFixed(2));

    // Ledger record
    const wd: Withdrawal = {
      id: 'wd_' + Math.random().toString(36).substring(2, 10),
      user_id: telegramId,
      amount: amount,
      method: method,
      account_number: accountNumber,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.data.withdrawals.push(wd);

    // Add withdrawal transaction
    const tx: Transaction = {
      id: 'tx_wd_' + Math.random().toString(36).substring(2, 10),
      user_id: telegramId,
      amount: -amount,
      type: 'withdrawal',
      reference_id: wd.id,
      created_at: new Date().toISOString()
    };
    this.data.transactions.push(tx);

    this.save();
    return { success: true, message: "Withdrawal request submitted successfully", withdrawal: wd };
  }

  public getMyWithdrawals(telegramId: string): Withdrawal[] {
    return this.data.withdrawals.filter(w => w.user_id === telegramId).sort((a,b) => b.created_at.localeCompare(a.created_at));
  }

  public getAllWithdrawalsForAdmin(): Withdrawal[] {
    return this.data.withdrawals.sort((a,b) => b.created_at.localeCompare(a.created_at));
  }

  public completeWithdrawal(wdId: string, transactionId?: string): Withdrawal | null {
    const wd = this.data.withdrawals.find(w => w.id === wdId);
    if (!wd || wd.status !== 'pending') return null;

    wd.status = 'completed';
    wd.admin_note = transactionId ? `Processed (TxID: ${transactionId})` : 'Processed successfully';
    wd.processed_at = new Date().toISOString();
    this.save();
    return wd;
  }

  public rejectWithdrawal(wdId: string, reason: string): Withdrawal | null {
    const wd = this.data.withdrawals.find(w => w.id === wdId);
    if (!wd || wd.status !== 'pending') return null;

    wd.status = 'rejected';
    wd.admin_note = reason || 'Incorrect account details / check failed.';
    wd.processed_at = new Date().toISOString();

    // Refund the user's balance
    const user = this.getUser(wd.user_id);
    if (user) {
      user.balance = parseFloat((user.balance + wd.amount).toFixed(2));

      // Add a refund transaction
      const tx: Transaction = {
        id: 'tx_ref_' + Math.random().toString(36).substring(2, 10),
        user_id: wd.user_id,
        amount: wd.amount,
        type: 'refund',
        reference_id: wd.id,
        created_at: new Date().toISOString()
      };
      this.data.transactions.push(tx);
    }

    this.save();
    return wd;
  }

  // --- STATISTICS FOR ADMIN ---
  public getSystemStats(): AppStats {
    const totalUsers = this.data.users.length;
    const totalTasksCompleted = this.data.tasks.filter(t => t.status === 'approved').length;
    const totalWithdrawn = parseFloat(
      this.data.withdrawals
        .filter(w => w.status === 'completed')
        .reduce((sum, w) => sum + w.amount, 0)
        .toFixed(2)
    );
    const activeTasksPending = this.data.tasks.filter(t => t.status === 'submitted').length;

    return {
      totalUsers,
      totalTasksCompleted,
      totalWithdrawn,
      activeTasksPending
    };
  }
}
