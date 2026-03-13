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
import { Toaster } from 'react-hot-toast';
import { NetworkSwitcher, NETWORKS } from './components/NetworkSwitcher';

const wallets = [];

function App() {
  const [network, setNetwork] = useState(NETWORKS[0]);

  return (
    <ConnectionProvider endpoint={network.endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen pb-20 px-4 md:px-8">
            {/* Header / Nav */}
            <nav className="flex items-center justify-between py-6 max-w-6xl mx-auto backdrop-blur-md sticky top-0 z-50">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-solana-green to-solana-purple rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform animate-float">
                  S
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gradient tracking-tight">SolBridge</h1>
                  <p className="text-[10px] text-text-dim uppercase tracking-widest font-bold opacity-70">Solana Nexus</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <NetworkSwitcher currentNetwork={network} onNetworkChange={setNetwork} />
                <WalletMultiButton className="!bg-white/5 !border !border-white/10 !rounded-xl !h-12 hover:!bg-white/10 !transition-all !font-bold" />
              </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto text-center py-20 space-y-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-solana-purple/20 blur-[120px] rounded-full -z-10" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold mb-4" style={{ color: network.color }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: network.color }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: network.color }}></span>
                </span>
                Live on {network.name}
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
                The Future of <br />
                <span className="text-gradient">Seamless Solana</span>
              </h2>
              <p className="text-text-dim text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Connect, Swap, and Track your assets across <span className="text-white font-bold">{network.name}</span> with
                the most intuitive interface.
              </p>
            </header>

            {/* Main Grid */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
              {/* Balance & Airdrop - Left Column */}
              <div className="lg:col-span-5 space-y-8">
                <ShowBalance />
                <RequestAirDrop network={network} />
                <ActivityFeed />
              </div>

              {/* Send & Sign - Right Column */}
              <div className="lg:col-span-7 space-y-8">
                <Swap network={network} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                  <SendTokens />
                  <SignMessage />
                </div>
              </div>
            </main>

            {/* Footer Status */}
            <footer className="mt-20 pb-12 text-center text-text-dim text-sm border-t border-white/5 pt-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: network.color }} />
                  <span className="text-xs font-bold tracking-widest uppercase">{network.name} Status: Operational</span>
                </div>
                <p>© 2026 SolBridge Nexus. All rights reserved.</p>
              </div>
            </footer>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
