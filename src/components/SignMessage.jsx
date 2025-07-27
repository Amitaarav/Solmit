import { ed25519 } from "@noble/curves/ed25519";
import {useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function SignMessage() {    
        const wallet = useWallet()
        async function signMessage() {
            if (!wallet.connected) {
                alert("Please connect your wallet first.");
                return;
            }
            if (!wallet.publicKey) {
                alert("Wallet public key is not available.");
                return;
            }

            const message = document.getElementById("message").value;

            if (!message) {
                alert("Please enter a message to sign.");
                return;
            }

            try {
                const encodedMessage = new TextEncoder().encode(message);
                const signature = await wallet.signMessage(encodedMessage, "utf8");
                const isValid = ed25519.verify(signature, encodedMessage, wallet.publicKey.toBytes());

                if (isValid) {
                    alert(`Message signed successfully: ${signature}`);
                } else {
                    alert("Signature verification failed.");
                }
            } catch (error) {
                console.error("Signing failed:", error);
                alert("Signing failed. Please try again.");
            }

            signMessage();
        }
        return(
        <div className="border p-4 rounded-md bg-white shadow-lg space-y-2 flex flex-col items-center"> 
            <input type="text" id="message" placeholder="Enter a message to sign" className="p-2 border rounded"/>
            <button className="bg-violet-800 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={signMessage}>Sign Message</button>
        </div>
        )
    }

