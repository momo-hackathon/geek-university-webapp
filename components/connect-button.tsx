'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="flex items-center gap-2"
          >
            {!account || !chain ? (
              <button
                onClick={openConnectModal}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 transition"
                type="button"
              >
                connect wallet
              </button>
            ) : (
              <>
                <button
                  onClick={openChainModal}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition"
                  type="button"
                >
                  {chain.hasIcon && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      style={{ width: 20, height: 20, borderRadius: 999 }}
                    />
                  )}
                  <span>{chain.name}</span>
                </button>
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-muted text-sm font-mono hover:bg-muted/80 transition"
                  type="button"
                >
                  <span>{account.displayName}</span>
                </button>
              </>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}