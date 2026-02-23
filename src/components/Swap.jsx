import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from './UI';

export const Swap = ({ network }) => {
    const { publicKey, connected } = useWallet();
    const containerRef = useRef(null);

    useEffect(() => {
        if (window.Jupiter && connected) {
            // Clear existing terminal if any
            const terminal = document.getElementById('integrated-terminal');
            if (terminal) terminal.innerHTML = '';

            window.Jupiter.init({
                displayMode: 'integrated',
                integratedTargetId: 'integrated-terminal',
                endpoint: network.endpoint,
                strictTokenList: false,
                formProps: {
                    fixedOutputMint: true,
                },
            });
        }
    }, [connected, network]);

    return (
        <Card title="Swap Tokens" className="h-full">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                {!connected ? (
                    <div className="text-center space-y-4">
                        <div className="text-4xl">🔌</div>
                        <p className="text-text-dim">Connect your wallet to start swapping</p>
                    </div>
                ) : (
                    <div className="w-full space-y-4">
                        {network.cluster === 'devnet' && (
                            <div className="p-3 bg-solana-purple/10 border border-solana-purple/20 rounded-xl text-[10px] text-solana-purple font-bold text-center uppercase tracking-widest">
                                ⚠️ Devnet liquidity is limited
                            </div>
                        )}
                        <div id="integrated-terminal" className="w-full max-w-md bg-transparent mx-auto"></div>
                    </div>
                )}
            </div>
            <p className="text-[10px] text-text-dim text-center mt-4">
                Powered by Jupiter Aggregator ({network.name} Mode)
            </p>
        </Card>
    );
};
