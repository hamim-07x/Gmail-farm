import React from 'react';
import { Copy, Users, TrendingUp, Award, Share2, CornerDownRight } from 'lucide-react';
import { ReferralEarning } from '../types';

interface ReferralTabProps {
  referralStats: {
    referral_code: string;
    level1_count: number;
    level2_count: number;
    level3_count: number;
    total_commission: number;
    history: ReferralEarning[];
  } | null;
  onCopyText: (text: string, title: string) => void;
}

export const ReferralTab: React.FC<ReferralTabProps> = ({ referralStats, onCopyText }) => {
  const code = referralStats?.referral_code || 'loading';
  const inviteLink = `https://t.me/PremiumTasksBDBot?start=${code}`;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-6">
      
      {/* Visual Referral Guide Card */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full filter blur-2xl pointer-events-none" />

        <span className="text-[9px] text-blue-400 font-mono tracking-widest block uppercase font-bold text-center">3-Tier Affiliate Model</span>
        <h2 className="text-lg font-black mt-2 text-white font-display text-center">Invite Friends & Earn</h2>
        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed text-center">
          Unlock infinite leverage using our automated multi-level commission system. Your network commissions are credited to your cashout wallet in real-time.
        </p>

        {/* Level scheme items */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] text-blue-400 font-mono tracking-wider block font-bold">Level 1 (Direct)</span>
              <span className="text-sm font-black text-white block">10% Commission</span>
            </div>
            <span className="text-[9px] text-slate-400 text-right">E.g. Earn $0.02<br/>per task</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] text-purple-400 font-mono tracking-wider block font-bold">Level 2 (Indirect)</span>
              <span className="text-sm font-black text-white block">2% Commission</span>
            </div>
            <span className="text-[9px] text-slate-400 text-right">E.g. Earn $0.004<br/>per task</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] text-amber-400 font-mono tracking-wider block font-bold">Level 3 (Network)</span>
              <span className="text-sm font-black text-white block">1% Commission</span>
            </div>
            <span className="text-[9px] text-slate-400 text-right">E.g. Earn $0.002<br/>per task</span>
          </div>
        </div>

        {/* Copy Invite Link */}
        <div className="mt-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3 backdrop-blur-md">
          <div className="min-w-0">
            <span className="text-[8px] text-slate-400 font-mono block uppercase font-bold text-center">Your Unique Invite Link</span>
            <span className="text-[10px] font-mono font-bold text-blue-300 truncate block mt-1 select-all text-center">
              {inviteLink}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => onCopyText(inviteLink, 'Affiliate link')}
            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-450 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      {/* Referral network stats */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Stat Box Level 1 */}
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl text-center shadow-lg">
          <span className="text-[9px] text-slate-400 font-mono block">Level 1 Members</span>
          <span className="text-sm font-bold text-white mt-1 block flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> {referralStats?.level1_count || 0}
          </span>
        </div>

        {/* Stat Box Level 2 */}
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl text-center shadow-lg">
          <span className="text-[9px] text-slate-400 font-mono block">Level 2 Members</span>
          <span className="text-sm font-bold text-white mt-1 block flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" /> {referralStats?.level2_count || 0}
          </span>
        </div>

        {/* Stat Box Level 3 */}
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl text-center shadow-lg">
          <span className="text-[9px] text-slate-400 font-mono block">Level 3 Members</span>
          <span className="text-sm font-bold text-white mt-1 block flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" /> {referralStats?.level3_count || 0}
          </span>
        </div>

        {/* Total revenue */}
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl text-center shadow-lg">
          <span className="text-[9px] text-slate-400 font-mono block">Affiliate Income</span>
          <span className="text-sm font-black text-cyan-400 mt-1 block flex items-center justify-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> ${referralStats?.total_commission?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      {/* History log commissions */}
      <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-5 shadow-2xl">
        <h3 className="text-[10px] font-bold text-white tracking-wider uppercase mb-3 pb-2 border-b border-white/5 font-mono flex items-center gap-1.5">
          <CornerDownRight className="w-3.5 h-3.5 text-blue-400" /> Commission Ledger
        </h3>
        
        {!referralStats?.history || referralStats.history.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-sans">
            No affiliate commissions recorded yet. Share your link to start generating passive rewards.
          </div>
        ) : (
          <div className="space-y-2">
            {referralStats.history.map((earn) => (
              <div key={earn.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex-1 overflow-hidden">
                  <div className="text-white font-bold flex items-center gap-1.5 truncate text-[10px]">
                    <span className="truncate">@{earn.referred_user_id.substring(0, 10)}...</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-400/25 text-blue-400 uppercase font-black tracking-wider shrink-0">
                      T{earn.level}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    {new Date(earn.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                  </span>
                </div>
                <span className="font-extrabold text-cyan-400 font-sans text-xs shrink-0 w-12 text-right">+${earn.commission.toFixed(4)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
