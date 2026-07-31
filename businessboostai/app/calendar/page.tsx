"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileButton } from "@/components/profile"
import { calendarStorage, TaskEvent } from "@/lib/calendar-storage"
import { goalsStorage, Goal } from "@/lib/goals-storage"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays, endOfWeek } from "date-fns"

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [events, setEvents] = useState<TaskEvent[]>(() => calendarStorage.getEvents())
  const [goals, setGoals] = useState<Goal[]>(() => goalsStorage.getGoals())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'meeting' as TaskEvent['type']
  })
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'daily' as Goal['type']
  })

  // Auto-save to localStorage
  useEffect(() => {
    calendarStorage.saveEvents(events)
  }, [events])

  useEffect(() => {
    goalsStorage.saveGoals(goals)
  }, [goals])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return events.filter(e => e.date === dateStr)
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim()) return

    calendarStorage.addEvent({
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      isCompleted: false
    })

    setEvents(calendarStorage.getEvents())
    setShowAddModal(false)
    setNewEvent({ title: '', description: '', time: '', type: 'meeting' })
  }

  const toggleEventCompletion = (id: string) => {
    const event = events.find(e => e.id === id)
    if (event) {
      calendarStorage.updateEvent(id, { isCompleted: !event.isCompleted })
      setEvents(calendarStorage.getEvents())
    }
  }

  const deleteEvent = (id: string) => {
    calendarStorage.deleteEvent(id)
    setEvents(calendarStorage.getEvents())
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    const targetDate = newGoal.type === 'daily' 
      ? selectedDate 
      : format(endOfWeek(new Date(selectedDate)), 'yyyy-MM-dd')

    goalsStorage.addGoal({
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      targetDate,
      isCompleted: false
    })

    setGoals(goalsStorage.getGoals())
    setShowGoalsModal(false)
    setNewGoal({ title: '', description: '', type: 'daily' })
  }

  const toggleGoalCompletion = (id: string) => {
    const goal = goals.find(g => g.id === id)
    if (goal) {
      goalsStorage.updateGoal(id, { isCompleted: !goal.isCompleted })
      setGoals(goalsStorage.getGoals())
    }
  }

  const deleteGoal = (id: string) => {
    goalsStorage.deleteGoal(id)
    setGoals(goalsStorage.getGoals())
  }

  const getDailyGoals = () => {
    return goals.filter(g => g.type === 'daily' && g.targetDate === selectedDate)
  }

  const getUpcomingReminders = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd')
    return events.filter(e => 
      (e.type === 'reminder' || e.type === 'deadline') && 
      e.date >= today && 
      e.date <= nextWeek &&
      !e.isCompleted
    )
  }

  const getTypeColor = (type: TaskEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      deadline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      appointment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      goal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[type] || colors.meeting
  }

  const selectedDayEvents = events.filter(e => e.date === selectedDate)

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
                Calendar & Tasks
              </h1>
            </div>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Reminders Banner */}
        {getUpcomingReminders().length > 0 && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⏰ Upcoming Reminders & Deadlines
            </h3>
            <div className="space-y-2">
              {getUpcomingReminders().slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-700 dark:text-yellow-300">
                    {event.title} - {format(new Date(event.date), 'MMM d')}
                    {event.time && ` at ${event.time}`}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-zinc-600 dark:text-zinc-400 text-sm">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map(date => {
                const dayEvents = getEventsForDay(date)
                const isSelected = selectedDate === format(date, 'yyyy-MM-dd')
                const isCurrentMonth = isSameMonth(date, currentDate)
                const isDayToday = isToday(date)

                return (
                  <button
                    key={date.toString()}
                    onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    className={`
                      p-2 rounded-lg border-2 transition-all min-h-[80px] flex flex-col
                      ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-700'}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                      ${isDayToday ? 'bg-zinc-100 dark:bg-zinc-800' : ''}
                    `}
                  >
                    <span className={`text-sm font-medium ${isDayToday ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {format(date, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`w-2 h-2 rounded-full ${event.isCompleted ? 'bg-green-500' : getTypeColor(event.type).split(' ')[0]}`}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-zinc-500">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Day Events */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGoalsModal(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  + Goal
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  + Event
                </button>
              </div>
            </div>

            {/* Daily Goals Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                Daily Goals
              </h4>
              <div className="space-y-2">
                {getDailyGoals().length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No daily goals set</p>
                ) : (
                  getDailyGoals().map(goal => (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg border ${
                        goal.isCompleted 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                          : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${goal.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {goal.title}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className="text-xs text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            {goal.isCompleted ? '↩' : '✓'}
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Events Section */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide">
                Events & Tasks
              </h4>
              <div className="space-y-3">
                {selectedDayEvents.length === 0 ? (
                  <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
                    No events scheduled for this day
                  </p>
                ) : (
                  selectedDayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${
                        event.isCompleted 
                          ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' 
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                            {event.time && (
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                {event.time}
                              </span>
                            )}
                          </div>
                          <h4 className={`font-medium ${event.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleEventCompletion(event.id)}
                            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            {event.isCompleted ? '↩' : '✓'}
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Add New Event
              </h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as TaskEvent['type'] })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="appointment">Appointment</option>
                    <option value="reminder">Reminder</option>
                    <option value="goal">Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showGoalsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Add New Goal
              </h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="daily">Daily Goal</option>
                    <option value="weekly">Weekly Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGoalsModal(false)}
                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Goal
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