"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToken, tokens } from "@/hooks/useWrapToken"
import { formatUnits } from "ethers"

export default function TokenExchange() {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    isLoading,
    error,
    exchangeRate,
    setFromToken,
    setToToken,
    handleFromAmountChange,
    handleToAmountChange,
    swapTokens,
    handleExchange
  } = useToken()

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
                    disabled={isLoading}
                    placeholder="0.0"
                    min="0"
                    step="any"
                  />
                  <Select 
                    value={fromToken.symbol} 
                    onValueChange={(value) => {
                      const token = tokens.find(t => t.symbol === value)
                      if (token) {
                        setFromToken(token)
                      }
                    }}
                    disabled={isLoading}
                  >
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={swapTokens} 
                  className="rounded-full h-10 w-10 bg-muted/50 hover:bg-muted" 
                  disabled={isLoading}
                >
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
                    disabled={isLoading}
                    placeholder="0.0"
                    min="0"
                    step="any"
                  />
                  <Select 
                    value={toToken.symbol} 
                    onValueChange={(value) => {
                      const token = tokens.find(t => t.symbol === value)
                      if (token) {
                        setToToken(token)
                      }
                    }}
                    disabled={isLoading}
                  >
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

              {exchangeRate && (
                <div className="text-sm text-muted-foreground text-center">
                  Exchange Rate: 1 {fromToken.symbol} = {formatUnits(exchangeRate.toString(), 18)} {toToken.symbol}
                </div>
              )}

              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mb-4 mt-4 h-14 text-lg"
                onClick={handleExchange}
                disabled={isLoading || !fromAmount || !toAmount || !!error}
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
