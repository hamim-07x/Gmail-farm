import React from 'react';
import { Sliders, Smartphone, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface SimulatorControlsProps {
  activeUser: User | null;
  simulatedTelegramId: string;
  simulatedFirstName: string;
  simulatedUsername: string;
  referralInput: string;
  simulatedUsersList: Array<{ id: string; first_name: string; username: string; refCode: string }>;
  onSetTelegramId: (id: string) => void;
  onSetFirstName: (name: string) => void;
  onSetUsername: (username: string) => void;
  onSetReferralInput: (input: string) => void;
  onProfileSwap: (profile: any) => void;
  onApplyCustomProfile: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  activeUser,
  simulatedTelegramId,
  simulatedFirstName,
  simulatedUsername,
  referralInput,
  simulatedUsersList,
  onSetTelegramId,
  onSetFirstName,
  onSetUsername,
  onSetReferralInput,
  onProfileSwap,
  onApplyCustomProfile,
}) => {
  return (
    <div className="w-full bg-[#0a071c]/95 border-b border-white/5 p-4 z-30 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-amber-400 animate-pulse" />
            Device Simulation Workspace &bull; Testing Panel
          </h3>
          <p className="text-[11px] text-slate-305 mt-1">
            Swap profiles to simulate multi-tiered downstream tasks and test correct recursive affiliate tracking loops instantly in real-time.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {simulatedUsersList.map((simUser) => (
            <button
              key={simUser.id}
              onClick={() => onProfileSwap(simUser)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeUser?.telegram_id === simUser.id
                  ? 'bg-sky-500/10 text-sky-400 border-sky-400/50 shadow-inner'
                  : 'bg-white/[0.02] hover:bg-white/[0.08] text-slate-300 border-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{simUser.first_name}</span>
              {simUser.refCode && <span className="text-[9px] px-1.5 py-0.2 bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono rounded">Linked</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Simulated Telegram ID</label>
          <input 
            type="text" 
            value={simulatedTelegramId} 
            onChange={(e) => onSetTelegramId(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Display Name</label>
          <input 
            type="text" 
            value={simulatedFirstName} 
            onChange={(e) => onSetFirstName(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Username Prefix</label>
          <input 
            type="text" 
            value={simulatedUsername} 
            onChange={(e) => onSetUsername(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Referral code link</label>
          <input 
            type="text" 
            placeholder="Optional referral code link" 
            value={referralInput} 
            onChange={(e) => onSetReferralInput(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mt-3 flex justify-end">
        <button 
          onClick={onApplyCustomProfile} 
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Apply Custom Simulated Profile</span>
        </button>
      </div>
    </div>
  );
};
