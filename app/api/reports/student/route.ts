import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("id")
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { students: true }
    })
    
    const student = teacher?.students.find(s => s.id === studentId)
    
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    
    // Get competencies
    const competencies = await prisma.competencyRecord.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    })
    
    // Get assessment results
    const assessmentResults = await prisma.assessmentResult.findMany({
      where: { studentId },
      include: { assessment: true },
      orderBy: { assessment: { date: 'desc' } }
    })
    
    const formattedCompetencies = competencies.map(c => ({
      subject: c.subject,
      competency: c.competency,
      level: c.level,
      date: c.date.toISOString().split('T')[0]
    }))
    
    const formattedAssessments = assessmentResults.map(ar => ({
      title: ar.assessment.title,
      score: ar.score || 0,
      totalPossible: ar.totalPossible || 100,
      date: ar.assessment.date.toISOString().split('T')[0]
    }))
    
    return NextResponse.json({
      name: student.name,
      grade: student.grade,
      competencies: formattedCompetencies,
      assessments: formattedAssessments
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch student report" }, { status: 500 })
  }
}