"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Bot, X, Maximize2, RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  text: string
  isUser: boolean
}

const suggestedQuestions = [
  {
    en: "What kind of requests can you handle?",
    zh: "你能处理什么类型的请求？",
    ko: "어떤 종류의 요청을 처리할 수 있나요?",
  },
  {
    en: "What topics are you able to discuss?",
    zh: "你能讨论哪些话题？",
    ko: "어떤 주제에 대해 논의할 수 있나요?",
  },
  {
    en: "What are your limitations as an AI?",
    zh: "作为AI，你有什么局限性？",
    ko: "AI로서 당신의 한계는 무엇인가요?",
  },
]

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    // Focus input when chat is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time
      const welcomeMessage = getText("welcomeMessage")
      setMessages([
        {
          id: Date.now().toString(),
          text: welcomeMessage,
          isUser: false,
        },
      ])
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: getText("welcomeMessage"),
        isUser: false,
      },
    ])
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(question),
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  // Helper function to get text based on current language
  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      aiAssistant: {
        en: "AI Assistant",
        zh: "AI 助手",
        ko: "AI 어시스턴트",
      },
      builtBy: {
        en: "Built by Web3 Course Team",
        zh: "由 Web3 课程团队构建",
        ko: "Web3 코스 팀이 제작",
      },
      askMeAnything: {
        en: "Ask me anything...",
        zh: "问我任何问题...",
        ko: "무엇이든 물어보세요...",
      },
      welcomeMessage: {
        en: "Hello! I'm your Web3 course assistant. How can I help you today?",
        zh: "你好！我是你的 Web3 课程助手。今天我能帮你什么？",
        ko: "안녕하세요! 저는 Web3 코스 어시스턴트입니다. 오늘 어떻게 도와드릴까요?",
      },
      suggestedFollowUp: {
        en: "Suggested follow-up questions:",
        zh: "建议的后续问题：",
        ko: "추천 후속 질문:",
      },
    }

    return texts[key]?.[currentLanguage] || texts[key]?.en || key
  }

  // Simple AI response generator
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("hey")) {
      return currentLanguage === "en"
        ? "Hello! How can I assist you with Web3 courses today?"
        : currentLanguage === "zh"
          ? "你好！今天我能如何帮助你了解 Web3 课程？"
          : "안녕하세요! 오늘 Web3 코스에 대해 어떻게 도와드릴까요?"
    }

    if (lowerQuestion.includes("course") || lowerQuestion.includes("courses")) {
      return currentLanguage === "en"
        ? "We offer various Web3 courses ranging from blockchain fundamentals to advanced DApp development. You can browse all courses in our course catalog."
        : currentLanguage === "zh"
          ? "我们提供各种 Web3 课程，从区块链基础到高级 DApp 开发。您可以在我们的课程目录中浏览所有课程。"
          : "우리는 블록체인 기초부터 고급 DApp 개발까지 다양한 Web3 코스를 제공합니다. 코스 카탈로그에서 모든 코스를 찾아볼 수 있습니다."
    }

    if (lowerQuestion.includes("blockchain") || lowerQuestion.includes("web3")) {
      return currentLanguage === "en"
        ? "Blockchain is a distributed ledger technology that enables secure, transparent, and decentralized record-keeping. Web3 refers to the next generation of the internet built on blockchain technology."
        : currentLanguage === "zh"
          ? "区块链是一种分布式账本技术，可实现安全、透明和去中心化的记录保存。Web3 指的是基于区块链技术构建的下一代互联网。"
          : "블록체인은 안전하고 투명하며 분산된 기록 보관을 가능하게 하는 분산 원장 기술입니다. Web3는 블록체인 기술을 기반으로 구축된 차세대 인터넷을 의미합니다."
    }

    if (lowerQuestion.includes("price") || lowerQuestion.includes("cost") || lowerQuestion.includes("fee")) {
      return currentLanguage === "en"
        ? "Our course prices range from $199 for beginner courses to $449 for advanced specialized courses. We also offer bundle discounts if you purchase multiple courses."
        : currentLanguage === "zh"
          ? "我们的课程价格从初级课程的 $199 到高级专业课程的 $449 不等。如果您购买多门课程，我们还提供捆绑折扣。"
          : "우리 코스 가격은 초급 코스의 경우 $199부터 고급 전문 코스의 경우 $449까지 다양합니다. 여러 코스를 구매하시면 번들 할인도 제공합니다."
    }

    // Default response
    return currentLanguage === "en"
      ? "I'm sorry, I don't have specific information about that. Can you please ask something related to our Web3 courses or blockchain technology?"
      : currentLanguage === "zh"
        ? "抱歉，我没有关于这方面的具体信息。您能否询问与我们的 Web3 课程或区块链技术相关的问题？"
        : "죄송합니다. 그에 대한 구체적인 정보가 없습니다. Web3 코스나 블록체인 기술과 관련된 질문을 해주시겠어요?"
  }

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 z-50"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 right-6 bg-background border rounded-lg shadow-lg overflow-hidden z-50 ${
              isExpanded ? "w-[90vw] h-[80vh] max-w-4xl" : "w-[350px] h-[500px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{getText("aiAssistant")}</h3>
                  <p className="text-xs text-muted-foreground">{getText("builtBy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={resetChat} className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.isUser ? "flex justify-end" : "flex justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}

              {/* Suggested questions */}
              {messages.length === 1 && (
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-2">{getText("suggestedFollowUp")}</p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left text-sm h-auto py-2 px-3"
                        onClick={() =>
                          handleSuggestedQuestion(question[currentLanguage as keyof typeof question] || question.en)
                        }
                      >
                        {question[currentLanguage as keyof typeof question] || question.en}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getText("askMeAnything")}
                  className="rounded-full"
                />
                <Button onClick={handleSendMessage} className="rounded-full aspect-square p-0 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
