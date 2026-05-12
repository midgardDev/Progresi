"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import Link from "next/link"

interface CompetencyData {
  subject: string
  average: number
  count: number
}

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subjectData, setSubjectData] = useState<CompetencyData[]>([])
  const [levelDistribution, setLevelDistribution] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchReportData()
    }
  }, [session])

  const fetchReportData = async () => {
    try {
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setSubjectData(data.subjectPerformance || [])
        setLevelDistribution(data.levelDistribution || [])
        setProgressData(data.progressOverTime || [])
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading reports...</div>
      </div>
    )
  }

  if (!session) return null

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const barChartWidth = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 400 : 500) : 500
  const pieChartWidth = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 350 : 400) : 400
  const lineChartWidth = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 300 : window.innerWidth < 768 ? 500 : 800) : 800
  const chartHeight = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 250 : 300) : 300

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4 md:space-x-6">
              <h1 className="text-lg md:text-xl font-bold text-blue-900">Progresi</h1>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm md:text-base">
                Dashboard
              </Link>
              <Link href="/dashboard/reports" className="text-blue-600 font-medium text-sm md:text-base">
                Reports
              </Link>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-gray-700 text-sm hidden sm:inline">{session.user?.email}</span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-3">{session.user?.email}</p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1 text-center text-gray-600 hover:text-gray-900 py-2 bg-gray-50 rounded-lg">
                Dashboard
              </Link>
              <Link href="/dashboard/reports" className="flex-1 text-center text-blue-600 font-medium py-2 bg-blue-50 rounded-lg">
                Reports
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Class Performance Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Subject Performance Bar Chart */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Subject Performance</h2>
            {subjectData.length > 0 ? (
              <div className="overflow-x-auto">
                <div style={{ minWidth: isMobile ? '280px' : 'auto' }}>
                  <BarChart width={barChartWidth} height={chartHeight} data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis domain={[1, 4]} tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                    <Bar dataKey="average" fill="#3B82F6" name="Average Level (1-4)" />
                  </BarChart>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
            )}
          </div>

          {/* Level Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Proficiency Distribution</h2>
            {levelDistribution.length > 0 ? (
              <div className="flex justify-center">
                <PieChart width={pieChartWidth} height={chartHeight}>
                  <Pie
                    data={levelDistribution}
                    cx={pieChartWidth / 2}
                    cy={chartHeight / 2}
                    labelLine={false}
                    label={({ name, percent }) => {
                      const percentage = percent ? Math.round(percent * 100) : 0
                      return isMobile ? `${percentage}%` : `${name}: ${percentage}%`
                    }}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {levelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
            )}
          </div>
        </div>

        {/* Progress Over Time Line Chart */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Progress Over Time</h2>
          {progressData.length > 0 ? (
            <div className="overflow-x-auto">
              <div style={{ minWidth: isMobile ? '300px' : 'auto' }}>
                <LineChart width={lineChartWidth} height={chartHeight} data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: isMobile ? 9 : 12 }} />
                  <YAxis domain={[1, 4]} tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Line type="monotone" dataKey="average" stroke="#3B82F6" name="Class Average Level" />
                </LineChart>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
          )}
        </div>
      </div>
    </div>
  )
}