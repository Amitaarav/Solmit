import { LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey, Keypair } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import { 
  MINT_SIZE, 
  TOKEN_PROGRAM_ID, 
  createInitializeMint2Instruction, 
  getAssociatedTokenAddressSync, 
  createAssociatedTokenAccountInstruction, 
  createMintToInstruction 
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { Buffer } from "buffer";
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

/**
 * Fetches the current SOL price in USD
 * @returns {Promise<number>} SOL price in USD
 */
export async function getSolPrice() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error("Failed to fetch SOL price:", error);
    return 0;
  }
}
/**
 * Fetches recent transaction signatures for a public key
 * @param {Connection} connection 
 * @param {PublicKey} publicKey 
 * @param {number} limit 
 * @returns {Promise<Array>} List of signatures with timestamps
 */
export async function getTransactions(connection, publicKey, limit = 5) {
  if (!publicKey) return [];
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
    return signatures;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}


export async function createToken({connection, wallet, name, symbol, imageUrl, initialSupply}) {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  // Generate a new keypair for the token mint
  const mintKeypair = Keypair.generate();

  // Calculate the amount of lamports needed for rent exemption for the mint account
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  // 1. Create the mint account
  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: MINT_SIZE,
    lamports,
    programId: TOKEN_PROGRAM_ID,
  });

  // 2. Initialize the mint
  const initializeMintInstruction = createInitializeMint2Instruction(
    mintKeypair.publicKey,
    9, // Default 9 decimals
    wallet.publicKey, // Mint authority
    wallet.publicKey, // Freeze authority
    TOKEN_PROGRAM_ID
  );

  // 3. Find/Create Associated Token Account for user
  const associatedToken = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID
  );

  const createATAInstruction = createAssociatedTokenAccountInstruction(
    wallet.publicKey, // Payer
    associatedToken, // ATA
    wallet.publicKey, // Owner
    mintKeypair.publicKey, // Mint
    TOKEN_PROGRAM_ID
  );

  // 4. Mint the initial supply
  const mintToInstruction = createMintToInstruction(
    mintKeypair.publicKey,
    associatedToken,
    wallet.publicKey,
    initialSupply * Math.pow(10, 9), // amount (taking decimals into account)
    [],
    TOKEN_PROGRAM_ID
  );

  // 5. Create Metadata for the token
  const metadataProgramId = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      metadataProgramId.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    metadataProgramId
  );

  const metadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintKeypair.publicKey,
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: name,
          symbol: symbol,
          uri: imageUrl, // Typically a link to a JSON that contains standard metadata but imageUrl can be a quick placeholder.
          creators: null,
          sellerFeeBasisPoints: 0,
          uses: null,
          collection: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  // Combine instructions into a single transaction
  const transaction = new Transaction().add(
    createAccountInstruction,
    initializeMintInstruction,
    createATAInstruction,
    mintToInstruction,
    metadataInstruction
  );

  // Send the transaction. The new mintKeypair needs to sign too.
  const signature = await wallet.sendTransaction(transaction, connection, {
    signers: [mintKeypair],
  });

  await connection.confirmTransaction(signature);
  return {
    signature,
    mintAddress: mintKeypair.publicKey.toBase58()
  };
}