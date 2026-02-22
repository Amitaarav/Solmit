import { LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";

/**
 * Fetches the balance for a given public key
 * @param {Connection} connection 
 * @param {PublicKey} publicKey 
 * @returns {Promise<number>} Balance in SOL
 */
export async function getBalance(connection, publicKey) {
  if (!publicKey) return 0;
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

/**
 * Requests an airdrop for the connected wallet
 * @param {Connection} connection 
 * @param {PublicKey} publicKey 
 * @param {number} amount SOL amount
 */
export async function requestAirdrop(connection, publicKey, amount) {
  if (!publicKey) throw new Error("Wallet not connected");
  const lamports = amount * LAMPORTS_PER_SOL;
  const signature = await connection.requestAirdrop(publicKey, lamports);
  await connection.confirmTransaction(signature);
  return signature;
}

/**
 * Sends SOL to a recipient address
 * @param {Connection} connection 
 * @param {WalletContextState} wallet 
 * @param {string} recipientStr 
 * @param {number} amount 
 */
export async function sendSol(connection, wallet, recipientStr, amount) {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  
  const recipient = new PublicKey(recipientStr);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await wallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature);
  return signature;
}

/**
 * Signs a message and verifies it
 * @param {WalletContextState} wallet 
 * @param {string} message 
 * @returns {Promise<{signature: Uint8Array, isValid: boolean}>}
 */
export async function signAndVerify(wallet, message) {
  if (!wallet.publicKey || !wallet.signMessage) {
    throw new Error("Wallet does not support message signing or is not connected");
  }

  const encodedMessage = new TextEncoder().encode(message);
  const signature = await wallet.signMessage(encodedMessage);
  
  const isValid = ed25519.verify(signature, encodedMessage, wallet.publicKey.toBytes());
  
  return { signature, isValid };
}
