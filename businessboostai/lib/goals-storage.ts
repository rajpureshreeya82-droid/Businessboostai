export interface Goal {
  id: string
  title: string
  description?: string
  type: 'daily' | 'weekly'
  targetDate: string // ISO date string
  isCompleted: boolean
  createdAt: number
}

const STORAGE_KEY = 'businessboost_goals'

export const goalsStorage = {
  getGoals: (): Goal[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveGoals: (goals: Goal[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    } catch (error) {
      console.error('Failed to save goals:', error)
    }
  },

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const goals = goalsStorage.getGoals()
    const newGoal: Goal = {
      ...goal,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    goals.push(newGoal)
    goalsStorage.saveGoals(goals)
    return newGoal
  },

  updateGoal: (id: string, updates: Partial<Goal>): void => {
    const goals = goalsStorage.getGoals()
    const index = goals.findIndex(g => g.id === id)
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates }
      goalsStorage.saveGoals(goals)
    }
  },

  deleteGoal: (id: string): void => {
    const goals = goalsStorage.getGoals()
    const filtered = goals.filter(g => g.id !== id)
    goalsStorage.saveGoals(filtered)
  },

  getGoalsForDate: (date: string): Goal[] => {
    const goals = goalsStorage.getGoals()
    return goals.filter(g => g.targetDate === date)
  },

  getGoalsForWeek: (weekStart: string, weekEnd: string): Goal[] => {
    const goals = goalsStorage.getGoals()
    return goals.filter(g => g.targetDate >= weekStart && g.targetDate <= weekEnd)
  },

  clearCompleted: (): void => {
    const goals = goalsStorage.getGoals()
    const active = goals.filter(g => !g.isCompleted)
    goalsStorage.saveGoals(active)
  }
}