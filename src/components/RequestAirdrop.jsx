import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { requestAirdrop } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

export const RequestAirDrop = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAirdrop() {
        if (!publicKey) {
            alert("Please connect your wallet first.");
            return;
        }

        const solAmount = parseFloat(amount);
        if (!solAmount || solAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            await requestAirdrop(connection, publicKey, solAmount);
            alert(`Success! Requested ${solAmount} SOL airdrop.`);
            setAmount("");
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed. Devnet faucet might be empty or ratelimited.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Request Airdrop">
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dim px-1">Amount (SOL)</label>
                    <Input
                        placeholder="0.5"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handleAirdrop}
                    loading={loading}
                    className="w-full"
                >
                    Request SOL
                </Button>
                <p className="text-xs text-text-dim text-center italic">
                    Only works on Solana Devnet
                </p>
            </div>
        </Card>
    );
};