"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AddStudentModal from "@/components/AddStudentModal"
import RecordCompetencyModal from "@/components/RecordCompetencyModal"
import Link from "next/link"
import CreateAssessmentModal from "@/components/AssessmentModal"
import RecordScoresModal from "@/components/ResultsModal"
import EditStudentModal from "@/components/EditStudentModal"
import EditAssessmentModal from "@/components/EditAssessmentModal"
import { exportStudentReport, exportClassReport } from "@/lib/pdfExport"

interface Student {
  id: string
  name: string
  grade: string
  stream: string | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompetencyModalOpen, setIsCompetencyModalOpen] = useState(false)
  const [recentCompetencies, setRecentCompetencies] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isScoresModalOpen, setIsScoresModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<any>(null)
  const [isEditingAssessmentModalOpen, setIsEditingAssessmentModalOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentCompetencies = async () => {
    try {
      const response = await fetch("/api/competencies/recent")
      if (response.ok) {
        const data = await response.json()
        setRecentCompetencies(data.competencies || [])
      }
    } catch (error) {
      console.error("Failed to fetch competencies:", error)
    }
  }

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.assessments || [])
      }
    } catch (error) {
      console.error("Failed to fetch assessments:", error)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student? This will also delete all their competency records and assessment results.")) {
      return
    }

    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchStudents()
        alert("Student deleted successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete student")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Network error. Please try again.")
    }
  }

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment? This will also delete all scores associated with it.")) {
      return
    }

    try {
      const response = await fetch(`/api/assessments?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAssessments()
        alert("Assessment deleted successfully!")
      } else {
        alert("Failed to delete assessment")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleExportClassReport = async () => {
    try {
      const response = await fetch("/api/reports/class")
      if (response.ok) {
        const data = await response.json()
        exportClassReport(data.students, "My Class")
      } else {
        alert("Failed to generate class report")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  const handleExportStudentReport = async (student: Student) => {
    try {
      const response = await fetch(`/api/reports/student?id=${student.id}`)
      if (response.ok) {
        const data = await response.json()
        exportStudentReport(data, "CBC")
      } else {
        alert("Failed to generate student report")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    }
  }

  useEffect(() => {
    if (session) {
      fetchStudents()
      fetchRecentCompetencies()
      fetchAssessments()
    }
  }, [session])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4 md:space-x-6">
              <h1 className="text-lg md:text-xl font-bold text-blue-900">Progresi</h1>
              <Link href="/dashboard" className="text-blue-600 font-medium text-sm md:text-base">
                Dashboard
              </Link>
              <Link href="/dashboard/reports" className="text-gray-600 hover:text-gray-900 text-sm md:text-base">
                Reports
              </Link>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-gray-700 text-sm hidden sm:inline">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Welcome, {session.user?.name}!</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Manage your students and track CBC competencies
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportClassReport}
                className="bg-purple-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-purple-700 text-sm flex-1 sm:flex-auto"
              >
                Export Class Report
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-blue-700 text-sm flex-1 sm:flex-auto"
              >
                + Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b">
            <h3 className="text-base md:text-lg font-semibold">My Students</h3>
          </div>
          
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students added yet. Click "Add Student" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[600px] md:min-w-full w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                      Stream
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {student.name}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.grade}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                        {student.stream || "-"}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleExportStudentReport(student)}
                            className="text-purple-600 hover:text-purple-800 text-xs md:text-sm"
                          >
                            Export
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student)
                              setIsEditingModalOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs md:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Competency Summary Section */}
        {students.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base md:text-lg font-semibold">Competency Tracking</h3>
                <button
                  onClick={() => setIsCompetencyModalOpen(true)}
                  className="bg-green-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-green-700 text-sm w-full sm:w-auto"
                >
                  + Record Competency
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.slice(0, 6).map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{student.name}</h4>
                    <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setIsCompetencyModalOpen(true)
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Record Assessment →
                    </button>
                  </div>
                ))}
              </div>
              
              {students.length > 6 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  + {students.length - 6} more students
                </p>
              )}
            </div>
          </div>
        )}

        {/* Assessment Management Section */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-4 md:px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-base md:text-lg font-semibold">Assessments & Exams</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="bg-blue-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-blue-700 text-sm flex-1 sm:flex-auto"
                >
                  Create Assessment
                </button>
                <button
                  onClick={() => setIsScoresModalOpen(true)}
                  className="bg-green-600 text-white px-3 py-2 md:px-4 rounded-lg hover:bg-green-700 text-sm flex-1 sm:flex-auto"
                >
                  Record Scores
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {assessments.length === 0 ? (
              <p className="text-gray-500 text-center">No assessments created yet. Click "Create Assessment" to start.</p>
            ) : (
              <div className="space-y-4">
                {assessments.slice(0, 5).map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">{assessment.title}</h4>
                        <p className="text-sm text-gray-600">{assessment.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Date: {new Date(assessment.date).toLocaleDateString()} |
                          Students graded: {assessment.results?.length || 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAssessment(assessment)
                            setIsEditingAssessmentModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 text-xs md:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(assessment.id)}
                          className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Assessments Section */}
        {recentCompetencies.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-4 md:px-6 py-4 border-b">
              <h3 className="text-base md:text-lg font-semibold">Recent Assessments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentCompetencies.slice(0, 5).map((comp: any) => {
                const student = students.find(s => s.id === comp.studentId)
                return (
                  <div key={comp.id} className="px-4 md:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">
                          {student?.name || "Unknown Student"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {comp.subject} - {comp.competency}
                        </p>
                        {comp.notes && (
                          <p className="text-sm text-gray-500 mt-1">{comp.notes}</p>
                        )}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comp.level === 4 ? "bg-green-100 text-green-800" :
                          comp.level === 3 ? "bg-blue-100 text-blue-800" :
                          comp.level === 2 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          Level {comp.level}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentAdded={fetchStudents}
      />

      <RecordCompetencyModal
        isOpen={isCompetencyModalOpen}
        onClose={() => {
          setIsCompetencyModalOpen(false)
          setSelectedStudent(null)
        }}
        onCompetencyRecorded={fetchStudents}
        students={students}
      />

      <CreateAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onAssessmentCreated={() => {
          fetchAssessments()
          alert("Assessment created successfully!")
        }}
      />

      <RecordScoresModal
        isOpen={isScoresModalOpen}
        onClose={() => setIsScoresModalOpen(false)}
        onScoresRecorded={() => {
          fetchAssessments()
          fetchStudents()
        }}
        students={students}
        assessments={assessments}
      />

      <EditStudentModal 
        isOpen={isEditingModalOpen}
        onClose={() => {
          setIsEditingModalOpen(false)
          setEditingStudent(null)
        }}
        onStudentUpdated={fetchStudents}
        student={editingStudent}
      />

      <EditAssessmentModal
        isOpen={isEditingAssessmentModalOpen}
        onClose={() => {
          setIsEditingAssessmentModalOpen(false)
          setEditingAssessment(null)
        }}
        onAssessmentUpdated={fetchAssessments}
        assessment={editingAssessment}
      />
    </div>
  )
}