export interface FinancialRecord {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string // ISO date string
  createdAt: number
}

export interface Budget {
  id: string
  category: string
  monthlyLimit: number
  createdAt: number
}

const FINANCIAL_RECORDS_KEY = 'businessboost_financial_records'
const BUDGETS_KEY = 'businessboost_budgets'

export const financeStorage = {
  getRecords: (): FinancialRecord[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FINANCIAL_RECORDS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveRecords: (records: FinancialRecord[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(FINANCIAL_RECORDS_KEY, JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save financial records:', error)
    }
  },

  addRecord: (record: Omit<FinancialRecord, 'id' | 'createdAt'>): FinancialRecord => {
    const records = financeStorage.getRecords()
    const newRecord: FinancialRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    records.push(newRecord)
    financeStorage.saveRecords(records)
    return newRecord
  },

  updateRecord: (id: string, updates: Partial<FinancialRecord>): void => {
    const records = financeStorage.getRecords()
    const index = records.findIndex(r => r.id === id)
    if (index !== -1) {
      records[index] = { ...records[index], ...updates }
      financeStorage.saveRecords(records)
    }
  },

  deleteRecord: (id: string): void => {
    const records = financeStorage.getRecords()
    const filtered = records.filter(r => r.id !== id)
    financeStorage.saveRecords(filtered)
  },

  getRecordsForMonth: (year: number, month: number): FinancialRecord[] => {
    const records = financeStorage.getRecords()
    return records.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate.getFullYear() === year && recordDate.getMonth() === month
    })
  },

  getRecordsForDate: (date: string): FinancialRecord[] => {
    const records = financeStorage.getRecords()
    return records.filter(r => r.date === date)
  },

  getIncomeRecords: (): FinancialRecord[] => {
    return financeStorage.getRecords().filter(r => r.type === 'income')
  },

  getExpenseRecords: (): FinancialRecord[] => {
    return financeStorage.getRecords().filter(r => r.type === 'expense')
  },

  clearAllRecords: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(FINANCIAL_RECORDS_KEY)
    } catch (error) {
      console.error('Failed to clear financial records:', error)
    }
  }
}

export const budgetStorage = {
  getBudgets: (): Budget[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(BUDGETS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveBudgets: (budgets: Budget[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
    } catch (error) {
      console.error('Failed to save budgets:', error)
    }
  },

  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>): Budget => {
    const budgets = budgetStorage.getBudgets()
    const newBudget: Budget = {
      ...budget,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    budgets.push(newBudget)
    budgetStorage.saveBudgets(budgets)
    return newBudget
  },

  updateBudget: (id: string, updates: Partial<Budget>): void => {
    const budgets = budgetStorage.getBudgets()
    const index = budgets.findIndex(b => b.id === id)
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updates }
      budgetStorage.saveBudgets(budgets)
    }
  },

  deleteBudget: (id: string): void => {
    const budgets = budgetStorage.getBudgets()
    const filtered = budgets.filter(b => b.id !== id)
    budgetStorage.saveBudgets(filtered)
  },

  getBudgetForCategory: (category: string): Budget | undefined => {
    const budgets = budgetStorage.getBudgets()
    return budgets.find(b => b.category === category)
  },

  clearAllBudgets: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(BUDGETS_KEY)
    } catch (error) {
      console.error('Failed to clear budgets:', error)
    }
  }
}