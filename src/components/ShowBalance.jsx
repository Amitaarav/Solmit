import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getBalance, getSolPrice } from "../services/solanaService";
import { Card, Button, CopyButton, Badge } from "./UI";
import { RefreshIcon, ExternalLinkIcon, WalletIcon, SendIcon, AirdropIcon, SwapIcon, CoinsIcon } from "./Icons";
import toast from "react-hot-toast";

export function ShowBalance({ network, onSelectTab }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
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
      if (solPrice) setPrice(solPrice);
    } catch (error) {
      console.error("Balance fetch error:", error);
      toast.error("Failed to refresh balance.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (publicKey) {
      fetchData();
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  const shortKey = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  const explorerUrl = publicKey
    ? `https://explorer.solana.com/address/${publicKey.toBase58()}${
        network.cluster === 'devnet' ? '?cluster=devnet' : ''
      }`
    : "#";

  if (!publicKey) {
    return (
      <Card
        title="Wallet Overview"
        description="Connect your Solana wallet to manage assets, request devnet funds, or deploy tokens."
      >
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 mb-4">
            <WalletIcon className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">No Wallet Connected</h4>
          <p className="text-xs text-slate-400 max-w-xs mb-5">
            Connect your Phantom, Solflare, or Backpack wallet to get started.
          </p>
          <Button
            onClick={() => openWalletModal(true)}
            size="sm"
            variant="primary"
          >
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  const usdValue = balance !== null && price > 0 ? (balance * price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : null;

  return (
    <Card
      title="Wallet Overview"
      action={
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          aria-label="Refresh balance"
          title="Refresh balance"
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-400">
            Available Balance
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
              {balance !== null ? balance.toFixed(4) : "—"}
            </span>
            <span className="text-base font-bold text-emerald-400">
              SOL
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs">
            {usdValue && (
              <span className="text-slate-300 font-semibold font-mono">
                ≈ ${usdValue} USD
              </span>
            )}
            {price > 0 && (
              <Badge variant="neutral" className="text-[11px] py-0.5">
                1 SOL = ${price.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>

        {/* Account Details Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              {shortKey}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CopyButton text={publicKey?.toBase58()} label="Copy" />
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
              title="View on Solana Explorer"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        {onSelectTab && (
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => onSelectTab('transfer')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:border-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                <SendIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px]">Send</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('faucet')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:border-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                <AirdropIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px]">Faucet</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('swap')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:border-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                <SwapIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px]">Swap</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('launchpad')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:border-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                <CoinsIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px]">Launch</span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
