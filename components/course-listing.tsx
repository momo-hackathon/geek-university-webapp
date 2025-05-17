"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCourseData, type Course as FetchedCourse } from "@/hooks/useCourse"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

export default function CourseListing() {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  const { 
    courses: fetchedCourses, 
    isLoadingCourses, 
    fetchCoursesError,
    purchaseCourse,
    purchasingCourseId, // 新增：当前正在购买的课程 ID
    isConfirmingPurchase, // 新增：交易是否正在确认中
    purchaseConfirmed,
    purchaseError,
    purchaseHash,
    userPurchasedCourseIds, 
    refetchCourses, 
  } = useCourseData()

  useEffect(() => {
    setMounted(true)
    const storedLang = localStorage.getItem("preferredLanguage")
    if (storedLang) {
      setCurrentLanguage(storedLang)
    }

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

  useEffect(() => {
    if (purchaseConfirmed) {
      toast({
        title: "Purchase Successful!",
        description: `Course purchased. Transaction Hash: ${purchaseHash}`,
        variant: "default",
      })
    }
    if (purchaseError) {
      toast({
        title: "Purchase Failed",
        description: purchaseError.message || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }, [purchaseConfirmed, purchaseError, purchaseHash, toast])

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

  const getPurchaseButtonText = (course: FetchedCourse) => {
    if (userPurchasedCourseIds.has(course.id)) {
      switch (currentLanguage) {
        case "zh": return "已购买";
        case "ko": return "구매 완료";
        default: return "Purchased";
      }
    }
    if (!course.isActive) {
      switch (currentLanguage) {
        case "zh": return "不可购买";
        case "ko": return "구매 불가";
        default: return "Not Available";
      }
    }
    // 检查当前课程是否正在购买或确认中
    if (purchasingCourseId === course.web2CourseId) {
      switch (currentLanguage) {
        case "zh": return isConfirmingPurchase ? "确认中..." : "购买中...";
        case "ko": return isConfirmingPurchase ? "확인 중..." : "구매 중...";
        default: return isConfirmingPurchase ? "Confirming..." : "Purchasing...";
      }
    }
    switch (currentLanguage) {
      case "zh": return "购买课程";
      case "ko": return "코스 구매";
      default: return "Purchase Course";
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

  const handlePurchase = async (web2CourseId: string) => {
    try {
      await purchaseCourse(web2CourseId)
    } catch (error: any) {
      console.error("Purchase initiation failed:", error.message)
      if (!purchaseError) {
        toast({
          title: "Purchase Error",
          description: error.message || "Could not initiate purchase.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoadingCourses) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center">
          <p>Loading courses...</p>
        </div>
      </section>
    )
  }

  if (fetchCoursesError) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center">
          <p>Error fetching courses: {fetchCoursesError.message}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{getHeadingText()}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{getSubheadingText()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fetchedCourses.map((course: FetchedCourse) => (
            <Card
              key={course.id.toString()} // key can remain string
              className="overflow-hidden backdrop-blur-sm bg-card/80 border-muted h-full flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={`${course.imageUrl}?height=400&width=600`}
                  alt={course.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">
                    {course.name}
                  </h3>
                  <div className="text-primary font-bold text-lg whitespace-nowrap">
                    {ethers.formatUnits(course.price, 0)} Geek
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full rounded-full"
                  onClick={() => handlePurchase(course.web2CourseId)}
                  // 更新禁用条件：仅当“当前课程”正在购买，或已被购买，或不可购买时禁用
                  disabled={(purchasingCourseId === course.web2CourseId) || !course.isActive || userPurchasedCourseIds.has(course.id)}
                >
                  {getPurchaseButtonText(course)}
                </Button>
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
