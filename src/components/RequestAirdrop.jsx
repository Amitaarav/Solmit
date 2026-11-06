import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { requestAirdrop } from "../services/solanaService";
import { Card, Button, Input, CopyButton, Badge } from "./UI";
import { AirdropIcon, ExternalLinkIcon, CheckIcon, AlertCircleIcon } from "./Icons";
import toast from "react-hot-toast";

export const RequestAirDrop = ({ network, onSwitchToDevnet }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [lastSignature, setLastSignature] = useState(null);

  async function handleAirdrop(reqAmount) {
    if (!publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    const solAmount = parseFloat(reqAmount || amount);
    if (!solAmount || solAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (solAmount > 2) {
      toast.error("Devnet faucet typically allows a maximum of 2 SOL per request.");
      return;
    }

    const toastId = toast.loading(`Requesting ${solAmount} Devnet SOL...`);
    setLoading(true);
    setLastSignature(null);

    try {
      const sig = await requestAirdrop(connection, publicKey, solAmount);
      toast.success(`Received ${solAmount} Devnet SOL!`, { id: toastId });
      setLastSignature(sig);
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error("Airdrop rate limit reached. The public devnet faucet is often throttled. Try 0.5 SOL or try again in a minute.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // If on Mainnet, show a helpful switch prompt instead of hiding the card entirely
  if (network.cluster !== 'devnet') {
    return (
      <Card
        title="Devnet Faucet"
        description="Free test tokens for testing applications and smart contracts."
      >
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Devnet Only Feature</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              You are currently on Solana Mainnet where free faucets do not exist. Switch to Devnet to claim test SOL.
            </p>
          </div>
          {onSwitchToDevnet && (
            <Button
              onClick={onSwitchToDevnet}
              size="sm"
              variant="secondary"
              className="mt-2 text-emerald-400 border-emerald-500/20"
            >
              Switch to Devnet
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const explorerUrl = lastSignature
    ? `https://explorer.solana.com/tx/${lastSignature}?cluster=devnet`
    : null;

  return (
    <Card
      title="Devnet Faucet"
      description="Request testnet SOL to fund your wallet for deploying tokens and testing transactions."
      action={
        <Badge variant="success" className="text-[11px]">
          Devnet Active
        </Badge>
      }
    >
      <div className="space-y-5">
        {/* Preset Amount Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {["0.5", "1.0", "2.0"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  amount === preset
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                    : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                {preset} SOL
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <Input
          label="Custom Amount (SOL)"
          helper="Max 2 SOL per request"
          placeholder="1.0"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          suffix={
            <span className="text-xs font-bold text-slate-400 bg-white/[0.06] px-2.5 py-1 rounded-md">
              SOL
            </span>
          }
        />

        {/* Request Button */}
        <Button
          onClick={() => handleAirdrop(amount)}
          loading={loading}
          disabled={!publicKey || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          <AirdropIcon className="w-4 h-4 mr-1" />
          <span>Claim {amount || "0"} Devnet SOL</span>
        </Button>

        {/* Success Signature Display */}
        {lastSignature && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckIcon className="w-4 h-4" />
              <span>Airdrop Received Successfully</span>
            </div>
            <p className="font-mono text-[11px] text-slate-300 break-all bg-black/30 p-2 rounded-lg border border-white/[0.05]">
              {lastSignature}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <CopyButton text={lastSignature} label="Copy Sig" />
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
