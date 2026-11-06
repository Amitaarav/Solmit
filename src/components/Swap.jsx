import React, { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Card, Button, Badge } from './UI';
import { SwapIcon, AlertCircleIcon, InfoIcon, WalletIcon } from './Icons';

export const Swap = ({ network, onSwitchToMainnet }) => {
  const { publicKey, connected } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const terminalRef = useRef(null);

  useEffect(() => {
    if (window.Jupiter && connected) {
      const container = document.getElementById('integrated-terminal');
      if (container) container.innerHTML = '';

      try {
        window.Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'integrated-terminal',
          endpoint: network.endpoint,
          strictTokenList: false,
          formProps: {
            fixedOutputMint: true,
          },
        });
      } catch (err) {
        console.error("Jupiter initialization error:", err);
      }
    }
  }, [connected, network]);

  const isDevnet = network.cluster === 'devnet';

  return (
    <Card
      title="Token Swap"
      description="Instant liquidity powered by Jupiter Dex Aggregator with minimal slippage and best route discovery."
      action={
        <Badge variant={isDevnet ? "warning" : "success"} className="text-[11px]">
          {network.name} Mode
        </Badge>
      }
    >
      <div className="space-y-4">
        {isDevnet && (
          <div className="p-3.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircleIcon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Devnet Liquidity Notice</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Jupiter routes through Mainnet DEX pools. Test swap routes may have limited liquidity on Devnet.
                </p>
              </div>
            </div>
            {onSwitchToMainnet && (
              <Button
                onClick={onSwitchToMainnet}
                size="sm"
                variant="outline"
                className="flex-shrink-0 text-cyan-300 border-cyan-400/20 text-xs"
              >
                Switch to Mainnet
              </Button>
            )}
          </div>
        )}

        {!connected ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 mb-4">
              <SwapIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">Connect Wallet to Swap</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              Connect your Solana wallet to load live liquidity routes and execute instant swaps.
            </p>
            <Button
              onClick={() => openWalletModal(true)}
              size="sm"
              variant="primary"
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center min-h-[380px] p-2 bg-[#090b12] rounded-xl border border-white/[0.06]">
            <div id="integrated-terminal" className="w-full max-w-md mx-auto" />
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
          <span>Routing: Jupiter V6 API</span>
          <span>Zero SolMit Protocol Fees</span>
        </div>
      </div>
    </Card>
  );
};
