import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletConnectButton,
  WalletDisconnectButton,
    WalletModalProvider,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { RequestAirDrop } from './components/RequestAirdrop';
import { ShowBalance } from './components/ShowBalance';
import { SendTokens } from './components/SendTokens';
import { SignMessage } from './components/SignMessage';
const wallets = [];
function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-200">
      <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="space-y-1 m-4 w-full max-w-md">
                <WalletMultiButton/>
                <WalletDisconnectButton/>
                <RequestAirDrop/>
                <ShowBalance/>
                <SendTokens/>
                <SignMessage/>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
