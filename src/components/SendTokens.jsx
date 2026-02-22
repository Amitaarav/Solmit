import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "../services/solanaService";
import { Card, Button, Input } from "./UI";

export function SendTokens() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSend() {
        if (!wallet.publicKey) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!recipient || !amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }

        setLoading(true);
        try {
            const signature = await sendSol(connection, wallet, recipient, parseFloat(amount));
            alert(`Successfully sent ${amount} SOL! \nSignature: ${signature}`);
            setRecipient("");
            setAmount("");
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transfer failed. Please check the address and your balance.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card title="Send SOL">
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dim px-1">Recipient Address</label>
                    <Input
                        placeholder="Recipient Public Key"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-dim px-1">Amount (SOL)</label>
                    <Input
                        placeholder="0.1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <Button
                    onClick={handleSend}
                    loading={loading}
                    className="w-full"
                >
                    Send Tokens
                </Button>
            </div>
        </Card>
    );
}