import React from 'react';
import { Task } from '../types';
import { CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';

interface HistoryTabProps {
  myTasks: Task[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ myTasks }) => {
  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-6">
      <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 shadow-2xl">
        <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
            Task Ledger
          </h2>
        </div>

        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-sans leading-relaxed">
            No work logs found.<br/>Visit the <strong className="text-blue-400">Earn Task</strong> tab to generate your initial data.
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div 
                key={task.id} 
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-mono font-bold text-white break-all">{task.email}</span>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5 pt-1">
                      ID: <span className="text-blue-400 font-bold">{task.id.slice(0, 8)}</span> • {task.first_name}
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded border text-[8px] font-mono uppercase font-black tracking-wider flex items-center justify-center min-w-[75px] gap-1 shrink-0 ${
                    task.status === 'approved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                      : task.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                  }`}>
                    {task.status === 'approved' && <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />}
                    {task.status === 'rejected' && <XCircle className="w-2.5 h-2.5 shrink-0" />}
                    {task.status === 'submitted' && <Clock className="w-2.5 h-2.5 animate-pulse shrink-0" />}
                    {task.status === 'pending' && <Clock className="w-2.5 h-2.5 shrink-0" />}
                    {task.status}
                  </span>
                </div>

                {/* Optional Admin Review Comments */}
                {task.admin_note && (
                  <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed border ${
                    task.status === 'approved' 
                      ? 'bg-emerald-550/[0.03] border-emerald-500/15 text-emerald-350 font-sans' 
                      : 'bg-rose-550/[0.03] border-rose-500/15 text-rose-350 font-sans'
                  }`}>
                    <strong className="uppercase font-mono text-[8px] tracking-wider block opacity-75 mb-0.5">Admin Remarks:</strong>
                    <span>{task.admin_note}</span>
                  </div>
                )}

                <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="font-extrabold text-white text-[11px]">Reward: <span className="text-cyan-400">${task.reward_amount.toFixed(2)}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
