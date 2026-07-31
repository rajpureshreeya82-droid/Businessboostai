export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const STORAGE_KEYS = {
  SUPPORT_CHAT: 'businessboost_support_chat',
  BUSINESS_CHAT: 'businessboost_business_chat'
}

export const chatStorage = {
  getMessages: (chatType: 'support' | 'business'): ChatMessage[] => {
    if (typeof window === 'undefined') return []
    const key = chatType === 'support' ? STORAGE_KEYS.SUPPORT_CHAT : STORAGE_KEYS.BUSINESS_CHAT
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveMessages: (chatType: 'support' | 'business', messages: ChatMessage[]) => {
    if (typeof window === 'undefined') return
    const key = chatType === 'support' ? STORAGE_KEYS.SUPPORT_CHAT : STORAGE_KEYS.BUSINESS_CHAT
    try {
      localStorage.setItem(key, JSON.stringify(messages))
    } catch (error) {
      console.error('Failed to save chat messages:', error)
    }
  },

  clearMessages: (chatType: 'support' | 'business') => {
    if (typeof window === 'undefined') return
    const key = chatType === 'support' ? STORAGE_KEYS.SUPPORT_CHAT : STORAGE_KEYS.BUSINESS_CHAT
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to clear chat messages:', error)
    }
  }
}