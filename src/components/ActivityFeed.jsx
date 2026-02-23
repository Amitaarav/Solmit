import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTransactions } from "../services/solanaService";
import { Card } from "./UI";

export const ActivityFeed = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        if (!publicKey) return;
        setLoading(true);
        try {
            const history = await getTransactions(connection, publicKey);
            setTransactions(history);
        } catch (error) {
            console.error("Activity fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, [publicKey]);

    if (!publicKey) return null;

    return (
        <Card title="Pulse Activity">
            <div className="space-y-4">
                {loading && transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-solana-purple border-t-transparent shadow-[0_0_15px_rgba(153,69,255,0.4)]"></div>
                        <p className="text-xs text-text-dim font-bold tracking-widest uppercase animate-pulse">Scanning Chain...</p>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.map((tx, index) => (
                            <div key={tx.signature}
                                className="group flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-solana-purple/30 transition-all cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${tx.err ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-solana-green shadow-[0_0_8px_rgba(20,241,149,0.5)]'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${tx.err ? 'text-red-400' : 'text-solana-green'}`}>
                                            {tx.err ? 'Reverted' : 'Finalized'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-text-dim/60">
                                        {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <a
                                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-mono text-text-dim group-hover:text-solana-purple transition-colors truncate flex-1"
                                    >
                                        {tx.signature}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-40">
                        <div className="text-4xl text-center">📭</div>
                        <p className="text-xs font-black uppercase tracking-widest text-center">No Activity Found</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
