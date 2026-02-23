import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

import toast from "react-hot-toast";

export function SendTokens() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSend() {
        if (!wallet.publicKey) {
            toast.error("Please connect your wallet first.");
            return;
        }

        if (!recipient || !amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid recipient address and amount.");
            return;
        }

        const toastId = toast.loading(`Sending ${amount} SOL...`);
        setLoading(true);
        try {
            const signature = await sendSol(connection, wallet, recipient, parseFloat(amount));
            toast.success(`Sent! Signature: ${signature.slice(0, 8)}...`, { id: toastId });
            setRecipient("");
            setAmount("");
        } catch (error) {
            console.error("Transfer failed:", error);
            toast.error("Transfer failed. Please check balance and address.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Transfer Hub">
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-70 px-1">Destination Address</label>
                        <Input
                            placeholder="Recipient Public Key"
                            value={recipient}
                            className="!mb-0"
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-70 px-1">Amount (SOL)</label>
                        <Input
                            placeholder="0.1"
                            value={amount}
                            className="!mb-0"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSend}
                    loading={loading}
                    className="w-full"
                >
                    Initialize Transfer
                </Button>
            </div>
        </Card>
    );
}