"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Globe, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount, useChainId } from 'wagmi'
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomConnectButton } from '@/components/connect-button'

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
]

export default function Header() {
  const { theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

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
    document.documentElement.lang = langCode
    localStorage.setItem("preferredLanguage", langCode)
    router.refresh()
  }

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/course" },
    { name: "About", href: "/about" },
  ]

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <span className="absolute inset-0 flex items-center justify-center font-bold text-white">W3</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {currentLanguage === "en" ? "Web3 Course" : currentLanguage === "zh" ? "Web3 课程" : "Web3 코스"}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground"
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <span className="absolute inset-0 flex items-center justify-center font-bold text-white">W3</span>
              </div>
              <span className="font-bold">
                {currentLanguage === "en" ? "Web3 Course" : currentLanguage === "zh" ? "Web3 课程" : "Web3 코스"}
              </span>
            </Link>
            <nav className="flex flex-col space-y-4 mt-4">
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
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center gap-4">
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
              <CustomConnectButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
