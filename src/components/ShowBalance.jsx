import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getBalance } from "../services/solanaService";
import { Card, Button } from "./UI";

export function ShowBalance() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);

    async function fetchBalance() {
        if (!publicKey) return;
        setLoading(true);
        try {
            const bal = await getBalance(connection, publicKey);
            setBalance(bal);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (publicKey) {
            fetchBalance();
        } else {
            setBalance(null);
        }
    }, [publicKey, connection]);

    return (
        <Card title="Wallet Balance">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-text-dim text-sm">Current Balance</span>
                    <span className="text-3xl font-bold">
                        {balance !== null ? `${balance.toFixed(4)} SOL` : "— SOL"}
                    </span>
                </div>
                <Button
                    onClick={fetchBalance}
                    loading={loading}
                    variant="secondary"
                    className="!px-4"
                >
                    Refresh
                </Button>
            </div>
        </Card>
    );
}