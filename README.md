### Solana Wallet dApp
This project is a Solana Web3 dApp built with React that allows users to:

1. Connect and disconnect their Solana wallet

2. Request test SOL tokens via Airdrop

3. Check their SOL balance

4. Send SOL tokens to another wallet

5. Sign and verify messages

The application connects to the Solana Devnet and uses the @solana/wallet-adapter suite for seamless wallet interactions.

### Project Structure
graphql
Copy
Edit
```
.
├── App.tsx / App.jsx               # Root component with providers and UI
├── components/
│   ├── RequestAirdrop.tsx         # Airdrop tokens to your wallet
│   ├── ShowBalance.tsx            # Display SOL balance
│   ├── SendTokens.tsx             # Transfer SOL to another address
│   └── SignMessage.tsx            # Sign and verify a message
├── App.css                        # Basic styling
├── README.md                      # You're reading it!
⚙️ Features Explained
🧩 ConnectionProvider and WalletProvider
```

```
<ConnectionProvider endpoint="https://api.devnet.solana.com">
  <WalletProvider wallets={wallets} autoConnect>

```
ConnectionProvider: Connects the app to the Solana Devnet using the specified RPC endpoint.

WalletProvider: Provides wallet context. The wallets array contains supported wallets (empty here means default browser wallets). autoConnect reconnects the wallet if previously connected.

UI Components from @solana/wallet-adapter-react-ui
```
<WalletMultiButton/>
<WalletDisconnectButton/>
```
WalletMultiButton: A UI button to connect a wallet. Supports Phantom, Solflare, etc.

WalletDisconnectButton: Disconnects the connected wallet.

These come styled out-of-the-box from:

```
import '@solana/wallet-adapter-react-ui/styles.css';
```
Components Breakdown
Request Airdrop
```
<RequestAirdrop />
```
This component allows the user to request free SOL from the Devnet faucet for testing.

## Key Functions:
Uses connection.requestAirdrop(publicKey, lamports)

Converts SOL input into lamports (1 SOL = 1e9 lamports)

Wallet must be connected and have a public key

Show Balance
```
<ShowBalance />
```
This component fetches and displays the user's current SOL balance.

## Key Functions:
Uses connection.getBalance(wallet.publicKey)

Converts lamports to SOL for readability

Updates DOM dynamically

Send Tokens

```
<SendTokens />
```
Send SOL tokens from the connected wallet to a specified address.

## Key Functions:
Uses SystemProgram.transfer inside a Transaction

wallet.sendTransaction() is used to send the signed transaction

Validates recipient and amount before sending

Alerts on success or failure

Sign Message

```
<SignMessage />
```
This component allows users to digitally sign a message using their wallet and verifies it using Ed25519.

## Key Concepts:
Uses wallet.signMessage() to get a signature

Uses @noble/curves/ed25519 for signature verification

Encodes message as Uint8Array using TextEncoder

Confirms that the signature was created by the wallet

### Important Terms

Term	Meaning
LAMPORTS_PER_SOL	1 SOL = 1,000,000,000 lamports. Used for precision.
SystemProgram.transfer	Instruction to transfer SOL between accounts.
Transaction	A set of instructions to be executed atomically on-chain.
PublicKey	A base58 string representing a wallet address.
signMessage()	Allows cryptographic message signing by the user’s wallet.
autoConnect	Automatically attempts to reconnect the previously connected wallet.
connection	Object representing an RPC connection to the Solana cluster.
wallet.publicKey	The current wallet’s public address.

📦 Dependencies
Package	Description
```
@solana/web3.js	Core Solana SDK for JavaScript
@solana/wallet-adapter-react	React hooks for wallet integration
@solana/wallet-adapter-react-ui	Pre-built React UI components for wallet operations
@noble/curves	Crypto curve utilities for message signing/verification
tailwindcss	Utility-first CSS for fast UI development
```

🧪 Devnet vs Mainnet
This app connects to the Solana Devnet, a free testing environment. Use it to test without risking real tokens.

tsx
Copy
Edit
```
<ConnectionProvider endpoint="https://api.devnet.solana.com">
```
To use Mainnet, simply replace with:

tsx
Copy
Edit
```
https://api.mainnet-beta.solana.com
```
🚀 Getting Started
1. Clone & Install
bash
Copy
Edit
```
git clone https://github.com/your-username/solana-wallet-dapp
cd solana-wallet-dapp
npm install
```
2. Run
bash
Copy
Edit
```
npm run dev
```
Make sure you have a wallet like Phantom installed in your browser.

🛡️ Security Note
This dApp is meant for development and testing on Devnet.

Never expose private keys or secret phrases.

Do not use real tokens or connect to Mainnet without proper audit and safety checks.

