import React from 'react';

export const NETWORKS = [
  {
    name: 'Devnet',
    endpoint: import.meta.env.VITE_DEVNET_RPC_URL || 'https://api.devnet.solana.com',
    cluster: 'devnet',
    badgeColor: 'bg-emerald-400',
    pingColor: 'bg-emerald-400/75',
    activeText: 'text-emerald-400',
    color: '#14f195'
  },
  {
    name: 'Mainnet',
    endpoint: import.meta.env.VITE_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com',
    cluster: 'mainnet-beta',
    badgeColor: 'bg-cyan-400',
    pingColor: 'bg-cyan-400/75',
    activeText: 'text-cyan-400',
    color: '#00c2ff'
  }
];

export const NetworkSwitcher = ({ currentNetwork, onNetworkChange }) => {
  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
      {NETWORKS.map((net) => {
        const isActive = currentNetwork.cluster === net.cluster;
        return (
          <button
            key={net.name}
            type="button"
            onClick={() => onNetworkChange(net)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer select-none ${
              isActive
                ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isActive && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${net.pingColor}`} />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? net.badgeColor : 'bg-slate-500'}`} />
            </span>
            <span>{net.name}</span>
          </button>
        );
      })}
    </div>
  );
};
