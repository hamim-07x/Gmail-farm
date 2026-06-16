import React from 'react';
import { ArrowUpRight, Coins, Smartphone, Check, HelpCircle, History } from 'lucide-react';
import { User, Withdrawal } from '../types';

interface WithdrawTabProps {
  activeUser: User | null;
  myWithdrawals: Withdrawal[];
  withdrawAmount: string;
  withdrawMethod: string;
  withdrawAccount: string;
  loading: boolean;
  onSetMethod: (method: string) => void;
  onSetAmount: (amount: string) => void;
  onSetAccount: (account: string) => void;
  onSubmitWithdrawRequest: (e: React.FormEvent) => void;
}

export const WithdrawTab: React.FC<WithdrawTabProps> = ({
  activeUser,
  myWithdrawals,
  withdrawAmount,
  withdrawMethod,
  withdrawAccount,
  loading,
  onSetMethod,
  onSetAmount,
  onSetAccount,
  onSubmitWithdrawRequest,
}) => {
  const accountBalance = activeUser?.balance || 0;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-6">
      
      {/* Submission Card Block */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 shadow-2xl space-y-5">
        <div>
          <span className="text-[10px] text-blue-400 font-mono tracking-widest block uppercase font-bold text-center">Secure Settlement</span>
          <h2 className="text-xl font-black text-white font-display text-center mt-1">Instant Cashout</h2>
        </div>

        <form onSubmit={onSubmitWithdrawRequest} className="space-y-5">
          
          {/* Current balance indicator card */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-sm shadow-inner backdrop-blur-md">
            <span className="text-slate-300 font-sans text-xs">Available Earnings</span>
            <span className="font-extrabold text-blue-400 text-lg font-mono">${accountBalance.toFixed(2)}</span>
          </div>

          {/* Selector block */}
          <div className="space-y-2">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider font-extrabold ml-1">1. Choose Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {/* PayPal card selector */}
              <button
                type="button"
                onClick={() => onSetMethod('PayPal')}
                className={`py-3 rounded-2xl text-xs font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  withdrawMethod === 'PayPal' 
                    ? 'bg-gradient-to-b from-blue-600/20 to-blue-600/5 border-blue-500 text-blue-300 shadow-[0_4px_15px_rgba(59,130,246,0.15)] bg-blue-950/20' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${withdrawMethod === 'PayPal' ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-[11px] font-display tracking-tight">PayPal</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest opacity-80 text-blue-400/80 font-mono">Global Transfer</span>
              </button>

              {/* Binance card selector */}
              <button
                type="button"
                onClick={() => onSetMethod('Binance')}
                className={`py-3 rounded-2xl text-xs font-bold border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  withdrawMethod === 'Binance' 
                    ? 'bg-gradient-to-b from-amber-600/20 to-amber-600/5 border-amber-500 text-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.15)] bg-amber-950/20' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-slate-300 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${withdrawMethod === 'Binance' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-[11px] font-display tracking-tight">Binance USDT</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest opacity-80 text-amber-400/80 font-mono">Crypto Network</span>
              </button>
            </div>
          </div>

          {/* Account Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1 font-extrabold ml-1">
              2. Account ID / Email
            </label>
            <input 
              type="text" 
              placeholder="e.g. email@example.com" 
              value={withdrawAccount}
              onChange={(e) => onSetAccount(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1 font-extrabold ml-1">
              3. Withdrawal USD Amount (Min. $1.00)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
              <input 
                type="number" 
                min="1"
                step="0.01"
                placeholder="1.00"
                value={withdrawAmount}
                onChange={(e) => onSetAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 shadow-inner"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:to-indigo-500 disabled:opacity-55 text-white font-bold text-xs tracking-wider rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Process Cashout</span>
          </button>
        </form>
      </div>

      {/* Transaction History Column */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 shadow-2xl">
        <h3 className="text-[10px] font-bold text-white tracking-wider uppercase mb-3 pb-2 border-b border-white/5 font-mono flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-400" /> Cashout Ledger
        </h3>
        
        {myWithdrawals.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 leading-relaxed font-sans">
            No cashout history found. <br />Minimum system threshold limit: <strong className="text-blue-400 font-mono">$1.00 USD</strong>.
          </div>
        ) : (
          <div className="space-y-2">
            {myWithdrawals.map((wd) => (
              <div key={wd.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-[11px] font-display">{wd.method} Payout</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black border tracking-wider ${
                    wd.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : wd.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {wd.status}
                  </span>
                </div>

                <div className="text-[9px] text-slate-400 font-mono truncate">
                  Account: {wd.account_number} <br />Date: {new Date(wd.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                </div>

                {wd.admin_note && (
                  <div className="text-[10px] p-2 bg-black/40 border border-white/5 rounded-lg text-slate-350 mt-1">
                    <span className="text-[8px] uppercase font-mono text-slate-500 block mb-0.5">System Note</span>
                    {wd.admin_note}
                  </div>
                )}

                <div className="text-right font-black text-blue-400 text-sm mt-1">
                  ${wd.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
