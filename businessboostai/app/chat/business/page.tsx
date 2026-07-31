"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileButton } from "@/components/profile"
import { chatStorage } from "@/lib/chat-storage"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface BusinessInfo {
  businessName: string
  businessType: string
  businessAge: string
  teamSize: string
  whyJoin: string
  mainChallenges: string
  goals: string
}

export default function BusinessChatPage() {
  const router = useRouter()
  const businessInfo = useState<BusinessInfo | null>(() => {
    // Load business info from localStorage on mount
    try {
      const stored = localStorage.getItem('businessInfo')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      console.error('Failed to load business info')
    }
    return null
  })[0]
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on mount
    const storedMessages = chatStorage.getMessages('business')
    if (storedMessages.length > 0) {
      return storedMessages.map(msg => ({ role: msg.role, content: msg.content }))
    } else {
      // Initial welcome message
      return [{
        role: 'assistant',
        content: "Hello! I'm your AI Business Assistant. I can help you with business planning, marketing strategies, financial advice, sales forecasts, and operational improvements. What specific problem or challenge are you facing in your business today?"
      }]
    }
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
      const messagesWithTimestamp = messages.map(msg => ({
        ...msg,
        timestamp: Date.now()
      }))
      chatStorage.saveMessages('business', messagesWithTimestamp)
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          assistantType: 'practical',
          conversationHistory: { businessInfo }
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    chatStorage.clearMessages('business')
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm your AI Business Assistant. I can help you with business planning, marketing strategies, financial advice, sales forecasts, and operational improvements. What specific problem or challenge are you facing in your business today?"
    }])
  }

  const quickActions = [
    "What specific problem are you facing?",
    "Marketing strategy ideas",
    "Financial advice",
    "Sales forecast"
  ]

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 min-h-screen">
      <header className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border-b border-emerald-100 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 font-medium transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
                AI Business Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={clearChat}
                className="text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 font-medium transition-colors"
              >
                Clear Chat
              </button>
              <ProfileButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col h-[calc(100vh-16rem)] border border-emerald-100 dark:border-zinc-700">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-emerald-50 dark:bg-zinc-700 text-emerald-900 dark:text-emerald-100 border border-emerald-100 dark:border-zinc-600'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-emerald-50 dark:bg-zinc-700 rounded-2xl p-4 border border-emerald-100 dark:border-zinc-600">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-emerald-100 dark:border-zinc-700 p-4">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for business advice..."
                className="flex-1 px-4 py-3 border border-emerald-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-900 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 transition-colors font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}