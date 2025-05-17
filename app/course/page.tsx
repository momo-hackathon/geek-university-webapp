"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Filter, Search, Heart, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

// Extended course data for the course page
const allCourses = [
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
    students: 1245,
    rating: 4.8,
    type: "blockchain",
    likes: 342,
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
    students: 876,
    rating: 4.7,
    type: "development",
    likes: 256,
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
    students: 654,
    rating: 4.9,
    type: "development",
    likes: 189,
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
    students: 432,
    rating: 4.6,
    type: "nft",
    likes: 278,
  },
  {
    id: 5,
    name: {
      en: "DeFi Protocol Development",
      zh: "DeFi 协议开发",
      ko: "DeFi 프로토콜 개발",
    },
    description: {
      en: "Learn to build decentralized finance protocols and applications.",
      zh: "学习构建去中心化金融协议和应用程序。",
      ko: "분산 금융 프로토콜 및 애플리케이션을 구축하는 방법을 배웁니다.",
    },
    price: 449,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Advanced",
      zh: "高级",
      ko: "고급",
    },
    duration: {
      en: "12 weeks",
      zh: "12 周",
      ko: "12 주",
    },
    students: 321,
    rating: 4.8,
    type: "defi",
    likes: 156,
  },
  {
    id: 6,
    name: {
      en: "Web3 Security & Auditing",
      zh: "Web3 安全与审计",
      ko: "Web3 보안 및 감사",
    },
    description: {
      en: "Master the techniques to secure and audit smart contracts and DApps.",
      zh: "掌握保护和审计智能合约和 DApps 的技术。",
      ko: "스마트 계약 및 DApp을 보호하고 감사하는 기술을 마스터합니다.",
    },
    price: 399,
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
    students: 287,
    rating: 4.9,
    type: "security",
    likes: 201,
  },
  {
    id: 7,
    name: {
      en: "Blockchain for Business",
      zh: "商业区块链",
      ko: "비즈니스를 위한 블록체인",
    },
    description: {
      en: "Understand how blockchain can transform business operations and models.",
      zh: "了解区块链如何改变商业运营和模式。",
      ko: "블록체인이 비즈니스 운영 및 모델을 어떻게 변화시킬 수 있는지 이해합니다.",
    },
    price: 249,
    image: "/placeholder.svg?height=400&width=600",
    level: {
      en: "Intermediate",
      zh: "中级",
      ko: "중급",
    },
    duration: {
      en: "5 weeks",
      zh: "5 周",
      ko: "5 주",
    },
    students: 543,
    rating: 4.5,
    type: "business",
    likes: 132,
  },
  {
    id: 8,
    name: {
      en: "Crypto Trading Fundamentals",
      zh: "加密货币交易基础",
      ko: "암호화폐 거래 기초",
    },
    description: {
      en: "Learn the basics of cryptocurrency trading and investment strategies.",
      zh: "学习加密货币交易和投资策略的基础知识。",
      ko: "암호화폐 거래 및 투자 전략의 기본 사항을 배웁니다.",
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
    students: 876,
    rating: 4.4,
    type: "trading",
    likes: 245,
  },
]

// Course types for filtering
const courseTypes = [
  { value: "all", label: { en: "All Types", zh: "所有类型", ko: "모든 유형" } },
  { value: "blockchain", label: { en: "Blockchain", zh: "区块链", ko: "블록체인" } },
  { value: "development", label: { en: "Development", zh: "开发", ko: "개발" } },
  { value: "nft", label: { en: "NFT", zh: "NFT", ko: "NFT" } },
  { value: "defi", label: { en: "DeFi", zh: "DeFi", ko: "DeFi" } },
  { value: "security", label: { en: "Security", zh: "安全", ko: "보안" } },
  { value: "business", label: { en: "Business", zh: "商业", ko: "비즈니스" } },
  { value: "trading", label: { en: "Trading", zh: "交易", ko: "거래" } },
]

// Course levels for filtering
const courseLevels = [
  { value: "all", label: { en: "All Levels", zh: "所有级别", ko: "모든 레벨" } },
  { value: "Beginner", label: { en: "Beginner", zh: "初级", ko: "초급" } },
  { value: "Intermediate", label: { en: "Intermediate", zh: "中级", ko: "중급" } },
  { value: "Advanced", label: { en: "Advanced", zh: "高级", ko: "고급" } },
]

export default function CoursePage() {
  const { toast } = useToast()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortOption, setSortOption] = useState("newest")
  const [likedCourses, setLikedCourses] = useState<number[]>([])
  const [cartItems, setCartItems] = useState<number[]>([])
  const [filteredCourses, setFilteredCourses] = useState(allCourses)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if there's a stored language preference
    const storedLang = localStorage.getItem("preferredLanguage")
    if (storedLang) {
      setCurrentLanguage(storedLang)
    }

    // Load liked courses from localStorage
    const storedLikes = localStorage.getItem("likedCourses")
    if (storedLikes) {
      setLikedCourses(JSON.parse(storedLikes))
    }

    // Load cart items from localStorage
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
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

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (!mounted) return

    let result = [...allCourses]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) => course.name.en.toLowerCase().includes(query) || course.description.en.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (selectedType !== "all") {
      result = result.filter((course) => course.type === selectedType)
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      result = result.filter((course) => course.level.en === selectedLevel)
    }

    // Apply price filter
    result = result.filter((course) => course.price >= priceRange[0] && course.price <= priceRange[1])

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // Assuming id represents chronological order
        result.sort((a, b) => b.id - a.id)
        break
      case "popular":
        result.sort((a, b) => b.students - a.students)
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredCourses(result)
  }, [searchQuery, selectedType, selectedLevel, priceRange, sortOption, mounted])

  const toggleLike = (courseId: number) => {
    setLikedCourses((prev) => {
      const isLiked = prev.includes(courseId)
      const newLikes = isLiked ? prev.filter((id) => id !== courseId) : [...prev, courseId]

      // Save to localStorage
      localStorage.setItem("likedCourses", JSON.stringify(newLikes))

      // Show toast
      toast({
        title: isLiked ? getText("unlikedCourse") : getText("likedCourse"),
        description: getText("likeActionDescription"),
      })

      return newLikes
    })
  }

  const addToCart = (courseId: number) => {
    if (cartItems.includes(courseId)) {
      toast({
        title: getText("alreadyInCart"),
        description: getText("alreadyInCartDescription"),
      })
      return
    }

    setCartItems((prev) => {
      const newCart = [...prev, courseId]
      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(newCart))

      // Show toast
      toast({
        title: getText("addedToCart"),
        description: getText("addedToCartDescription"),
      })

      return newCart
    })
  }

  const removeFromCart = (courseId: number) => {
    setCartItems((prev) => {
      const newCart = prev.filter((id) => id !== courseId)
      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(newCart))

      // Show toast
      toast({
        title: getText("removedFromCart"),
        description: getText("removedFromCartDescription"),
      })

      return newCart
    })
  }

  const checkout = () => {
    // In a real app, this would redirect to a payment gateway
    toast({
      title: getText("checkoutSuccess"),
      description: getText("checkoutSuccessDescription"),
    })

    // Clear cart
    setCartItems([])
    localStorage.removeItem("cartItems")
  }

  // Helper function to get text based on current language
  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      allCourses: {
        en: "All Courses",
        zh: "所有课程",
        ko: "모든 코스",
      },
      searchPlaceholder: {
        en: "Search courses...",
        zh: "搜索课程...",
        ko: "코스 검색...",
      },
      level: {
        en: "Level",
        zh: "级别",
        ko: "레벨",
      },
      type: {
        en: "Type",
        zh: "类型",
        ko: "유형",
      },
      sortBy: {
        en: "Sort by",
        zh: "排序方式",
        ko: "정렬 기준",
      },
      newest: {
        en: "Newest",
        zh: "最新",
        ko: "최신",
      },
      popular: {
        en: "Most Popular",
        zh: "最受欢迎",
        ko: "가장 인기있는",
      },
      priceLowToHigh: {
        en: "Price: Low to High",
        zh: "价格: 从低到高",
        ko: "가격: 낮은순",
      },
      priceHighToLow: {
        en: "Price: High to Low",
        zh: "价格: 从高到低",
        ko: "가격: 높은순",
      },
      rating: {
        en: "Highest Rating",
        zh: "最高评分",
        ko: "최고 평점",
      },
      filters: {
        en: "Filters",
        zh: "筛选条件",
        ko: "필터",
      },
      priceRange: {
        en: "Price Range",
        zh: "价格范围",
        ko: "가격 범위",
      },
      applyFilters: {
        en: "Apply Filters",
        zh: "应用筛选条件",
        ko: "필터 적용",
      },
      resetFilters: {
        en: "Reset Filters",
        zh: "重置筛选条件",
        ko: "필터 초기화",
      },
      duration: {
        en: "Duration",
        zh: "持续时间",
        ko: "기간",
      },
      students: {
        en: "students",
        zh: "学生",
        ko: "학생",
      },
      enrollNow: {
        en: "Enroll Now",
        zh: "立即报名",
        ko: "지금 등록",
      },
      addToCart: {
        en: "Add to Cart",
        zh: "添加到购物车",
        ko: "장바구니에 추가",
      },
      removeFromCart: {
        en: "Remove",
        zh: "移除",
        ko: "제거",
      },
      cart: {
        en: "Cart",
        zh: "购物车",
        ko: "장바구니",
      },
      checkout: {
        en: "Checkout",
        zh: "结账",
        ko: "결제",
      },
      emptyCart: {
        en: "Your cart is empty",
        zh: "您的购物车是空的",
        ko: "장바구니가 비어 있습니다",
      },
      total: {
        en: "Total",
        zh: "总计",
        ko: "총계",
      },
      likedCourse: {
        en: "Course Liked",
        zh: "已点赞课程",
        ko: "코스 좋아요",
      },
      unlikedCourse: {
        en: "Like Removed",
        zh: "已取消点赞",
        ko: "좋아요 취소됨",
      },
      likeActionDescription: {
        en: "Your preferences have been updated",
        zh: "您的偏好已更新",
        ko: "선호도가 업데이트되었습니다",
      },
      addedToCart: {
        en: "Added to Cart",
        zh: "已添加到购物车",
        ko: "장바구니에 추가됨",
      },
      addedToCartDescription: {
        en: "Course has been added to your cart",
        zh: "课程已添加到您的购物车",
        ko: "코스가 장바구니에 추가되었습니다",
      },
      alreadyInCart: {
        en: "Already in Cart",
        zh: "已在购物车中",
        ko: "이미 장바구니에 있음",
      },
      alreadyInCartDescription: {
        en: "This course is already in your cart",
        zh: "此课程已在您的购物车中",
        ko: "이 코스는 이미 장바구니에 있습니다",
      },
      removedFromCart: {
        en: "Removed from Cart",
        zh: "已从购物车中移除",
        ko: "장바구니에서 제거됨",
      },
      removedFromCartDescription: {
        en: "Course has been removed from your cart",
        zh: "课程已从您的购物车中移除",
        ko: "코스가 장바구니에서 제거되었습니다",
      },
      checkoutSuccess: {
        en: "Purchase Successful",
        zh: "购买成功",
        ko: "구매 성공",
      },
      checkoutSuccessDescription: {
        en: "Thank you for your purchase!",
        zh: "感谢您的购买！",
        ko: "구매해 주셔서 감사합니다!",
      },
      backToHome: {
        en: "Back to Home",
        zh: "返回首页",
        ko: "홈으로 돌아가기",
      },
    }

    return texts[key]?.[currentLanguage] || texts[key]?.en || key
  }

  if (!mounted) return null

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, id) => {
    const course = allCourses.find((c) => c.id === id)
    return total + (course?.price || 0)
  }, 0)

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-8">
        <div className="container">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                {getText("backToHome")}
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">{getText("allCourses")}</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={getText("searchPlaceholder")}
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder={getText("type")} />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label[currentLanguage as keyof typeof type.label] || type.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder={getText("level")} />
                </SelectTrigger>
                <SelectContent>
                  {courseLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label[currentLanguage as keyof typeof level.label] || level.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder={getText("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{getText("newest")}</SelectItem>
                  <SelectItem value="popular">{getText("popular")}</SelectItem>
                  <SelectItem value="price-low">{getText("priceLowToHigh")}</SelectItem>
                  <SelectItem value="price-high">{getText("priceHighToLow")}</SelectItem>
                  <SelectItem value="rating">{getText("rating")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <Filter className="h-4 w-4" />
                    {getText("filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{getText("filters")}</SheetTitle>
                    <SheetDescription>{getText("applyFilters")}</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">{getText("priceRange")}</h3>
                      <div className="pt-4">
                        <Slider
                          defaultValue={[0, 500]}
                          min={0}
                          max={500}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">{getText("type")}</h3>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {courseTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label[currentLanguage as keyof typeof type.label] || type.label.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">{getText("level")}</h3>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {courseLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label[currentLanguage as keyof typeof level.label] || level.label.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <SheetFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedType("all")
                        setSelectedLevel("all")
                        setPriceRange([0, 500])
                        setSearchQuery("")
                      }}
                    >
                      {getText("resetFilters")}
                    </Button>
                    <SheetClose asChild>
                      <Button>{getText("applyFilters")}</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Shopping Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2 relative">
                    <ShoppingCart className="h-4 w-4" />
                    {getText("cart")}
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{getText("cart")}</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">{getText("emptyCart")}</div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((id) => {
                          const course = allCourses.find((c) => c.id === id)
                          if (!course) return null

                          return (
                            <div key={id} className="flex justify-between items-center border-b pb-4">
                              <div>
                                <h4 className="font-medium">
                                  {course.name[currentLanguage as keyof typeof course.name] || course.name.en}
                                </h4>
                                <p className="text-primary font-bold">${course.price}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeFromCart(id)}>
                                {getText("removeFromCart")}
                              </Button>
                            </div>
                          )
                        })}

                        <div className="pt-4 border-t mt-6">
                          <div className="flex justify-between font-bold text-lg mb-6">
                            <span>{getText("total")}:</span>
                            <span>${cartTotal}</span>
                          </div>
                          <Button
                            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            onClick={checkout}
                          >
                            {getText("checkout")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No courses match your filters. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm ${
                        likedCourses.includes(course.id) ? "text-red-500" : "text-muted-foreground"
                      }`}
                      onClick={() => toggleLike(course.id)}
                    >
                      <Heart className={`h-4 w-4 ${likedCourses.includes(course.id) ? "fill-current" : ""}`} />
                    </Button>
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
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {getText("duration")}:{" "}
                        {course.duration[currentLanguage as keyof typeof course.duration] || course.duration.en}
                      </span>
                      <span>
                        {course.students.toLocaleString()} {getText("students")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-muted"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-7.07 3.707 1.35-7.857L.587 7.11l7.87-1.142L10 0l2.543 5.968 7.87 1.142-5.693 4.325 1.35 7.857z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-xs">{course.rating.toFixed(1)}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {course.likes} {likedCourses.includes(course.id) ? "❤️" : "♡"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      className="flex-1 rounded-full"
                      variant="outline"
                      onClick={() => addToCart(course.id)}
                      disabled={cartItems.includes(course.id)}
                    >
                      {cartItems.includes(course.id) ? getText("alreadyInCart") : getText("addToCart")}
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      onClick={() => {
                        addToCart(course.id)
                        checkout()
                      }}
                    >
                      {getText("enrollNow")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
