import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { requestAirdrop } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

import toast from "react-hot-toast";

export const RequestAirDrop = ({ network }) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAirdrop() {
        if (!publicKey) {
            toast.error("Please connect your wallet first.");
            return;
        }

        const solAmount = parseFloat(amount);
        if (!solAmount || solAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const toastId = toast.loading(`Requesting ${solAmount} SOL airdrop...`);
        setLoading(true);
        try {
            await requestAirdrop(connection, publicKey, solAmount);
            toast.success(`Success! Received ${solAmount} SOL.`, { id: toastId });
            setAmount("");
        } catch (error) {
            console.error("Airdrop failed:", error);
            toast.error("Airdrop failed. Devnet faucet might be empty or ratelimited.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }

    if (network.cluster !== 'devnet') return null;

    return (
        <Card title="Devnet Faucet">
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-70 px-1">Amount (SOL)</label>
                    <Input
                        placeholder="0.5"
                        value={amount}
                        className="!mb-0"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handleAirdrop}
                    loading={loading}
                    className="w-full"
                >
                    Request Drop
                </Button>
                <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-xl bg-solana-blue/5 border border-solana-blue/10">
                    <span className="text-[10px] text-solana-blue font-bold uppercase tracking-widest leading-none">Devnet Only</span>
                </div>
            </div>
        </Card>
    );
};