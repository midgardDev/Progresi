"use client"

import { useState, useEffect } from "react"

interface Student {
  id: string
  name: string
}

interface Assessment {
  id: string
  title: string
  totalPossible: number
  date?: string | Date
}

interface RecordScoresModalProps {
  isOpen: boolean
  onClose: () => void
  onScoresRecorded: () => void
  students: Student[]
  assessments: Assessment[]
}

export default function RecordScoresModal({ 
  isOpen, 
  onClose, 
  onScoresRecorded,
  students,
  assessments
}: RecordScoresModalProps) {
  const [selectedAssessment, setSelectedAssessment] = useState("")
  const [scores, setScores] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleScoreChange = (studentId: string, score: string) => {
    setScores(prev => ({ ...prev, [studentId]: score }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAssessment) {
      setError("Please select an assessment")
      return
    }
    
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/assessment-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: selectedAssessment,
          scores: Object.entries(scores).map(([studentId, score]) => ({
            studentId,
            score: parseInt(score) || 0
          }))
        }),
      })

      if (response.ok) {
        setScores({})
        setSelectedAssessment("")
        onScoresRecorded()
        onClose()
        alert("Scores recorded successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to record scores")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedAssessmentData = assessments.find(a => a.id === selectedAssessment)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Record Assessment Scores</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Assessment
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an assessment...</option>
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title} ({assessment.date ? new Date(assessment.date).toLocaleDateString() : 'No date'})
                </option>
              ))}
            </select>
          </div>
          
          {selectedAssessmentData && (
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                Maximum score: {selectedAssessmentData.totalPossible} marks
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Student Scores</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {student.name}
                  </label>
                  <input
                    type="number"
                    value={scores[student.id] || ""}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    placeholder="Score"
                    className="w-32 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record All Scores"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}