import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';
import { ShowBalance } from './components/ShowBalance';
import { RequestAirDrop } from './components/RequestAirdrop';
import { SendTokens } from './components/SendTokens';
import { SignMessage } from './components/SignMessage';

const wallets = [];

function App() {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen pb-20 px-4 md:px-8">
            {/* Header / Nav */}
            <nav className="flex items-center justify-between py-8 max-w-6xl mx-auto">
              <div>
                <h1 className="text-3xl font-black text-gradient tracking-tight">SolBridge</h1>
                <p className="text-xs text-text-dim uppercase tracking-widest font-bold">Devnet Nexus</p>
              </div>
              <div className="flex gap-4">
                <WalletMultiButton className="!bg-solana-purple !rounded-xl !h-12 hover:!opacity-90 transition-all" />
              </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto text-center py-12 space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Gateway to the <span className="text-gradient">Solana</span> Ecosystem.
              </h2>
              <p className="text-text-dim text-lg md:text-xl max-w-2xl mx-auto">
                Interact with the Solana blockchain seamlessly. Check balances, airdrop tokens,
                and transfer assets with a premium experience.
              </p>
            </header>

            {/* Main Grid */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mt-8">
              {/* Balance & Airdrop - Left Column */}
              <div className="lg:col-span-5 space-y-6">
                <ShowBalance />
                <RequestAirDrop />
              </div>

              {/* Send & Sign - Right Column */}
              <div className="lg:col-span-7 space-y-6">
                <SendTokens />
                <SignMessage />
              </div>
            </main>

            {/* Footer Status */}
            <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card py-3 px-6 border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-solana-green animate-pulse" />
                <span className="text-xs font-medium text-text-dim">Connected to Devnet</span>
              </div>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
