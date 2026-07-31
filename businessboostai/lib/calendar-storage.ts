export interface TaskEvent {
  id: string
  title: string
  description?: string
  date: string // ISO date string
  time?: string // HH:MM format
  type: 'meeting' | 'deadline' | 'appointment' | 'reminder' | 'goal'
  isCompleted: boolean
  createdAt: number
}

const STORAGE_KEY = 'businessboost_calendar_events'

export const calendarStorage = {
  getEvents: (): TaskEvent[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveEvents: (events: TaskEvent[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('Failed to save calendar events:', error)
    }
  },

  addEvent: (event: Omit<TaskEvent, 'id' | 'createdAt'>): TaskEvent => {
    const events = calendarStorage.getEvents()
    const newEvent: TaskEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    events.push(newEvent)
    calendarStorage.saveEvents(events)
    return newEvent
  },

  updateEvent: (id: string, updates: Partial<TaskEvent>): void => {
    const events = calendarStorage.getEvents()
    const index = events.findIndex(e => e.id === id)
    if (index !== -1) {
      events[index] = { ...events[index], ...updates }
      calendarStorage.saveEvents(events)
    }
  },

  deleteEvent: (id: string): void => {
    const events = calendarStorage.getEvents()
    const filtered = events.filter(e => e.id !== id)
    calendarStorage.saveEvents(filtered)
  },

  getEventsForDate: (date: string): TaskEvent[] => {
    const events = calendarStorage.getEvents()
    return events.filter(e => e.date === date)
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear calendar events:', error)
    }
  }
}