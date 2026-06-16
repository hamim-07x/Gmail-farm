import React from 'react';
import { PlusCircle, Lock, Copy, Eye, EyeOff, ChevronRight, Check, Tv, Sparkles, ExternalLink, XCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskTabProps {
  activeTask: Task | null;
  taskStep: 'generate' | 'instructions';
  showPassword: boolean;
  onAssignNewTask: () => void;
  onTogglePassword: () => void;
  onCopyText: (text: string, title: string) => void;
  onSetStep: (step: 'generate' | 'instructions') => void;
  onSubmitCompletedTask: () => void;
  onCancelActiveTask?: () => void; // Allows user to cancel task & revert
}

export const TaskTab: React.FC<TaskTabProps> = ({
  activeTask,
  taskStep,
  showPassword,
  onAssignNewTask,
  onTogglePassword,
  onCopyText,
  onSetStep,
  onSubmitCompletedTask,
  onCancelActiveTask,
}) => {
  if (!activeTask) {
    return (
      <div className="max-w-xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 mx-auto mb-5 flex items-center justify-center text-sky-400 border border-sky-500/20">
            <PlusCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display">Generate New Monetizing Key</h2>
          <p className="text-xs sm:text-sm text-slate-305 mt-2 max-w-sm mx-auto leading-relaxed">
            Generate credentials to begin. Our secure server database will assign you a dedicated, 100% unique registration email payload and full name instantly.
          </p>
          
          <button 
            type="button"
            onClick={onAssignNewTask}
            className="mt-6 w-full p-4 text-xs font-black text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-indigo-500 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2 mx-auto cursor-pointer uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assign New Task &bull; $20.00 USD</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {taskStep === 'generate' ? (
        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4.5">
            <div>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider block uppercase font-bold">Step 1 of 2 &bull; Secure Credentials Payload</span>
              <span className="text-base font-bold text-white font-display">Assigned Task Accounts</span>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-[10px] font-mono text-sky-400 font-black tracking-wider uppercase">
              Reward: ${activeTask.reward_amount.toFixed(2)} USD
            </span>
          </div>

          {/* Target Allocated Name */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl relative shadow-inner">
            <div className="absolute top-3 right-3 text-cyan-405 text-[9px] uppercase font-mono tracking-widest bg-cyan-500/10 py-1 px-2.5 rounded-full border border-cyan-400/20">
              Allocated Name
            </div>
            <h4 className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mb-1 font-bold">Dedicated Full Name</h4>
            <div className="text-base font-bold text-white font-mono">{activeTask.first_name}</div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Use this specific name payload if requested during signup.
            </p>
          </div>

          {/* Copy-paste variables block */}
          <div className="space-y-3.5">
            
            {/* Email field */}
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block font-bold mb-1">Generated Registration Email</span>
                <span className="text-sm font-mono font-bold text-white break-all select-all font-semibold block">{activeTask.email}</span>
              </div>
              <button 
                type="button"
                onClick={() => onCopyText(activeTask.email, 'Email address')}
                className="px-4 py-2.5 text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] hover:text-white text-slate-300 rounded-xl border border-white/5 transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer uppercase tracking-wider"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </button>
            </div>

            {/* Password field */}
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block font-bold mb-1">Generated Passkey Payload</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white tracking-wider select-all">
                    {showPassword ? activeTask.password : '••••••••••••'}
                  </span>
                  <button 
                    type="button"
                    onClick={onTogglePassword} 
                    className="text-slate-500 hover:text-slate-300 transition-all p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => onCopyText(activeTask.password, 'Passkey')}
                className="px-4 py-2.5 text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] hover:text-white text-slate-300 rounded-xl border border-white/5 transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer uppercase tracking-wider"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Password</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[11px] leading-relaxed text-amber-300 flex gap-2">
            <span className="text-sm shrink-0">⚠️</span>
            <p>
              <strong>Critical Directive:</strong> You must enter the exact email and password credentials provided. Automated checkers match logs against these keys strictly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button 
              type="button"
              onClick={() => onSetStep('instructions')}
              className="w-full sm:flex-1 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>Host Instructions Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onCancelActiveTask && (
              <button 
                type="button"
                onClick={onCancelActiveTask}
                className="w-full sm:w-auto px-5 py-4 bg-rose-600/10 hover:bg-rose-600/25 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Task</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Instructions step */
        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4.5">
            <div>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider block uppercase font-bold">Step 2 of 2 &bull; Submission Workspace</span>
              <span className="text-base font-bold text-white">Complete Digital Tasks</span>
            </div>
            
            <button 
              type="button"
              onClick={() => onSetStep('generate')} 
              className="text-xs text-sky-400 hover:text-white underline font-mono"
            >
              Review credentials
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Step instruction 1 */}
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5">
              <h4 className="text-sm font-bold text-sky-405 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-400 text-xs flex items-center justify-center font-mono font-bold border border-sky-400/25">1</span>
                Navigate to Registration Portal
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed ml-7 font-sans">
                Open the external partner link in any tab or frame:
                <a 
                  href="https://premium-signup-portal.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 underline hover:text-cyan-300 mx-1.5 inline-flex items-center gap-0.5"
                >
                  https://premium-signup-portal.com <ExternalLink className="w-3 h-3" />
                </a> 
                and select the Registration Page.
              </p>
            </div>

            {/* Step instruction 2 */}
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5">
              <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-400 text-xs flex items-center justify-center font-mono font-bold border border-purple-400/25">2</span>
                Apply Credentials Payload
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed ml-7 font-sans">
                Sign up with your generated Unique Email and Password. No email lookup or inbox confirmation is required on the external site.
              </p>
            </div>

            {/* Video Tutorial Walkthrough */}
            <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 inline-block w-full">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">Video Guide Walkthrough</h5>
                <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 px-2 py-0.5 bg-cyan-500/10 border border-cyan-400/20 rounded flex items-center gap-1 font-semibold">
                  <Tv className="w-3.5 h-3.5" /> High Definition
                </span>
              </div>
              <div className="aspect-video bg-[#070514]/80 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
                <span className="text-xs text-slate-500 font-mono mt-2">Streaming walk-through instructions guide...</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] leading-relaxed text-emerald-350">
              <strong>Verification Insight:</strong> Upon clicking submit, our server ledger automatically tracks host registration activity database streams within seconds.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button 
              type="button"
              onClick={onSubmitCompletedTask}
              className="w-full sm:flex-1 py-4 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Check className="w-4 h-4" />
              <span>Submit Registration &bull; Submit Task</span>
            </button>

            {onCancelActiveTask && (
              <button 
                type="button"
                onClick={onCancelActiveTask}
                className="w-full sm:w-auto px-5 py-4 bg-rose-600/10 hover:bg-rose-600/25 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Task</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
