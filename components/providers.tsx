'use client'

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createConfig } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = 'dd79eb677ee0795d9bc661e29daa45b8'

const { wallets } = getDefaultWallets({
  appName: 'Geek University WebApp',
  projectId,
})

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 