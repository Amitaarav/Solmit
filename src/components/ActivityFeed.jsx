import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTransactions } from "../services/solanaService";
import { Card, CopyButton, Badge } from "./UI";
import { ActivityIcon, ExternalLinkIcon, CheckIcon, AlertCircleIcon, RefreshIcon, ClockIcon } from "./Icons";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Pending";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const ActivityFeed = ({ network }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const history = await getTransactions(connection, publicKey, 8);
      setTransactions(history || []);
    } catch (error) {
      console.error("Activity fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 25000);
      return () => clearInterval(interval);
    } else {
      setTransactions([]);
    }
  }, [publicKey, connection]);

  if (!publicKey) return null;

  const isDevnet = network?.cluster === 'devnet';

  return (
    <Card
      title="Recent Activity"
      description="Live transaction signatures from the Solana blockchain."
      action={
        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          aria-label="Refresh activity"
          title="Refresh activity"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-3">
        {loading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-emerald-400 border-t-transparent"></div>
            <p className="text-xs text-slate-400 font-medium">Scanning on-chain ledger...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-2.5">
            {transactions.map((tx) => {
              const explorerUrl = `https://explorer.solana.com/tx/${tx.signature}${isDevnet ? '?cluster=devnet' : ''}`;
              const isError = Boolean(tx.err);
              const shortSig = `${tx.signature.slice(0, 6)}...${tx.signature.slice(-6)}`;
              const exactDate = tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : null;

              return (
                <div
                  key={tx.signature}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isError ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      <span className={`text-xs font-semibold ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isError ? 'Failed' : 'Finalized'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400" title={exactDate || ""}>
                      <ClockIcon className="w-3 h-3 text-slate-500" />
                      <span>{formatRelativeTime(tx.blockTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="font-mono text-xs text-slate-300">
                      {shortSig}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <CopyButton text={tx.signature} label="" className="!py-0.5 !px-1.5" />
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View on Solana Explorer"
                        className="p-1 rounded-md text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-2.5">
              <ActivityIcon className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-white mb-0.5">No Transactions Found</p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Actions you perform like sending SOL or deploying tokens will appear here.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
