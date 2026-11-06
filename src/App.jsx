import React, { useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';
import { ShowBalance } from './components/ShowBalance';
import { RequestAirDrop } from './components/RequestAirdrop';
import { SendTokens } from './components/SendTokens';
import { SignMessage } from './components/SignMessage';
import { ActivityFeed } from './components/ActivityFeed';
import { Swap } from './components/Swap';
import { TokenLaunchpad } from './components/TokenLaunchpad';
import { NetworkSwitcher, NETWORKS } from './components/NetworkSwitcher';
import {
  SendIcon,
  AirdropIcon,
  CoinsIcon,
  SwapIcon,
  ShieldIcon,
  SolanaIcon,
  ActivityIcon
} from './components/Icons';
import { Toaster } from 'react-hot-toast';

const wallets = [];

function App() {
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [activeTab, setActiveTab] = useState('transfer');

  const tabs = [
    { id: 'transfer', label: 'Transfer', icon: SendIcon },
    { id: 'faucet', label: 'Faucet', icon: AirdropIcon },
    { id: 'launchpad', label: 'Launchpad', icon: CoinsIcon },
    { id: 'swap', label: 'Swap', icon: SwapIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
  ];

  return (
    <ConnectionProvider endpoint={network.endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06070a]/80 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.1] flex items-center justify-center shadow-md">
                    <img
                      src="/src/assets/solmit.png"
                      alt="SolMit"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold tracking-tight text-white">
                        SolMit
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Nexus
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      Solana Asset & Protocol Hub
                    </p>
                  </div>
                </div>

                {/* Right controls: Network Switcher + Wallet */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <NetworkSwitcher
                    currentNetwork={network}
                    onNetworkChange={setNetwork}
                  />
                  <WalletMultiButton />
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
              {/* Workspace Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 gap-4 overflow-x-auto no-scrollbar">
                <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 select-none cursor-pointer ${
                          isActive
                            ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span>Solana Cluster Connected</span>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Overview Balance & Pulse Activity (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <ShowBalance
                    network={network}
                    onSelectTab={(tabId) => setActiveTab(tabId)}
                  />
                  <ActivityFeed network={network} />
                </div>

                {/* Right Column: Active Tool Workspace (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="transition-all duration-200 ease-out">
                    {activeTab === 'transfer' && (
                      <SendTokens network={network} />
                    )}

                    {activeTab === 'faucet' && (
                      <RequestAirDrop
                        network={network}
                        onSwitchToDevnet={() => setNetwork(NETWORKS[0])}
                      />
                    )}

                    {activeTab === 'launchpad' && (
                      <TokenLaunchpad network={network} />
                    )}

                    {activeTab === 'swap' && (
                      <Swap
                        network={network}
                        onSwitchToMainnet={() => setNetwork(NETWORKS[1])}
                      />
                    )}

                    {activeTab === 'security' && (
                      <SignMessage />
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] bg-[#06070a] py-6 mt-16 text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2.5">
                  <SolanaIcon className="w-4 h-4 opacity-75" />
                  <span>Powered by Solana Blockchain & Metaplex</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    RPC: {network.name} Active
                  </span>
                  <span>© 2026 SolMit</span>
                </div>
              </div>
            </footer>

            {/* Refined Toast styling adhering to dark craft floor */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0d0f18',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '12px 16px',
                  maxWidth: '380px'
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#06070a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#06070a',
                  },
                },
              }}
            />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
