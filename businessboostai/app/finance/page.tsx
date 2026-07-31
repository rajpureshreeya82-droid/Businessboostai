"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileButton } from "@/components/profile"
import { financeStorage, FinancialRecord } from "@/lib/finance-storage"
import { budgetStorage, Budget } from "@/lib/finance-storage"
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"

export default function FinancePage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [records, setRecords] = useState<FinancialRecord[]>(() => financeStorage.getRecords())
  const [budgets, setBudgets] = useState<Budget[]>(() => budgetStorage.getBudgets())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [selectedView, setSelectedView] = useState<'overview' | 'records' | 'budgets'>('overview')
  
  const [newRecord, setNewRecord] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  
  const [newBudget, setNewBudget] = useState({
    category: '',
    monthlyLimit: ''
  })

  const categories = [
    'Sales', 'Services', 'Products', 'Salary', 'Investments',
    'Rent', 'Utilities', 'Marketing', 'Supplies', 'Travel', 'Insurance', 'Other'
  ]

  useEffect(() => {
    financeStorage.saveRecords(records)
  }, [records])

  useEffect(() => {
    budgetStorage.saveBudgets(budgets)
  }, [budgets])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthRecords = records.filter(r => {
    const recordDate = new Date(r.date)
    return recordDate >= monthStart && recordDate <= monthEnd
  })

  const monthIncome = monthRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)

  const monthExpenses = monthRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)

  const netProfit = monthIncome - monthExpenses

  const expensesByCategory = monthRecords
    .filter(r => r.type === 'expense')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount
      return acc
    }, {} as Record<string, number>)

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecord.amount || !newRecord.category) return

    financeStorage.addRecord({
      type: newRecord.type,
      amount: parseFloat(newRecord.amount),
      category: newRecord.category,
      description: newRecord.description,
      date: newRecord.date
    })

    setRecords(financeStorage.getRecords())
    setShowAddModal(false)
    setNewRecord({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    })
  }

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBudget.category || !newBudget.monthlyLimit) return

    budgetStorage.addBudget({
      category: newBudget.category,
      monthlyLimit: parseFloat(newBudget.monthlyLimit)
    })

    setBudgets(budgetStorage.getBudgets())
    setShowBudgetModal(false)
    setNewBudget({
      category: '',
      monthlyLimit: ''
    })
  }

  const deleteRecord = (id: string) => {
    financeStorage.deleteRecord(id)
    setRecords(financeStorage.getRecords())
  }

  const deleteBudget = (id: string) => {
    budgetStorage.deleteBudget(id)
    setBudgets(budgetStorage.getBudgets())
  }

  const getBudgetStatus = (category: string) => {
    const budget = budgetStorage.getBudgetForCategory(category)
    if (!budget) return { spent: 0, limit: 0, percentage: 0, status: 'none' }
    
    const spent = monthRecords
      .filter(r => r.type === 'expense' && r.category === category)
      .reduce((sum, r) => sum + r.amount, 0)
    
    const percentage = (spent / budget.monthlyLimit) * 100
    let status = 'healthy'
    if (percentage >= 100) status = 'exceeded'
    else if (percentage >= 80) status = 'warning'
    
    return { spent, limit: budget.monthlyLimit, percentage, status }
  }

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen">
      <header className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Financial Tracker
              </h1>
            </div>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedView === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('records')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedView === 'records'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
            }`}
          >
            Records
          </button>
          <button
            onClick={() => setSelectedView('budgets')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedView === 'budgets'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
            }`}
          >
            Budgets
          </button>
        </div>

        {selectedView === 'overview' && (
          <>
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                ← Previous
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={goToToday}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Today
                </button>
              </div>
              <button
                onClick={goToNextMonth}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                  Total Income
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${monthIncome.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ${monthExpenses.toFixed(2)}
                </p>
              </div>
              <div className={`rounded-lg p-6 border ${
                netProfit >= 0
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              }`}>
                <h3 className={`text-sm font-semibold mb-2 ${
                  netProfit >= 0
                    ? 'text-blue-800 dark:text-blue-200'
                    : 'text-orange-800 dark:text-orange-200'
                }`}>
                  Net Profit
                </h3>
                <p className={`text-3xl font-bold ${
                  netProfit >= 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  ${netProfit.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Spending by Category */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Spending by Category
              </h3>
              {Object.keys(expensesByCategory).length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
                  No expenses recorded for this month
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expensesByCategory).map(([category, amount]) => {
                    const budgetStatus = getBudgetStatus(category)
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{category}</span>
                            <span className="text-zinc-600 dark:text-zinc-400">${amount.toFixed(2)}</span>
                          </div>
                          {budgetStatus.status !== 'none' && (
                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  budgetStatus.status === 'exceeded'
                                    ? 'bg-red-500'
                                    : budgetStatus.status === 'warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            const budget = budgetStorage.getBudgetForCategory(category)
                            if (budget) {
                              const newLimit = prompt('Enter new monthly limit:', budget.monthlyLimit.toString())
                              if (newLimit) {
                                budgetStorage.updateBudget(budget.id, { monthlyLimit: parseFloat(newLimit) })
                                setBudgets(budgetStorage.getBudgets())
                              }
                            } else {
                              const limit = prompt('Set monthly budget limit for ' + category + ':')
                              if (limit) {
                                budgetStorage.addBudget({ category, monthlyLimit: parseFloat(limit) })
                                setBudgets(budgetStorage.getBudgets())
                              }
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          {budgetStatus.status === 'none' ? 'Set Budget' : 'Edit Budget'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {selectedView === 'records' && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                All Records
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Record
              </button>
            </div>

            <div className="space-y-3">
              {records.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                  No financial records yet
                </p>
              ) : (
                records.slice().reverse().map(record => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.type === 'income'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            record.type === 'income'
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}>
                            {record.type}
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          ${record.amount.toFixed(2)} - {record.category}
                        </h4>
                        {record.description && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            {record.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedView === 'budgets' && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Monthly Budgets
              </h3>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Budget
              </button>
            </div>

            <div className="space-y-3">
              {budgets.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                  No budgets set yet
                </p>
              ) : (
                budgets.map(budget => {
                  const status = getBudgetStatus(budget.category)
                  return (
                    <div
                      key={budget.id}
                      className={`p-4 rounded-lg border ${
                        status.status === 'exceeded'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : status.status === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {budget.category}
                        </h4>
                        <button
                          onClick={() => deleteBudget(budget.id)}
                          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Spent: ${status.spent.toFixed(2)}
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Limit: ${status.limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            status.status === 'exceeded'
                              ? 'bg-red-500'
                              : status.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(status.percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {status.percentage.toFixed(1)}% used
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Add Financial Record
            </h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Type
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as 'income' | 'expense' })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRecord.amount}
                  onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Set Monthly Budget
            </h3>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Monthly Limit *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.monthlyLimit}
                  onChange={(e) => setNewBudget({ ...newBudget, monthlyLimit: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Set Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}