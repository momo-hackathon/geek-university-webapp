"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DynamicFrame from "@/components/dynamic-frame"

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
        <div className="mx-auto w-full text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-full h-full flex flex-col md:flex-row items-start gap-8 md:gap-8">
              <div className="w-full md:flex-grow h-[60vh] md:h-[80vh]">
                <DynamicFrame />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
