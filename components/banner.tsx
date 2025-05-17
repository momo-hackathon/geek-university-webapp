"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Banner() {
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    setMounted(true)
    // Check if there's a stored language preference
    const storedLang = localStorage.getItem("preferredLanguage")
    if (storedLang) {
      setCurrentLanguage(storedLang)
    }

    // Set up a listener for language changes
    const handleStorageChange = () => {
      const lang = localStorage.getItem("preferredLanguage")
      if (lang) {
        setCurrentLanguage(lang)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  if (!mounted) return null

  const getHeadingText = () => {
    switch (currentLanguage) {
      case "zh":
        return "掌握 Web3 开发"
      case "ko":
        return "Web3 개발 마스터"
      default:
        return "Master Web3 Development"
    }
  }

  const getSubheadingText = () => {
    switch (currentLanguage) {
      case "zh":
        return "向行业专家学习区块链技术、智能合约和去中心化应用。今天就开始您的互联网未来之旅。"
      case "ko":
        return "업계 전문가로부터 블록체인 기술, 스마트 계약 및 분산 애플리케이션을 배우세요. 오늘 인터넷의 미래로의 여정을 시작하세요."
      default:
        return "Learn blockchain technology, smart contracts, and decentralized applications from industry experts. Start your journey into the future of the internet today."
    }
  }

  const getButtonText = (button: string) => {
    if (button === "explore") {
      switch (currentLanguage) {
        case "zh":
          return "探索课程"
        case "ko":
          return "코스 탐색"
        default:
          return "Explore Courses"
      }
    } else {
      switch (currentLanguage) {
        case "zh":
          return "加入社区"
        case "ko":
          return "커뮤니티 가입"
        default:
          return "Join Community"
      }
    }
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-background" />

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-blue-500/10"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              {getHeadingText()}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">{getSubheadingText()}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {getButtonText("explore")}
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                {getButtonText("join")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
