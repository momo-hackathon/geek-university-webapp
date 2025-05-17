import { useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useMemo } from 'react'

export interface UseWalletReturn {
  // Wallet status
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  
  // Account data
  address: `0x${string}` | undefined
  displayName: string | undefined
  displayAddress: string | undefined
  ensName: string | null | undefined
  ensAvatar: string | null | undefined
  
  // Balance info
  balance: bigint | undefined
  formattedBalance: string | undefined
  
  // Actions
  openConnectModal: (() => void) | undefined
  disconnect: () => void
  
  // Raw data
  accountData: ReturnType<typeof useAccount>
}

export interface UseWalletProps {}

/**
 * A custom hook that combines RainbowKit and wagmi hooks to provide wallet functionality
 * 
 * @returns A collection of wallet states and methods
 */
export function useWallet({}: UseWalletProps): UseWalletReturn {
  // Rainbow Kit hooks
  const { openConnectModal } = useConnectModal()
  
  // Wagmi hooks
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address: account.address })
  const { data: ensAvatar } = useEnsAvatar({})
  const { data: balanceData } = useBalance({
    address: account.address
  })
  
  // Create shortened displayAddress (0x1234...5678)
  const displayAddress = useMemo(() => {
    if (!account.address) return undefined
    return `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
  }, [account.address])
  
  // Display name prioritizes ENS name if available, otherwise shows shortened address
  const displayName = useMemo(() => {
    return ensName || displayAddress
  }, [ensName, displayAddress])
  
  // Format balance with 4 decimal places max
  const formattedBalance = useMemo(() => {
    if (!balanceData) return undefined
    
    const formatted = parseFloat(balanceData.formatted)
    if (formatted === 0) return '0 ' + balanceData.symbol
    
    // Display up to 4 decimal places, trimming trailing zeros
    const formattedWithPrecision = formatted.toLocaleString(undefined, {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    })
    
    return `${formattedWithPrecision} ${balanceData.symbol}`
  }, [balanceData])
  
  return {
    // Wallet status
    isConnected: account.isConnected,
    isConnecting: account.isConnecting,
    isDisconnected: account.isDisconnected,
    
    // Account data
    address: account.address,
    displayName,
    displayAddress,
    ensName,
    ensAvatar,
    
    // Balance info
    balance: balanceData?.value,
    formattedBalance,
    
    // Actions
    openConnectModal,
    disconnect,
    
    // Raw data
    accountData: account
  }
}