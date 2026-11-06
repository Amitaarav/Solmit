import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { sendSol, getBalance } from "../services/solanaService";
import { Card, Button, Input, CopyButton } from "./UI";
import { SendIcon, ExternalLinkIcon, CheckIcon, AlertCircleIcon } from "./Icons";
import toast from "react-hot-toast";

export function SendTokens({ network }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState(null);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (wallet.publicKey) {
      getBalance(connection, wallet.publicKey)
        .then(bal => setBalance(bal))
        .catch(err => console.error("Balance fetch error:", err));
    }
  }, [wallet.publicKey, connection]);

  const validateAddress = (val) => {
    if (!val) {
      setAddressError("");
      return false;
    }
    try {
      new PublicKey(val.trim());
      setAddressError("");
      return true;
    } catch (e) {
      setAddressError("Invalid Solana address");
      return false;
    }
  };

  const handleRecipientChange = (e) => {
    const val = e.target.value;
    setRecipient(val);
    if (val.trim()) {
      validateAddress(val);
    } else {
      setAddressError("");
    }
  };

  const handleSetPreset = (fraction) => {
    if (balance <= 0) return;
    const estimatedFee = 0.005; // reserve for gas
    const usableBalance = Math.max(0, balance - estimatedFee);
    const calculated = (usableBalance * fraction).toFixed(4);
    setAmount(calculated);
  };

  async function handleSend() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!recipient.trim() || !validateAddress(recipient)) {
      toast.error("Please enter a valid Solana recipient address.");
      return;
    }

    const solAmount = parseFloat(amount);
    if (!solAmount || solAmount <= 0) {
      toast.error("Please enter a valid amount to send.");
      return;
    }

    if (solAmount > balance) {
      toast.error("Insufficient SOL balance for this transfer.");
      return;
    }

    const toastId = toast.loading(`Sending ${solAmount} SOL...`);
    setLoading(true);
    setTxSignature(null);

    try {
      const signature = await sendSol(connection, wallet, recipient.trim(), solAmount);
      toast.success("Transfer confirmed on-chain!", { id: toastId });
      setTxSignature(signature);
      setRecipient("");
      setAmount("");
      // Refresh balance
      getBalance(connection, wallet.publicKey).then(b => setBalance(b));
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(`Transfer failed: ${error.message || "Transaction rejected"}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const isDevnet = network?.cluster === 'devnet';
  const explorerUrl = txSignature
    ? `https://explorer.solana.com/tx/${txSignature}${isDevnet ? '?cluster=devnet' : ''}`
    : null;

  return (
    <Card
      title="Transfer SOL"
      description="Send native Solana instantly to any wallet or program address."
    >
      <div className="space-y-5">
        {/* Recipient Address */}
        <Input
          label="Recipient Address"
          placeholder="Solana Base58 Address (e.g. 7xKX...)"
          value={recipient}
          onChange={handleRecipientChange}
          error={addressError}
          autoComplete="off"
        />

        {/* Amount with Balance and Quick Chips */}
        <div className="space-y-2">
          <Input
            label="Amount"
            helper={`Available: ${balance.toFixed(4)} SOL`}
            placeholder="0.00"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            suffix={
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">
                SOL
              </span>
            }
          />

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
            {[
              { label: '25%', frac: 0.25 },
              { label: '50%', frac: 0.5 },
              { label: '75%', frac: 0.75 },
              { label: 'Max', frac: 1.0 }
            ].map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSetPreset(chip.frac)}
                disabled={!wallet.publicKey || balance <= 0}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.06] transition-all cursor-pointer disabled:opacity-40"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated network fee */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
          <span className="text-slate-400">Estimated Network Fee</span>
          <span className="font-mono text-slate-200">~0.000005 SOL</span>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSend}
          loading={loading}
          disabled={!wallet.publicKey || !amount || !recipient || !!addressError}
          className="w-full"
        >
          <SendIcon className="w-4 h-4 mr-1" />
          <span>Send Transfer</span>
        </Button>

        {/* Success Signature Display */}
        {txSignature && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckIcon className="w-4 h-4" />
              <span>Transaction Finalized</span>
            </div>
            <p className="font-mono text-[11px] text-slate-300 break-all bg-black/30 p-2 rounded-lg border border-white/[0.05]">
              {txSignature}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <CopyButton text={txSignature} label="Copy Sig" />
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
}
