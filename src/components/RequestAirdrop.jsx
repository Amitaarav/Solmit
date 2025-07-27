import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
export const RequestAirDrop = () => {

    const  wallet  = useWallet();
    const { connection }= useConnection();
    function requestAirdrop() {
        
        if (!wallet.connected) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!wallet.publicKey) {
            alert("Wallet public key is not available.");
            return;
        }

        const publicKey = wallet.publicKey;
        const amount = document.getElementById("amount").value;
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        connection.requestAirdrop( publicKey, amount * LAMPORTS_PER_SOL);

    }

    return(
        <div className="border p-4 rounded-md bg-white shadow-lg space-y-2 flex flex-col items-center">
            <p className="text-xl font-semibold">
                Hii Mr.
            </p>
            <p className="text-lg text-gray-600 p-2">
                Your wallet address is: {wallet.publicKey ? wallet.publicKey.toBase58() : "Not connected"}
            </p>
            <label className="font-semibold" htmlFor="">Amount</label>
            <input className="border rounded text-center " id="amount" type="text" placeholder="Enter Amount" />
            <button className="bg-violet-800 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={requestAirdrop} >Request AirDrop</button>
        </div>
    )
}