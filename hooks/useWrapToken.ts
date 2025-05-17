import { useState, useEffect } from "react"
import { ethers } from "ethers"
import geekTokenAbi from "@/abis/geekToken.json"
import { toast } from "sonner"

// Contract addresses
const GEEK_TOKEN_ADDRESS: string = '0x0ec34267121eaBeec3E30A6cAcFba3Ea782807B1';

export interface Token {
  symbol: string
  name: string
  rate: number
  address?: string
  decimals?: number
}

export const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", rate: 1, decimals: 18 },
  { symbol: "GEEK", name: "Geek Token", rate: 1000, address: GEEK_TOKEN_ADDRESS, decimals: 0 },
]

export function useToken() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number>(1000)
  const [error, setError] = useState<string | null>(null)

  // Fetch exchange rate from smart contract
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum)
          
          // Check if we're connected to the right network
          const network = await provider.getNetwork()
          if (network.chainId !== BigInt(11155111)) { // Sepolia testnet
            setError("Please connect to Sepolia testnet")
            return
          }

          const geekTokenContract = new ethers.Contract(
            GEEK_TOKEN_ADDRESS,
            geekTokenAbi.abi,
            provider
          )

          try {
            // Get exchange rate from token contract
            const tokensPerEth = await geekTokenContract.TOKENS_PER_ETH()
            const rate = Number(tokensPerEth) // GEEK token has 0 decimals
            setExchangeRate(rate)

            // Update token rates
            const geekToken = tokens.find(t => t.symbol === "GEEK")
            if (geekToken) {
              geekToken.rate = rate
            }
          } catch (contractError) {
            console.error("Contract interaction error:", contractError)
            setError("Failed to fetch exchange rate from contract")
          }
        } else {
          setError("Please install MetaMask")
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error)
        setError("Failed to connect to blockchain")
      }
    }

    fetchExchangeRate()
  }, [fromToken, toToken])

  // Handle amount changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (!value) {
      setToAmount("")
      return
    }
    const fromRate = fromToken.rate
    const toRate = toToken.rate
    const calculatedAmount = (Number.parseFloat(value) || 0) * (toRate / fromRate)
    setToAmount(calculatedAmount.toString())
  }

  const handleToAmountChange = (value: string) => {
    setToAmount(value)
    if (!value) {
      setFromAmount("")
      return
    }
    const fromRate = fromToken.rate
    const toRate = toToken.rate
    const calculatedAmount = (Number.parseFloat(value) || 0) * (fromRate / toRate)
    setFromAmount(calculatedAmount.toString())
  }

  // Swap tokens
  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Handle exchange
  const handleExchange = async () => {
    if (!fromAmount || !toAmount) {
      setError("Please enter amounts")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        // Check if wallet is connected
        const accounts = await provider.listAccounts()
        if (accounts.length === 0) {
          setError("Please connect your wallet first")
          return
        }

        // Check if we're connected to the right network
        const network = await provider.getNetwork()
        if (network.chainId !== BigInt(11155111)) {
          setError("Please connect to Sepolia testnet")
          return
        }

        const signer = await provider.getSigner()
        const geekTokenContract = new ethers.Contract(
          GEEK_TOKEN_ADDRESS,
          geekTokenAbi.abi,
          signer
        )
        
        if (fromToken.symbol === "ETH" && toToken.symbol === "GEEK") {
          // ETH to GEEK
          const ethAmount = ethers.parseEther(fromAmount)
          console.log("Sending transaction to buy GEEK tokens with ETH:", {
            contractAddress: GEEK_TOKEN_ADDRESS,
            ethAmount: ethAmount.toString(),
            fromAmount,
            toAmount
          })
          
          const tx = await geekTokenContract.buyWithETH({ value: ethAmount })
          console.log("Transaction sent:", tx.hash)
          await tx.wait()
          
          // Update amounts after successful swap
          setFromAmount("")
          setToAmount("")
          toast.success("Successfully swapped ETH for GEEK tokens!")
        } else if (fromToken.symbol === "GEEK" && toToken.symbol === "ETH") {
          // GEEK to ETH
          const geekAmount = ethers.parseUnits(fromAmount, 0) // GEEK token has 0 decimals
          
          // The approve call was removed here as it's unnecessary for the current sellTokens contract logic
          // which uses _burn(msg.sender, ...)
          console.log("Selling GEEK tokens for ETH:", {
            contractAddress: GEEK_TOKEN_ADDRESS,
            geekAmount: geekAmount.toString(),
            fromAmount,
            toAmount
          });
          
          const tx = await geekTokenContract.sellTokens(geekAmount)
          console.log("Sell transaction sent:", tx.hash)
          await tx.wait()
          
          // Update amounts after successful swap
          setFromAmount("")
          setToAmount("")
          toast.success("Successfully swapped GEEK tokens for ETH!")
        } else {
          setError("Invalid token pair for swapping")
        }
      } else {
        setError("Please install MetaMask")
      }
    } catch (error: any) {
      console.error("Error during exchange:", error)
      setError(error.message || "Failed to complete exchange")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    isLoading,
    exchangeRate,
    error,
    setFromToken,
    setToToken,
    handleFromAmountChange,
    handleToAmountChange,
    swapTokens,
    handleExchange,
    tokens
  }
}