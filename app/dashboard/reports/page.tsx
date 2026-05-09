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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-blue-900">Progresi</h1>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/dashboard/reports" className="text-blue-600 font-medium">
                Reports
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Class Performance Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Subject Performance Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Subject Performance</h2>
            {subjectData.length > 0 ? (
              <BarChart width={500} height={300} data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[1, 4]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#3B82F6" name="Average Level (1-4)" />
              </BarChart>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
            )}
          </div>

          {/* Level Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Proficiency Distribution</h2>
            {levelDistribution.length > 0 ? (
              <PieChart width={400} height={300}>
                <Pie
                  data={levelDistribution}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => {
                    const percentage = percent ? Math.round(percent * 100) : 0
                    return `${name}: ${percentage}%`
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
            )}
          </div>
        </div>

        {/* Progress Over Time Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
          {progressData.length > 0 ? (
            <LineChart width={800} height={300} data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 4]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#3B82F6" name="Class Average Level" />
            </LineChart>
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet. Record competencies to see charts.</p>
          )}
        </div>
      </div>
    </div>
  )
}