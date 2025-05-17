"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const tokens = [
  { symbol: "ETH", name: "Ethereum", rate: 1 },
  { symbol: "COURSE", name: "Course Token", rate: 2000 },
  { symbol: "BTC", name: "Bitcoin", rate: 0.06 },
  { symbol: "USDT", name: "Tether", rate: 3500 },
]

export default function TokenExchange() {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("COURSE")
  const [fromAmount, setFromAmount] = useState("1")
  const [toAmount, setToAmount] = useState("2000")
  const [isLoading, setIsLoading] = useState(false)

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    const fromRate = tokens.find((t) => t.symbol === fromToken)?.rate || 1
    const toRate = tokens.find((t) => t.symbol === toToken)?.rate || 1
    const calculatedAmount = (Number.parseFloat(value) || 0) * (toRate / fromRate)
    setToAmount(calculatedAmount.toString())
  }

  const handleToAmountChange = (value: string) => {
    setToAmount(value)
    const fromRate = tokens.find((t) => t.symbol === fromToken)?.rate || 1
    const toRate = tokens.find((t) => t.symbol === toToken)?.rate || 1
    const calculatedAmount = (Number.parseFloat(value) || 0) * (fromRate / toRate)
    setFromAmount(calculatedAmount.toString())
  }

  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleExchange = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Reset or show success
    }, 2000)
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-md">
          <h2 className="text-center text-3xl font-bold tracking-tight mb-8 mt-4">Exchange Tokens</h2>

          <Card className="backdrop-blur-sm bg-card/80 border-muted">
            <CardHeader className="mt-4">
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>Exchange your tokens at the best rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="from-amount">From</Label>
                <div className="flex gap-2">
                  <Input
                    id="from-amount"
                    type="number"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" size="icon" onClick={swapTokens} className="rounded-full h-10 w-10 bg-muted/50">
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-amount">To</Label>
                <div className="flex gap-2">
                  <Input
                    id="to-amount"
                    type="number"
                    value={toAmount}
                    onChange={(e) => handleToAmountChange(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mb-4 mt-4 h-14 text-lg"
                onClick={handleExchange}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap Tokens"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
