import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from 'bs58';
import { signAndVerify } from "../services/solanaService";
import { Card, Button, Input, CopyButton, Badge } from "./UI";
import { ShieldIcon, CheckIcon, AlertCircleIcon, InfoIcon } from "./Icons";
import toast from "react-hot-toast";

export function SignMessage() {
  const wallet = useWallet();
  const [message, setMessage] = useState("Sign-in to SolMit Nexus at " + new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    "Sign-in to SolMit Nexus",
    "Authorize account access for session #9281",
    "I verify that I own this Solana wallet"
  ];

  async function handleSign() {
    if (!wallet.publicKey || !wallet.signMessage) {
      toast.error("Please connect a wallet that supports message signing.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message to sign.");
      return;
    }

    const toastId = toast.loading("Requesting cryptographic signature from wallet...");
    setLoading(true);
    setResult(null);

    try {
      const { signature, isValid } = await signAndVerify(wallet, message.trim());
      const signatureStr = bs58.encode(signature);

      if (isValid) {
        toast.success("Signature cryptographically verified with ed25519!", { id: toastId });
        setResult({
          isValid: true,
          signature: signatureStr,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        toast.error("Signature verification failed.", { id: toastId });
        setResult({
          isValid: false,
          signature: null,
          error: "Verification failed against public key."
        });
      }
    } catch (error) {
      console.error("Signing failed:", error);
      toast.error(`Signing failed: ${error.message || "User rejected"}`, { id: toastId });
      setResult({
        isValid: false,
        signature: null,
        error: error.message || "Signing was cancelled or rejected"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      title="Message Signer & Verifier"
      description="Cryptographically sign arbitrary payloads with your wallet private key and verify them against Ed25519 curve."
      action={
        <Badge variant="info" className="text-[11px]">
          Gasless (0 SOL)
        </Badge>
      }
    >
      <div className="space-y-5">
        {/* Preset message chips */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">
            Quick Templates
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(p)}
                className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-slate-300 transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Payload Text
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-[#11131f]/90 text-white placeholder-slate-500 text-sm rounded-xl p-3 border border-white/[0.08] hover:border-white/[0.14] focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Info card */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
          <InfoIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            Signing messages is purely off-chain and free. It never broadcasts a transaction or moves your tokens.
          </span>
        </div>

        {/* Submit */}
        <Button
          onClick={handleSign}
          loading={loading}
          disabled={!wallet.publicKey || !message.trim()}
          className="w-full"
        >
          <ShieldIcon className="w-4 h-4 mr-1.5" />
          <span>Sign & Verify Message</span>
        </Button>

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
            result.isValid
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              : 'bg-red-500/10 border-red-500/20 text-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.isValid ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300">Valid Ed25519 Signature</span>
                  </>
                ) : (
                  <>
                    <AlertCircleIcon className="w-4 h-4 text-red-400" />
                    <span className="font-bold text-red-300">Verification Failed</span>
                  </>
                )}
              </div>
              {result.timestamp && (
                <span className="text-[11px] text-slate-400">{result.timestamp}</span>
              )}
            </div>

            {result.signature && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Signature (Base58):</span>
                <p className="font-mono text-[11px] text-slate-200 break-all bg-black/40 p-2.5 rounded-lg border border-white/[0.05]">
                  {result.signature}
                </p>
                <div className="pt-1">
                  <CopyButton text={result.signature} label="Copy Signature" />
                </div>
              </div>
            )}

            {result.error && (
              <p className="text-red-300 text-xs">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
