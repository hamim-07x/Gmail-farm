import React from 'react';
import { PlusCircle, Coins, Sliders, RefreshCw, Smartphone, Check, X, ShieldAlert, UserCheck } from 'lucide-react';
import { Task, User, SystemSettings, Withdrawal } from '../types';

interface AdminPanelProps {
  adminTasks: Task[];
  adminWithdrawals: Withdrawal[];
  adminSettings: SystemSettings | null;
  adminStats: any;
  adminUsers: User[];
  declineReason: { [key: string]: string };
  payoutTxId: { [key: string]: string };
  onSetDeclineReason: (val: { [key: string]: string }) => void;
  onSetPayoutTxId: (val: { [key: string]: string }) => void;
  onApproveTaskAdmin: (id: string, userTgId: string, reward: number, username: string) => void;
  onRejectTaskAdmin: (id: string, userTgId: string, username: string) => void;
  onCompletePayoutAdmin: (id: string, userTgId: string, amount: number, username: string) => void;
  onRejectPayoutAdmin: (id: string, userTgId: string, amount: number, username: string) => void;
  onUpdateSettingsAdmin: (field: keyof SystemSettings, val: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminTasks,
  adminWithdrawals,
  adminSettings,
  adminStats,
  adminUsers,
  declineReason,
  payoutTxId,
  onSetDeclineReason,
  onSetPayoutTxId,
  onApproveTaskAdmin,
  onRejectTaskAdmin,
  onCompletePayoutAdmin,
  onRejectPayoutAdmin,
  onUpdateSettingsAdmin,
}) => {
  return (
    <div className="w-full animate-in fade-in duration-300 space-y-5 text-sm">
      
      {/* Compact Mini Grid Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-md">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Total Users Logged</span>
          <span className="text-sm font-extrabold text-white mt-1 block flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            {adminStats?.totalUsers || 2} members
          </span>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-md">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Approved Tasks</span>
          <span className="text-sm font-extrabold text-white mt-1 block flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            {adminStats?.totalTasksCompleted || 1} tasks
          </span>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-md">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Pending Reviews</span>
          <span className="text-sm font-extrabold text-amber-400 mt-1 block flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-450 animate-pulse" />
            {adminStats?.activeTasksPending || 0} reviews
          </span>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl flex flex-col justify-center items-center text-center shadow-md">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">Disbursed Balance</span>
          <span className="text-sm font-extrabold text-cyan-400 mt-1 block">
            ${adminStats?.totalWithdrawn?.toFixed(2) || '100.00'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Manual Submissions Desk - takes 2 cols on wide viewports */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Submissions verification cards */}
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-sky-400" />
                Active Registration validation desk
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-450 uppercase font-black tracking-widest font-mono">
                Manual Audit
              </span>
            </div>
            
            {adminTasks.filter(t => t.status === 'submitted').length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-sans">
                No new credentials submitted for authentication. <br />
                <span className="opacity-75">Switch to home viewport, generate synthetic data credentials, signup and hit submit.</span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {adminTasks.filter(t => t.status === 'submitted').map((task) => {
                  const userProfile = adminUsers.find(u => u.telegram_id === task.user_id);
                  return (
                    <div key={task.id} className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-mono text-cyan-300 font-bold block">Task UUID: {task.id.slice(0, 8)}...</span>
                          <span className="text-slate-400 text-[10px] font-mono block mt-0.5">
                            Submitter: <strong className="text-slate-200">@{userProfile?.username || task.user_id}</strong> &bull; ({userProfile?.first_name})
                          </span>
                        </div>
                        <span className="font-mono text-emerald-450 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 self-start sm:self-center">
                          Value: ${task.reward_amount.toFixed(2)}
                        </span>
                      </div>

                      {/* Display validation credentials to administrative reviewer */}
                      <div className="p-3 bg-[#070514]/60 border border-white/5 rounded-xl text-[11px] font-mono space-y-1">
                        <div className="flex justify-between gap-2.5">
                          <span className="text-slate-500 font-bold">Email registered:</span>
                          <span className="text-sky-305 select-all break-all text-right">{task.email}</span>
                        </div>
                        <div className="flex justify-between gap-2.5">
                          <span className="text-slate-500 font-bold">Password payload:</span>
                          <span className="text-white select-all text-right">{task.password}</span>
                        </div>
                        <div className="flex justify-between gap-2.5">
                          <span className="text-slate-500 font-bold">Profile Name:</span>
                          <span className="text-white text-right">{task.first_name}</span>
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <button 
                          onClick={() => onApproveTaskAdmin(task.id, task.user_id, task.reward_amount, userProfile?.username || 'user')}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all duration-300 shadow-md"
                        >
                          Approve Payment
                        </button>
                        
                        <div className="flex w-full sm:flex-1 items-center gap-1.5">
                          <input 
                            type="text" 
                            placeholder="Reason for rejection description..." 
                            value={declineReason[task.id] || ''}
                            onChange={(e) => onSetDeclineReason({ ...declineReason, [task.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                          />
                          <button 
                            onClick={() => onRejectTaskAdmin(task.id, task.user_id, userProfile?.username || 'user')}
                            className="px-3 py-2 bg-rose-600/10 hover:bg-rose-600/25 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-extrabold uppercase cursor-pointer transition-all duration-300"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cashout requests validation queue */}
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Payout Verification Ledger
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 uppercase font-bold tracking-widest font-mono">
                Settlements Queue
              </span>
            </div>

            {adminWithdrawals.filter(w => w.status === 'pending').length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-sans">
                No withdrawals pending validation currently.
              </div>
            ) : (
              <div className="space-y-3.5">
                {adminWithdrawals.filter(w => w.status === 'pending').map((wd) => {
                  const userProfile = adminUsers.find(u => u.telegram_id === wd.user_id);
                  return (
                    <div key={wd.id} className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="font-bold text-amber-400 block">{wd.method} Cashout Request</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Submitter: @{userProfile?.username || wd.user_id}</span>
                        </div>
                        <span className="font-black text-white text-base">$ {wd.amount.toFixed(2)}</span>
                      </div>

                      <div className="p-3 bg-[#070514]/60 border border-white/5 rounded-xl text-[11px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target wallet address:</span>
                          <span className="text-white font-extrabold select-all">{wd.account_number}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 font-mono">
                        <div className="flex w-full sm:flex-1 items-center gap-1.5">
                          <input 
                            type="text" 
                            placeholder="TxID transaction hash..." 
                            value={payoutTxId[wd.id] || ''}
                            onChange={(e) => onSetPayoutTxId({ ...payoutTxId, [wd.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                          />
                          <button 
                            onClick={() => onCompletePayoutAdmin(wd.id, wd.user_id, wd.amount, userProfile?.username || 'user')}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        </div>

                        <div className="flex w-full sm:w-auto items-center gap-1.5">
                          <input 
                            type="text" 
                            placeholder="Decline note explanation..." 
                            value={declineReason[wd.id] || ''}
                            onChange={(e) => onSetDeclineReason({ ...declineReason, [wd.id]: e.target.value })}
                            className="w-32 px-2 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                          />
                          <button 
                            onClick={() => onRejectPayoutAdmin(wd.id, wd.user_id, wd.amount, userProfile?.username || 'user')}
                            className="px-3 py-2 bg-rose-600/15 hover:bg-rose-600/30 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-extrabold uppercase cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            Reject & Refund
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Configurations Column */}
        <div className="space-y-5">
          
          {/* Main Controls - Compact sizes requested */}
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-3xl border border-white/10 p-4.5 shadow-2xl space-y-3">
            <h3 className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold border-b border-white/5 pb-2">
              System Settings Controller
            </h3>

            {adminSettings && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1 font-bold">Reward value ($ USD)</label>
                  <input 
                    type="number" 
                    value={adminSettings.task_reward} 
                    onChange={(e) => onUpdateSettingsAdmin('task_reward', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1 font-bold">Min Cashout target ($ USD)</label>
                  <input 
                    type="number" 
                    value={adminSettings.min_withdrawal} 
                    onChange={(e) => onUpdateSettingsAdmin('min_withdrawal', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1 font-bold">Community channel handle</label>
                  <input 
                    type="text" 
                    value={adminSettings.mandatory_channel_id} 
                    onChange={(e) => onUpdateSettingsAdmin('mandatory_channel_id', e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1 font-bold">Community Link (URL)</label>
                  <input 
                    type="text" 
                    value={adminSettings.mandatory_channel_url} 
                    onChange={(e) => onUpdateSettingsAdmin('mandatory_channel_url', e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateSettingsAdmin('channel_check_enabled', !adminSettings.channel_check_enabled)}
                    className={`w-full py-2.5 rounded-xl border text-[10px] font-mono tracking-wider uppercase font-black transition-all cursor-pointer ${
                      adminSettings.channel_check_enabled 
                        ? 'bg-indigo-600/20 text-indigo-200 border-indigo-400/40 shadow-lg' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {adminSettings.channel_check_enabled ? '🔔 Channel verification: Mandatory' : '🔕 Channel verification: Optional'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Directory Column - Compact sizes */}
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-3xl border border-white/10 p-4.5 shadow-2xl">
            <h3 className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold mb-2.5">
              Registered Users Balance Directory
            </h3>
            
            <div className="space-y-2 text-[11px] font-mono max-h-48 overflow-y-auto pr-1">
              {adminUsers.map((u) => (
                <div key={u.telegram_id} className="p-2 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-white block font-bold truncate">@{u.username}</span>
                    <span className="text-[9px] text-slate-500 block truncate mt-0.5">Code: {u.referral_code}</span>
                  </div>
                  <span className="text-emerald-400 font-bold shrink-0 ml-1">${u.balance.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
