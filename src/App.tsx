/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Coins, 
  CheckSquare, 
  History, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Settings,
  Menu,
  Wallet
} from 'lucide-react';
import { Task, User, SystemSettings, Withdrawal, ReferralEarning } from './types';
import { DashboardTab } from './components/DashboardTab';
import { TaskTab } from './components/TaskTab';
import { HistoryTab } from './components/HistoryTab';
import { ReferralTab } from './components/ReferralTab';
import { WithdrawTab } from './components/WithdrawTab';
import { MandatoryJoin } from './components/MandatoryJoin';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'task' | 'history' | 'referral' | 'withdraw' | 'admin'>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Authentication & Session
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isMandatoryJoined, setIsMandatoryJoined] = useState<boolean>(true);
  const [simulatedTelegramId, setSimulatedTelegramId] = useState<string>('12345678');
  
  // Loading & Feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Core Data State
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myWithdrawals, setMyWithdrawals] = useState<Withdrawal[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);

  // Task Instruction state
  const [taskStep, setTaskStep] = useState<'generate' | 'instructions'>('generate');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Withdrawal Input
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawMethod, setWithdrawMethod] = useState<string>('PayPal');
  const [withdrawAccount, setWithdrawAccount] = useState<string>('');

  // Admin Panel states
  const [adminTasks, setAdminTasks] = useState<Task[]>([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState<Withdrawal[]>([]);
  const [adminSettings, setAdminSettings] = useState<SystemSettings | null>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [declineReason, setDeclineReason] = useState<{ [key: string]: string }>({});
  const [payoutTxId, setPayoutTxId] = useState<{ [key: string]: string }>({});

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4500);
  };

  const triggerCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${fieldName}`, 'success');
  };

  const authenticateUser = async (tgId: string) => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockUser: {
            id: tgId,
            first_name: 'David',
            username: 'david_tg',
            refCode: ''
          }
        })
      });
      const authData = await authRes.json();
      
      if (authData.success) {
        setActiveUser(authData.user);
        await refreshUserData(tgId);
        
        const taskListRes = await fetch(`/api/tasks/my?tgId=${tgId}`);
        const taskListData = await taskListRes.json();
        if (taskListData.success && taskListData.tasks.length > 0) {
          const mainTask = taskListData.tasks[0];
          if (mainTask.status === 'pending' || mainTask.status === 'submitted') {
            setActiveTask(mainTask);
            setTaskStep(mainTask.status === 'submitted' ? 'instructions' : 'generate');
          } else {
            setActiveTask(null);
          }
        }

        const settingsRes = await fetch('/api/check-subscription?tgId=' + tgId);
        const settingsData = await settingsRes.json();
        if (settingsData.settings) {
          setAdminSettings(settingsData.settings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async (tgId: string) => {
    try {
      const [balanceRes, tasksRes, refRes, wdRes] = await Promise.all([
        fetch(`/api/user/balance?tgId=${tgId}`),
        fetch(`/api/tasks/my?tgId=${tgId}`),
        fetch(`/api/referral-stats?tgId=${tgId}`),
        fetch(`/api/withdrawals?tgId=${tgId}`)
      ]);
      const balanceData = await balanceRes.json();
      if (balanceData.success) setActiveUser(prev => prev ? { ...prev, balance: balanceData.balance } : null);
      
      const tasksData = await tasksRes.json();
      if (tasksData.success) setMyTasks(tasksData.tasks);
      
      const refData = await refRes.json();
      if (refData.success) setReferralStats(refData);
      
      const wdData = await wdRes.json();
      if (wdData.success) setMyWithdrawals(wdData.withdrawals);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    authenticateUser(simulatedTelegramId);
  }, []);

  const loadAdminDashboard = async () => {
    try {
      const [statsRes, tasksRes, wdRes] = await Promise.all([
        fetch('/admin/stats'),
        fetch('/admin/tasks'),
        fetch('/admin/withdrawals')
      ]);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setAdminStats(statsData.stats);
        setAdminSettings(statsData.settings);
      }
      const tasksData = await tasksRes.json();
      if (tasksData.success) {
        setAdminTasks(tasksData.tasks);
        setAdminUsers(tasksData.users);
      }
      const wdData = await wdRes.json();
      if (wdData.success) setAdminWithdrawals(wdData.withdrawals);
    } catch (err) {}
  };

  useEffect(() => {
    if (activeTab === 'admin') loadAdminDashboard();
  }, [activeTab]);

  const handleAssignNewTask = async () => {
    if (!activeUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tasks/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tgId: activeUser.telegram_id })
      });
      const data = await res.json();
      if (data.success) {
        setActiveTask(data.task);
        setTaskStep('generate');
        showToast('Credentials generated!', 'success');
      } else {
        showToast(data.message || 'Error occurred.', 'error');
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!activeTask) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: activeTask.id })
      });
      const data = await res.json();
      if (data.success) {
        setActiveTask(data.task);
        showToast('Submitted for verification', 'success');
        refreshUserData(activeUser!.telegram_id);
        setActiveTab('history');
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleCancelActiveTask = async () => {
    if (!activeTask) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tasks/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: activeTask.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Task canceled.', 'info');
        setActiveTask(null);
        if (activeUser) refreshUserData(activeUser.telegram_id);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAccount || !amount) return showToast('Please enter amount and account.', 'error');

    setLoading(true);
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tgId: activeUser.telegram_id,
          amount,
          method: withdrawMethod,
          accountNumber: withdrawAccount
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`$${amount} withdrawal requested successfully.`, 'success');
        setWithdrawAmount('');
        setWithdrawAccount('');
        refreshUserData(activeUser.telegram_id);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleApproveTaskAdmin = async (id: string, userTgId: string, reward: number, username: string) => {
    const res = await fetch(`/admin/tasks/${id}/approve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: "Verified." })
    });
    if ((await res.json()).success) { showToast('Approved', 'success'); loadAdminDashboard(); }
  };

  const handleRejectTaskAdmin = async (id: string, userTgId: string, username: string) => {
    const reason = declineReason[id] || 'Rejected';
    const res = await fetch(`/admin/tasks/${id}/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason })
    });
    if ((await res.json()).success) { showToast('Rejected', 'info'); loadAdminDashboard(); }
  };

  const handleCompletePayoutAdmin = async (id: string, userTgId: string, amount: number, username: string) => {
    const res = await fetch(`/admin/withdrawals/${id}/complete`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: payoutTxId[id] || 'TXN-000' })
    });
    if ((await res.json()).success) { showToast('Payout complete', 'success'); loadAdminDashboard(); }
  };

  const handleRejectPayoutAdmin = async (id: string, userTgId: string, amount: number, username: string) => {
    const res = await fetch(`/admin/withdrawals/${id}/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: declineReason[id] || 'Rejected' })
    });
    if ((await res.json()).success) { showToast('Payout rejected', 'info'); loadAdminDashboard(); }
  };

  const handleUpdateSettingsAdmin = async (field: keyof SystemSettings, val: any) => {
    const res = await fetch('/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: val })
    });
    if ((await res.json()).success) { loadAdminDashboard(); showToast('Settings saved', 'success'); }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white sm:py-4">
      
      {/* MOBILE MINI-APP CONTAINER */}
      <div className="relative w-full max-w-[440px] h-full sm:h-[90vh] bg-[#0A0A0B] sm:rounded-[40px] sm:border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        {/* TOP GLOW AMBIENT BLURS */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white/[0.02] backdrop-blur-3xl border-b border-white/5 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white leading-none">Global Tasks</h1>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Premium Rewards</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </header>

        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/80 backdrop-blur-xl">
             <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* ALERTS */}
        {alertMsg && (
          <div className={`absolute top-4 left-4 right-4 z-50 p-3 rounded-2xl backdrop-blur-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            alertMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
            alertMsg.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-100' :
            'bg-blue-500/10 border-blue-500/20 text-blue-100'
          }`}>
            <span className="text-xs font-medium">{alertMsg.text}</span>
          </div>
        )}

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto w-full px-4 py-6 z-10 pb-24 modern-scrollbar">
          {!isMandatoryJoined && adminSettings?.channel_check_enabled ? (
            <MandatoryJoin
              adminSettings={adminSettings}
              onVerifyJoin={() => setIsMandatoryJoined(true)}
              onOpenChannel={() => showToast('Opening channel...', 'info')}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <DashboardTab
                  activeTask={activeTask}
                  myTasks={myTasks}
                  referralStats={referralStats}
                  onNavigateToTab={setActiveTab}
                  onAssignNewTask={handleAssignNewTask}
                />
              )}
              {activeTab === 'task' && (
                <TaskTab
                  activeTask={activeTask}
                  taskStep={taskStep}
                  showPassword={showPassword}
                  onAssignNewTask={handleAssignNewTask}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onCopyText={triggerCopy}
                  onSetStep={setTaskStep}
                  onSubmitCompletedTask={handleSubmitTask}
                  onCancelActiveTask={handleCancelActiveTask}
                />
              )}
              {activeTab === 'history' && <HistoryTab myTasks={myTasks} />}
              {activeTab === 'referral' && <ReferralTab referralStats={referralStats} onCopyText={triggerCopy} />}
              {activeTab === 'withdraw' && (
                <WithdrawTab
                  activeUser={activeUser}
                  myWithdrawals={myWithdrawals}
                  withdrawAmount={withdrawAmount}
                  withdrawMethod={withdrawMethod}
                  withdrawAccount={withdrawAccount}
                  loading={loading}
                  onSetMethod={setWithdrawMethod}
                  onSetAmount={setWithdrawAmount}
                  onSetAccount={setWithdrawAccount}
                  onSubmitWithdrawRequest={handleRequestWithdrawal}
                />
              )}
              {activeTab === 'admin' && (
                <AdminPanel
                  adminTasks={adminTasks}
                  adminWithdrawals={adminWithdrawals}
                  adminSettings={adminSettings}
                  adminStats={adminStats}
                  adminUsers={adminUsers}
                  declineReason={declineReason}
                  payoutTxId={payoutTxId}
                  onSetDeclineReason={setDeclineReason}
                  onSetPayoutTxId={setPayoutTxId}
                  onApproveTaskAdmin={handleApproveTaskAdmin}
                  onRejectTaskAdmin={handleRejectTaskAdmin}
                  onCompletePayoutAdmin={handleCompletePayoutAdmin}
                  onRejectPayoutAdmin={handleRejectPayoutAdmin}
                  onUpdateSettingsAdmin={handleUpdateSettingsAdmin}
                />
              )}
            </>
          )}
        </main>

        {/* GLASS BOTTOM NAVIGATION BAR */}
        {!isMandatoryJoined || activeTab === 'admin' ? null : (
          <nav className="absolute bottom-6 left-4 right-4 z-40 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-3xl p-1.5 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <button onClick={() => setActiveTab('home')} className={`relative w-14 h-12 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${activeTab === 'home' ? 'text-blue-400 bg-white/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
              <Home className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-wide">Home</span>
            </button>
            <button onClick={() => setActiveTab('task')} className={`relative w-14 h-12 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${activeTab === 'task' ? 'text-blue-400 bg-white/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
              <CheckSquare className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-wide">Tasks</span>
            </button>
            <button onClick={() => setActiveTab('withdraw')} className={`relative w-14 h-12 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${activeTab === 'withdraw' ? 'text-blue-400 bg-white/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
              <Wallet className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-wide">Wallet</span>
            </button>
            <button onClick={() => setActiveTab('referral')} className={`relative w-14 h-12 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${activeTab === 'referral' ? 'text-blue-400 bg-white/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-wide">Friends</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
