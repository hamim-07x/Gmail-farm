import React from 'react';
import { PlusCircle, Users, Check, TrendingUp, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { Task, ReferralEarning } from '../types';

interface DashboardTabProps {
  activeTask: Task | null;
  myTasks: Task[];
  referralStats: {
    total_commission: number;
    history: ReferralEarning[];
  } | null;
  onNavigateToTab: (tab: 'home' | 'task' | 'history' | 'referral' | 'withdraw' | 'admin') => void;
  onAssignNewTask: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  activeTask,
  myTasks,
  referralStats,
  onNavigateToTab,
  onAssignNewTask,
}) => {
  const tasksApprovedCount = myTasks.filter(t => t.status === 'approved').length;
  const pendingTasksCount = myTasks.filter(t => t.status === 'submitted' || t.status === 'pending').length;
  const referralCommission = referralStats?.total_commission || 0;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Primary Action Card with heavy glass blurs */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Soft elegant glowing shape as design variation */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl pointer-events-none" />
        
        <div>
          <span className="text-[9px] text-blue-400 font-mono tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-400/20 uppercase font-black">
            Monetize Data Traffic
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-4 text-white leading-tight font-display">
            Register Tasks & Get Paid Instantly
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
            Acquire randomly-generated credential keys, complete the required sign-ups, and get instant cashout rewards in USD.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              if (!activeTask) {
                onAssignNewTask();
              }
              onNavigateToTab('task');
            }}
            className="w-full sm:w-auto px-5 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-[30deg] -translate-x-[150%] transition-transform duration-500 ease-out hover:translate-x-[150%]" />
            <PlusCircle className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">{activeTask ? 'Continue Current Task' : 'Start Earning • $0.20'}</span>
          </button>
        </div>
      </div>

      {/* Progress Stats Panel */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 flex flex-col justify-between gap-5 shadow-2xl relative overflow-hidden">
        <div>
          <h3 className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-bold mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Progress Statistics
          </h3>
          <div className="space-y-3">
            
            {/* Stat Item 1 */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                </div>
                Tasks Completed
              </span>
              <span className="text-xs font-mono font-extrabold text-white bg-white/[0.03] border border-white/5 px-2 py-1 rounded-md">
                {tasksApprovedCount} approved
              </span>
            </div>

            {/* Stat Item 2 */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                Network Bonus
              </span>
              <span className="text-xs font-mono font-extrabold text-cyan-400 bg-white/[0.03] border border-white/5 px-2 py-1 rounded-md">
                ${referralCommission.toFixed(2)}
              </span>
            </div>

            {/* Stat Item 3 */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                Under Review
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-500 bg-white/[0.03] border border-white/5 px-2 py-1 rounded-md">
                {pendingTasksCount} pending
              </span>
            </div>
          </div>
        </div>

        {/* Info label banner */}
        <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl text-[10px] leading-relaxed text-slate-400 flex gap-2">
          <span className="text-blue-400">💡</span>
          <p>Request automatic secure settlement payouts directly to your designated withdrawal accounts anytime.</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h3 className="text-[10px] font-bold text-white tracking-widest uppercase font-mono">
            Recent Activity
          </h3>
          <button 
            type="button"
            onClick={() => onNavigateToTab('history')} 
            className="text-[10px] text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1 font-bold uppercase"
          >
            <span>See Full</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-sans">
            Ready to deploy your first credentials.<br/>Click <strong className="text-blue-400">Start Earning Task</strong> above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {myTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-3 rounded-2xl bg-white/[0.012] border border-white/5 flex flex-row items-center justify-between gap-2 text-xs font-mono">
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-white text-[11px] truncate">{task.email}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {new Date(task.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider border ${
                    task.status === 'approved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : task.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {task.status}
                  </span>

                  <span className="font-extrabold text-xs text-blue-400 font-sans w-12 text-right">
                    ${task.reward_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
