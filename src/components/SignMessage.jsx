import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from 'bs58';
import { signAndVerify } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

import toast from "react-hot-toast";

export function SignMessage() {
    const wallet = useWallet();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: string }

    async function handleSign() {
        if (!wallet.publicKey || !wallet.signMessage) {
            toast.error("Please connect a wallet that supports message signing.");
            return;
        }

        if (!message) {
            toast.error("Please enter a message to sign.");
            return;
        }

        const toastId = toast.loading("Signing message...");
        setLoading(true);
        setStatus(null);
        try {
            const { signature, isValid } = await signAndVerify(wallet, message);
            const signatureStr = bs58.encode(signature);

            if (isValid) {
                toast.success("Message signed & verified!", { id: toastId });
                setStatus({
                    type: 'success',
                    msg: `Message signed & verified!\nSig: ${signatureStr.slice(0, 10)}...`
                });
            } else {
                toast.error("Verification failed.", { id: toastId });
                setStatus({ type: 'error', msg: "Verification failed." });
            }
        } catch (error) {
            console.error("Signing failed:", error);
            toast.error("Signing failed. Please try again.", { id: toastId });
            setStatus({ type: 'error', msg: "Signing failed. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Security Signer">
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-70 px-1">Message to Sign</label>
                    <Input
                        placeholder="e.g. Authenticate my session"
                        value={message}
                        className="!mb-0"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handleSign}
                    loading={loading}
                    className="w-full"
                >
                    Sign & Validate
                </Button>

                {status && (
                    <div className={`p-4 rounded-2xl text-xs font-medium border animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success'
                            ? 'bg-solana-green/10 border-solana-green/20 text-solana-green'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${status.type === 'success' ? 'bg-solana-green' : 'bg-red-500'}`} />
                            <span className="font-black uppercase tracking-widest">{status.type === 'success' ? 'Verified' : 'Failed'}</span>
                        </div>
                        <p className="opacity-80 leading-relaxed font-mono break-all">{status.msg}</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
