import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getBalance, getSolPrice } from "../services/solanaService";
import { Card, Button } from "./UI";
import toast from "react-hot-toast";
export function ShowBalance() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        if (!publicKey) return;
        setLoading(true);
        try {
            const [bal, solPrice] = await Promise.all([
                getBalance(connection, publicKey),
                getSolPrice()
            ]);
            setBalance(bal);
            setPrice(solPrice);
        } catch (error) {
            toast.error("Failed to fetch wallet data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (publicKey) {
            fetchData();
        } else {
            setBalance(null);
            setPrice(0);
        }
    }, [publicKey, connection]);

    return (
        <Card title="Nexus Balance">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-text-dim text-xs font-black uppercase tracking-[0.2em] opacity-60">Available Balance</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tight">
                                {balance !== null ? balance.toFixed(4) : "—"}
                            </span>
                            <span className="text-xl font-black text-gradient">SOL</span>
                        </div>
                        {balance !== null && price > 0 && (
                            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-solana-green/10 border border-solana-green/20 w-fit">
                                <span className="text-sm text-solana-green font-bold">
                                    ≈ ${(balance * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] text-solana-green font-black uppercase opacity-60">USD</span>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={fetchData}
                        loading={loading}
                        variant="secondary"
                        className="!w-12 !h-12 !rounded-2xl !p-0 group active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </Button>
                </div>
            </div>
        </Card>
    );
}