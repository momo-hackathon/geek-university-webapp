"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Moon, Sun, Globe, Menu, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply theme class to body for additional styling
  useEffect(() => {
    if (mounted) {
      document.body.classList.remove("theme-light", "theme-dark")
      document.body.classList.add(`theme-${theme}`)
    }
  }, [theme, mounted])

  // Handle language change
  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode)
    // In a real app, you would update the app's language context
    // For this demo, we'll just update the UI to show the change
    document.documentElement.lang = langCode

    // You could also store the preference in localStorage
    localStorage.setItem("preferredLanguage", langCode)

    // Force a re-render of the page to show the language change
    router.refresh()
  }

  const connectWallet = async () => {

  }

  const disconnectWallet = () => {
    setIsWalletConnected(false)
    setWalletAddress("")
  }

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/course" },
    { name: "About", href: "/about" },
  ]

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white">W3</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {currentLanguage === "en" ? "Web3 Course" : currentLanguage === "zh" ? "Web3 课程" : "Web3 코스"}
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {currentLanguage === "en"
                  ? item.name
                  : currentLanguage === "zh"
                    ? item.name === "Home"
                      ? "首页"
                      : item.name === "Courses"
                        ? "课程"
                            : "关于"
                    : item.name === "Home"
                      ? "홈"
                      : item.name === "Courses"
                        ? "코스"
                            : "소개"}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={currentLanguage === lang.code ? "bg-muted" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {currentLanguage === "en" ? "Light" : currentLanguage === "zh" ? "浅色" : "라이트"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {currentLanguage === "en" ? "Dark" : currentLanguage === "zh" ? "深色" : "다크"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet Connection */}
          {isWalletConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={disconnectWallet}>
                  {currentLanguage === "en" ? "Disconnect" : currentLanguage === "zh" ? "断开连接" : "연결 해제"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={connectWallet} className="rounded-full">
              <Wallet className="mr-2 h-4 w-4" />
              {currentLanguage === "en" ? "Connect Wallet" : currentLanguage === "zh" ? "连接钱包" : "지갑 연결"}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-white">W3</span>
                  </div>
                  <span className="font-bold">
                    {currentLanguage === "en" ? "Web3 Course" : currentLanguage === "zh" ? "Web3 课程" : "Web3 코스"}
                  </span>
                </Link>
                <nav className="grid gap-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {currentLanguage === "en"
                        ? item.name
                        : currentLanguage === "zh"
                          ? item.name === "Home"
                            ? "首页"
                            : item.name === "Courses"
                              ? "课程"
                              : item.name === "Resources"
                                ? "资源"
                                : item.name === "Community"
                                  ? "社区"
                                  : "关于"
                          : item.name === "Home"
                            ? "홈"
                            : item.name === "Courses"
                              ? "코스"
                              : item.name === "Resources"
                                ? "리소스"
                                : item.name === "Community"
                                  ? "커뮤니티"
                                  : "소개"}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
