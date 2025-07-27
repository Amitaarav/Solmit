import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
export function SendTokens() {

    const { connection } = useConnection();
    const wallet = useWallet();

    async function sendTokens() {
        if (!wallet.connected) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!wallet.publicKey) {
            alert("Wallet public key is not available.");
            return;
        }

        const recipient = document.getElementById("recipient").value;
        const amount = document.getElementById("amount").value;

        if (!recipient || !amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }

        // creating a transaction object
        // to transfer SOL from the sender's wallet to the recipient's wallet
        // single transaction can have multiple instructions
        // here we are using SystemProgram.transfer to transfer SOL
        const transation = new Transaction();

        transation.add(
            // Importing SystemProgram from @solana/web3.js
            // to create a transfer instruction
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(recipient),
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        await wallet.sendTransaction(transation, connection)
            .then(() => {
                alert(`Sent ${amount} SOL to ${recipient} successfully.`);
            })
            .catch((error) => {
                console.error("Transaction failed:", error);
                alert("Transaction failed. Please try again.");
            });
    }

    return (
        <div className="space-y-2 flex flex-col items-center border p-4 rounded-md bg-white shadow-lg">
            <p className="text-xl font-semibold">Send Tokens</p>
            <input className="border rounded text-center" id="recipient" type="text" placeholder="Recipient Address" />
            <input className="border rounded text-center" id="amount" type="text" placeholder="Amount in SOL" />
            <button className="bg-violet-800 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={sendTokens}>Send Tokens</button>
        </div>
    );
}