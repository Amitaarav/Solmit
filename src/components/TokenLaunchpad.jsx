import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createToken } from "../services/solanaService";
import { Card, Button, Input, CopyButton, Badge } from "./UI";
import { CoinsIcon, ExternalLinkIcon, CheckIcon, SparklesIcon, InfoIcon } from "./Icons";
import toast from "react-hot-toast";

export const TokenLaunchpad = ({ network }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [supply, setSupply] = useState("1000000");
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  const fillSampleData = () => {
    setName("SolMit Community");
    setSymbol("SOLM");
    setImageUrl("https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png");
    setSupply("1000000");
  };

  async function handleCreateToken() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!name.trim() || !symbol.trim() || !imageUrl.trim() || !supply || parseFloat(supply) <= 0) {
      toast.error("Please fill in all token details with valid values.");
      return;
    }

    const toastId = toast.loading("Deploying mint account & token metadata on Solana...");
    setLoading(true);
    setCreatedResult(null);

    try {
      const result = await createToken({
        connection,
        wallet,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        imageUrl: imageUrl.trim(),
        initialSupply: parseFloat(supply)
      });

      toast.success(`Token ${symbol.toUpperCase()} deployed successfully!`, { id: toastId });
      setCreatedResult(result);
    } catch (error) {
      console.error("Token creation failed:", error);
      toast.error(`Deployment failed: ${error.message || "Transaction failed"}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const isDevnet = network?.cluster === 'devnet';
  const mintExplorerUrl = createdResult?.mintAddress
    ? `https://explorer.solana.com/address/${createdResult.mintAddress}${isDevnet ? '?cluster=devnet' : ''}`
    : null;

  return (
    <Card
      title="SPL Token Launchpad"
      description="Mint a brand new SPL token on Solana with Metaplex on-chain metadata in a single transaction."
      action={
        <Button
          onClick={fillSampleData}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <SparklesIcon className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          <span>Fill Sample</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Token Name"
              placeholder="e.g. SolMit Nexus"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Symbol"
              placeholder="e.g. MIT"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
          </div>

          <Input
            label="Logo Image URL"
            placeholder="https://example.com/logo.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            helper="Hosted PNG or SVG image link"
          />

          <Input
            label="Initial Supply"
            type="number"
            placeholder="1000000"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            suffix={
              <span className="text-xs font-semibold text-slate-400">
                {symbol || "TOKENS"}
              </span>
            }
            helper="Standard 9 decimals precision applied automatically"
          />

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
            <InfoIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Deployment allocates rent-exempt mint storage, creates your Associated Token Account (ATA), mints the initial supply, and commits Metaplex metadata on-chain.
            </span>
          </div>

          <Button
            onClick={handleCreateToken}
            loading={loading}
            disabled={!wallet.publicKey || !name || !symbol || !imageUrl || !supply}
            className="w-full mt-2"
          >
            <CoinsIcon className="w-4 h-4 mr-1.5" />
            <span>Deploy Token On-Chain</span>
          </Button>
        </div>

        {/* Live Token Preview Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
          <div className="space-y-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Live Preview
            </span>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#090b12] border border-white/[0.06]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || "Token"}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="w-12 h-12 rounded-full object-cover border border-white/[0.1] bg-white/[0.05]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {symbol ? symbol.slice(0, 2) : "✦"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">
                    {name || "Your Token Name"}
                  </h4>
                  <Badge variant="purple" className="text-[10px] py-0 px-1.5">
                    {symbol || "SYM"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Supply: {supply ? Number(supply).toLocaleString() : "0"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Decimals</span>
                <span className="font-mono text-slate-200">9</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Standard</span>
                <span className="font-mono text-slate-200">SPL Token + Metaplex V3</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Authority</span>
                <span className="font-mono text-slate-200 truncate max-w-[140px]">
                  {wallet.publicKey ? `${wallet.publicKey.toBase58().slice(0, 4)}...${wallet.publicKey.toBase58().slice(-4)}` : "Connected Wallet"}
                </span>
              </div>
            </div>
          </div>

          {/* Result or status footer */}
          {createdResult ? (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Token Deployed!</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mint Address:</span>
                <p className="font-mono text-[11px] text-slate-200 break-all bg-black/40 p-2 rounded-lg border border-white/[0.05]">
                  {createdResult.mintAddress}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <CopyButton text={createdResult.mintAddress} label="Copy Mint" />
                <a
                  href={mintExplorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <span>Explorer</span>
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
              <span className="text-[11px] text-slate-500">
                Ready to deploy on {network.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
