"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileButton } from "@/components/profile"
import { financeStorage } from "@/lib/finance-storage"
import { calendarStorage } from "@/lib/calendar-storage"
import { goalsStorage } from "@/lib/goals-storage"
import { format, startOfMonth, endOfMonth } from "date-fns"

export default function DashboardPage() {
  const router = useRouter()
  const [showQuickAdd, setShowQuickAdd] = useState<'expense' | 'event' | null>(null)
  const [quickExpense, setQuickExpense] = useState({ amount: '', category: '', description: '' })
  const [quickEvent, setQuickEvent] = useState({ title: '', type: 'meeting' as 'meeting' | 'appointment' | 'deadline', time: '' })

  const currentMonthStart = startOfMonth(new Date())
  const currentMonthEnd = endOfMonth(new Date())
  
  const monthRecords = financeStorage.getRecords().filter(r => {
    const recordDate = new Date(r.date)
    return recordDate >= currentMonthStart && recordDate <= currentMonthEnd
  })

  const monthIncome = monthRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0)
  const monthExpenses = monthRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)
  
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayEvents = calendarStorage.getEventsForDate(today)
  const todayGoals = goalsStorage.getGoals().filter(g => g.type === 'daily' && g.targetDate === today)
  const completedGoals = todayGoals.filter(g => g.isCompleted).length

  const handleQuickExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickExpense.amount || !quickExpense.category) return

    financeStorage.addRecord({
      type: 'expense',
      amount: parseFloat(quickExpense.amount),
      category: quickExpense.category,
      description: quickExpense.description,
      date: format(new Date(), 'yyyy-MM-dd')
    })

    setQuickExpense({ amount: '', category: '', description: '' })
    setShowQuickAdd(null)
  }

  const handleQuickEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickEvent.title) return

    calendarStorage.addEvent({
      title: quickEvent.title,
      type: quickEvent.type,
      time: quickEvent.time,
      date: format(new Date(), 'yyyy-MM-dd'),
      isCompleted: false
    })

    setQuickEvent({ title: '', type: 'meeting', time: '' })
    setShowQuickAdd(null)
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <header className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border-b border-emerald-100 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
              BusinessBoost AI
            </h1>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-100 mb-1">
            Dashboard
          </h2>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm">
            Welcome back
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              Monthly Income
            </p>
            <p className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
              ${monthIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              Monthly Expenses
            </p>
            <p className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
              ${monthExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              Today&apos;s Progress
            </p>
            <p className="text-xl font-semibold text-emerald-800 dark:text-emerald-100">
              {completedGoals}/{todayGoals.length} Goals
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🌿</span>
            </div>
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-100 mb-1">
              AI Support Chatbot
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
              Get emotional support and motivation
            </p>
            <button
              onClick={() => router.push('/chat')}
              className="w-full py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Open Chat
            </button>
          </div>

          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🌱</span>
            </div>
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-100 mb-1">
              AI Business Assistant
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
              Business advice and planning
            </p>
            <button
              onClick={() => router.push('/chat/business')}
              className="w-full py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Advice
            </button>
          </div>

          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🍃</span>
            </div>
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-100 mb-1">
              Calendar & Tasks
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
              {todayEvents.length} events today
            </p>
            <button
              onClick={() => router.push('/calendar')}
              className="w-full py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Manage Calendar
            </button>
          </div>

          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🌳</span>
            </div>
            <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-100 mb-1">
              Financial Tracker
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
              Track income and expenses
            </p>
            <button
              onClick={() => router.push('/finance')}
              className="w-full py-2 text-sm bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
            >
              View Finances
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-100 dark:border-zinc-700 shadow-sm">
          <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => router.push('/chat/business')}
              className="p-3 border border-emerald-200 dark:border-zinc-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors text-left flex items-center gap-3"
            >
              <span className="text-lg">🌿</span>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-100">Create Business Plan</p>
            </button>
            <button
              onClick={() => setShowQuickAdd('expense')}
              className="p-3 border border-emerald-200 dark:border-zinc-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors text-left flex items-center gap-3"
            >
              <span className="text-lg">🍃</span>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-100">Add Expense</p>
            </button>
            <button
              onClick={() => setShowQuickAdd('event')}
              className="p-3 border border-emerald-200 dark:border-zinc-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors text-left flex items-center gap-3"
            >
              <span className="text-lg">🌱</span>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-100">Schedule Meeting</p>
            </button>
          </div>
        </div>

        {/* Quick Add Expense Modal */}
        {showQuickAdd === 'expense' && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md mx-4 border border-emerald-100 dark:border-zinc-700 shadow-lg">
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-100 mb-4">
                Quick Add Expense
              </h3>
              <form onSubmit={handleQuickExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickExpense.amount}
                    onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={quickExpense.category}
                    onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Travel">Travel</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={quickExpense.description}
                    onChange={(e) => setQuickExpense({ ...quickExpense, description: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(null)}
                    className="flex-1 px-4 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Add Event Modal */}
        {showQuickAdd === 'event' && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full max-w-md mx-4 border border-emerald-100 dark:border-zinc-700 shadow-lg">
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-100 mb-4">
                Quick Schedule Meeting
              </h3>
              <form onSubmit={handleQuickEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={quickEvent.title}
                    onChange={(e) => setQuickEvent({ ...quickEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Type
                  </label>
                  <select
                    value={quickEvent.type}
                    onChange={(e) => setQuickEvent({ ...quickEvent, type: e.target.value as 'meeting' | 'appointment' | 'deadline' })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={quickEvent.time}
                    onChange={(e) => setQuickEvent({ ...quickEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-emerald-800 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(null)}
                    className="flex-1 px-4 py-2 border border-emerald-200 dark:border-zinc-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}