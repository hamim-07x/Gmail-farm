import React from 'react';
import { Lock, Send, HelpCircle } from 'lucide-react';
import { SystemSettings } from '../types';

interface MandatoryJoinProps {
  adminSettings: SystemSettings | null;
  onVerifyJoin: () => void;
  onOpenChannel: () => void;
}

export const MandatoryJoin: React.FC<MandatoryJoinProps> = ({ adminSettings, onVerifyJoin, onOpenChannel }) => {
  return (
    <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col justify-center items-center z-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[32px] w-full p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Soft exquisite backdrop ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/10 rounded-full filter blur-[40px] pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-[1.5px] mx-auto mb-6 flex items-center justify-center shadow-xl">
          <div className="w-full h-full bg-[#0a071c] rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white font-display">Telegram Channel Required</h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
          Join our official channel to activate premium tasks, instantly receive automated withdrawal approvals, and earn commission payouts.
        </p>

        {/* Channel directory card */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-left backdrop-blur-md">
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider font-bold">Official Telegram Channel</span>
            <span className="text-sm font-bold text-sky-300 truncate block mt-0.5">{adminSettings?.mandatory_channel_id || '@PremiumTasksBD'}</span>
          </div>
          
          <a 
            href={adminSettings?.mandatory_channel_url || 'https://t.me/PremiumTasksBD'} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onOpenChannel}
            className="px-4 py-2.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-400 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Join Now</span>
          </a>
        </div>

        <button 
          onClick={onVerifyJoin}
          className="mt-6 w-full py-4 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-420 hover:to-indigo-500 text-white font-bold tracking-wider text-xs rounded-xl shadow-[0_4px_20px_rgba(14,165,233,0.3)] transition-all duration-300 active:scale-98 uppercase pointer-events-auto cursor-pointer"
        >
          I have Joined &bull; Check Status
        </button>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Membership is automatically verified via Bot API</span>
        </div>
      </div>
    </main>
  );
};
