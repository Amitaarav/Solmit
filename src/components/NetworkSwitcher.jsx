import React from 'react';

export const NETWORKS = [
    {
        name: 'Devnet',
        endpoint: 'https://api.devnet.solana.com',
        cluster: 'devnet',
        color: 'var(--solana-green)'
    },
    {
        name: 'Mainnet',
        endpoint: 'https://api.mainnet-beta.solana.com',
        cluster: 'mainnet-beta',
        color: 'var(--solana-blue)'
    }
];

export const NetworkSwitcher = ({ currentNetwork, onNetworkChange }) => {
    return (
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
            {NETWORKS.map((net) => (
                <button
                    key={net.name}
                    onClick={() => onNetworkChange(net)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${currentNetwork.name === net.name
                            ? 'bg-gradient-to-r from-solana-green to-solana-purple text-white shadow-lg scale-105'
                            : 'text-text-dim hover:text-white hover:bg-white/5'
                        }`}
                >
                    {net.name}
                </button>
            ))}
        </div>
    );
};
