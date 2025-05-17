"use client"

import { MastraClient } from "@mastra/client-js";
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Bot, X, Maximize2, RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

// 定义消息类型
type Message = {
  id: string
  text: string
  isUser: boolean
}

// 初始化 MastraClient
const client = new MastraClient({
  baseUrl: "http://localhost:4111", // Mastra 服务器地址
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
});

// 建议问题列表
const suggestedQuestions = [
  {
    en: "What is blockchain technology?",
    zh: "什么是区块链技术？",
    ko: "블록체인 기술이란 무엇인가요?",
  },
  {
    en: "How do smart contracts work?",
    zh: "智能合约是如何工作的？",
    ko: "스마트 컨트랙트는 어떻게 작동하나요?",
  },
  {
    en: "What is DeFi and how does it work?",
    zh: "什么是 DeFi，它是如何工作的？",
    ko: "DeFi란 무엇이며 어떻게 작동하나요?",
  },
]

// AI Assistant 组件
export default function AIAssistant() {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 生成唯一的会话ID和用户ID
  const sessionId = useRef(Date.now().toString()).current
  const userId = useRef("user_" + Math.random().toString(36).substr(2, 9)).current

  // 监听语言偏好变化
  useEffect(() => {
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

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 切换聊天窗口
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
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

  // 切换展开状态
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // 重置聊天
  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: getText("welcomeMessage"),
        isUser: false,
      },
    ])
  }

  // 发送消息
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // 调用 agent 获取响应
      const workflow = await client.getWorkflow("web3TutorWorkflow");
      const response = await workflow.execute({
        question: input,
        context: {
          userId,
          sessionId,
          previousQuestions: messages
            .filter(m => m.isUser)
            .map(m => m.text),
        },
      });
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof response.results === 'object' && response.results !== null 
          ? JSON.stringify(response.results)
          : "Sorry, I couldn't process your request.",
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting agent response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getText("errorMessage"),
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 处理建议问题点击
  const handleSuggestedQuestion = async (question: string) => {
    setInput(question)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const workflow = await client.getWorkflow("web3TutorWorkflow");
      const response = await workflow.execute({
        question,
        context: {
          userId,
          sessionId,
          previousQuestions: messages
            .filter(m => m.isUser)
            .map(m => m.text),
        },
      });
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof response.results === 'object' && response.results !== null 
          ? JSON.stringify(response.results)
          : "Sorry, I couldn't process your request.",
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting agent response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getText("errorMessage"),
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 获取多语言文本
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
        en: "Hello! I'm your Web3 course assistant. I can help you understand blockchain technology, smart contracts, DeFi, NFTs, and other Web3 concepts. What would you like to learn about?",
        zh: "你好！我是你的 Web3 课程助手。我可以帮助你理解区块链技术、智能合约、DeFi、NFT 和其他 Web3 概念。你想了解什么？",
        ko: "안녕하세요! 저는 Web3 코스 어시스턴트입니다. 블록체인 기술, 스마트 컨트랙트, DeFi, NFT 및 기타 Web3 개념을 이해하는 데 도움을 드릴 수 있습니다. 무엇을 배우고 싶으신가요?",
      },
      suggestedFollowUp: {
        en: "Suggested follow-up questions:",
        zh: "建议的后续问题：",
        ko: "추천 후속 질문:",
      },
      errorMessage: {
        en: "I apologize, but I encountered an error. Please try again later.",
        zh: "抱歉，我遇到了一些问题。请稍后再试。",
        ko: "죄송합니다. 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
      },
    }

    return texts[key]?.[currentLanguage] || texts[key]?.en || key
  }

  return (
    <>
      {/* 聊天按钮 */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 z-50"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* 聊天窗口 */}
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
            {/* 头部 */}
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

            {/* 消息列表 */}
            <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.isUser ? "flex justify-end" : "flex justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}

              {/* 加载指示器 */}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              {/* 建议问题 */}
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

            {/* 输入框 */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getText("askMeAnything")}
                  className="rounded-full"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  className="rounded-full aspect-square p-0 w-10"
                  disabled={isLoading || !input.trim()}
                >
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
