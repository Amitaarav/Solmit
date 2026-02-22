import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from 'bs58';
import { signAndVerify } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

export function SignMessage() {
    const wallet = useWallet();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: string }

    async function handleSign() {
        if (!wallet.publicKey || !wallet.signMessage) {
            alert("Please connect a wallet that supports message signing.");
            return;
        }

        if (!message) {
            alert("Please enter a message to sign.");
            return;
        }

        setLoading(true);
        setStatus(null);
        try {
            const { signature, isValid } = await signAndVerify(wallet, message);
            const signatureStr = bs58.encode(signature);

            if (isValid) {
                setStatus({
                    type: 'success',
                    msg: `Message signed & verified!\nSig: ${signatureStr.slice(0, 10)}...`
                });
            } else {
                setStatus({ type: 'error', msg: "Verification failed." });
            }
        } catch (error) {
            console.error("Signing failed:", error);
            setStatus({ type: 'error', msg: "Signing failed. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Sign Message">
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dim px-1">Message</label>
                    <Input
                        placeholder="Enter message to sign"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handleSign}
                    loading={loading}
                    className="w-full"
                >
                    Sign & Verify
                </Button>

                {status && (
                    <div className={`p-3 rounded-lg text-sm border ${status.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {status.msg}
                    </div>
                )}
            </div>
        </Card>
    );
}
