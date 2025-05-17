"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample course data
const courses = [
  {
    id: 1,
    name: {
      en: "Blockchain Fundamentals",
      zh: "区块链基础",
      ko: "블록체인 기초",
    },
    description: {
      en: "Learn the core concepts of blockchain technology and how it works.",
      zh: "学习区块链技术的核心概念及其工作原理。",
      ko: "블록체인 기술의 핵심 개념과 작동 방식을 배웁니다.",
    },
    price: 199,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Beginner",
      zh: "初级",
      ko: "초급",
    },
    duration: {
      en: "4 weeks",
      zh: "4 周",
      ko: "4 주",
    },
  },
  {
    id: 2,
    name: {
      en: "Smart Contract Development",
      zh: "智能合约开发",
      ko: "스마트 계약 개발",
    },
    description: {
      en: "Master Solidity and build secure smart contracts for Ethereum.",
      zh: "掌握 Solidity 并为以太坊构建安全的智能合约。",
      ko: "Solidity를 마스터하고 이더리움을 위한 안전한 스마트 계약을 구축합니다.",
    },
    price: 299,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Intermediate",
      zh: "中级",
      ko: "중급",
    },
    duration: {
      en: "6 weeks",
      zh: "6 周",
      ko: "6 주",
    },
  },
  {
    id: 3,
    name: {
      en: "DApp Development",
      zh: "去中心化应用开发",
      ko: "DApp 개발",
    },
    description: {
      en: "Create full-stack decentralized applications with React and Web3.js.",
      zh: "使用 React 和 Web3.js 创建全栈去中心化应用。",
      ko: "React와 Web3.js로 풀스택 분산 애플리케이션을 만듭니다.",
    },
    price: 349,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Advanced",
      zh: "高级",
      ko: "고급",
    },
    duration: {
      en: "8 weeks",
      zh: "8 周",
      ko: "8 주",
    },
  },
  {
    id: 4,
    name: {
      en: "NFT Marketplace Creation",
      zh: "NFT 市场创建",
      ko: "NFT 마켓플레이스 제작",
    },
    description: {
      en: "Build your own NFT marketplace from scratch with ERC-721 and ERC-1155.",
      zh: "使用 ERC-721 和 ERC-1155 从头开始构建您自己的 NFT 市场。",
      ko: "ERC-721 및 ERC-1155로 처음부터 자신만의 NFT 마켓플레이스를 구축합니다.",
    },
    price: 399,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Advanced",
      zh: "高级",
      ko: "고급",
    },
    duration: {
      en: "10 weeks",
      zh: "10 周",
      ko: "10 주",
    },
  },
]

export default function CourseListing() {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)

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
        return "精选课程"
      case "ko":
        return "추천 코스"
      default:
        return "Featured Courses"
    }
  }

  const getSubheadingText = () => {
    switch (currentLanguage) {
      case "zh":
        return "探索我们全面的 Web3 课程，旨在带您从区块链基础知识到高级去中心化应用程序开发。"
      case "ko":
        return "블록체인 기초부터 고급 분산 애플리케이션 개발까지 배울 수 있는 종합적인 Web3 코스를 탐색하세요."
      default:
        return "Explore our comprehensive Web3 courses designed to take you from blockchain basics to advanced decentralized application development."
    }
  }

  const getViewMoreText = () => {
    switch (currentLanguage) {
      case "zh":
        return "查看更多"
      case "ko":
        return "더 보기"
      default:
        return "View More"
    }
  }

  const getViewAllCoursesText = () => {
    switch (currentLanguage) {
      case "zh":
        return "查看所有课程"
      case "ko":
        return "모든 코스 보기"
      default:
        return "View All Courses"
    }
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{getHeadingText()}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{getSubheadingText()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden backdrop-blur-sm bg-card/80 border-muted h-full flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.name[currentLanguage as keyof typeof course.name] || course.name.en}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {course.level[currentLanguage as keyof typeof course.level] || course.level.en}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">
                    {course.name[currentLanguage as keyof typeof course.name] || course.name.en}
                  </h3>
                  <div className="text-primary font-bold">${course.price}</div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground">
                  {course.description[currentLanguage as keyof typeof course.description] || course.description.en}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {currentLanguage === "en" ? "Duration: " : currentLanguage === "zh" ? "持续时间: " : "기간: "}
                  {course.duration[currentLanguage as keyof typeof course.duration] || course.duration.en}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href="/course" className="w-full">
                  <Button variant="outline" className="w-full rounded-full">
                    {getViewMoreText()}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/course">
            <Button className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              {getViewAllCoursesText()}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
