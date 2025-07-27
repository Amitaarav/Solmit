import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
export function ShowBalance (){
    const { connection } = useConnection();

    const wallet = useWallet();

    async function getUserBalance(){
        const balance = await connection.getBalance(wallet.publicKey);
        document.getElementById("balance").innerHTML = `Your balance is: ${balance / LAMPORTS_PER_SOL} SOL`;
    }
    
    return(
        <div className="border p-4 rounded-md bg-white shadow-lg flex items-center justify-between">
            <span id="balance" className="text-lg font-semibold text-gray-700">Please click button to see balance</span>
            <button className="bg-violet-800 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={getUserBalance}>Balance</button>
        </div>
    )
}