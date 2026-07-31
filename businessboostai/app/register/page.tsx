"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Basic account info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Business info
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [businessAge, setBusinessAge] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [whyJoin, setWhyJoin] = useState("")
  const [mainChallenges, setMainChallenges] = useState("")
  const [goals, setGoals] = useState("")
  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!businessName || !businessType || !whyJoin) {
      setError("Please fill in all required business information")
      return
    }

    setLoading(true)

    try {
      // In a real application, you would register the user in your database first
      // For this MVP, we'll just redirect to login with a success message
      // In production, you'd have a registration API endpoint
      
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store business info in localStorage for demo purposes
      const businessInfo = {
        businessName,
        businessType,
        businessAge,
        teamSize,
        whyJoin,
        mainChallenges,
        goals
      }
      localStorage.setItem('businessInfo', JSON.stringify(businessInfo))
      
      // Redirect to login page
      router.push("/Login?registered=true")
    } finally {
      setLoading(false)
    }
  }

  const businessTypes = [
    "Retail",
    "Service Business",
    "E-commerce",
    "Restaurant/Food Service",
    "Technology/Software",
    "Creative/Design",
    "Consulting",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Real Estate",
    "Other"
  ]

  const businessAges = [
    "Just starting/Planning",
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ]

  const teamSizes = [
    "Just me (Solopreneur)",
    "2-5 people",
    "6-10 people",
    "11-50 people",
    "50+ people"
  ]

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans min-h-screen px-4 py-8">
      <main className="flex flex-col w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {step === 1 ? "Create Your Account" : "Tell Us About Your Business"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {step === 1 ? "Join BusinessBoost AI today" : "Help us personalize your experience"}
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-800'}`} />
            <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-800'}`} />
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Business Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Business Type *
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessAge" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  How long has your business been operating?
                </label>
                <select
                  id="businessAge"
                  value={businessAge}
                  onChange={(e) => setBusinessAge(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select duration</option>
                  {businessAges.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Team Size
                </label>
                <select
                  id="teamSize"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select team size</option>
                  {teamSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="whyJoin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Why do you want to use BusinessBoost AI? *
              </label>
              <textarea
                id="whyJoin"
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Tell us what you're hoping to achieve..."
              />
            </div>

            <div>
              <label htmlFor="mainChallenges" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                What are your main business challenges?
              </label>
              <textarea
                id="mainChallenges"
                value={mainChallenges}
                onChange={(e) => setMainChallenges(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Time management, financial planning, marketing, etc..."
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                What are your business goals for the next 6 months?
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Growth targets, new products, expansion, etc..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/Login"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Already have an account? Sign in
          </a>
        </div>
      </main>
    </div>
  )
}