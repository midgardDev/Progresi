import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: {
        students: {
          include: {
            competencies: true,
            assessmentResults: true
          }
        }
      }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    const studentsData = teacher.students.map(student => {
      const competencyCount = student.competencies.length
      const avgScore = student.assessmentResults.length > 0
        ? student.assessmentResults.reduce((sum, ar) => sum + (ar.score || 0), 0) / student.assessmentResults.length
        : 0
      
      return {
        name: student.name,
        grade: student.grade,
        competencyCount,
        assessmentAvg: avgScore
      }
    })
    
    return NextResponse.json({ students: studentsData })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch class report" }, { status: 500 })
  }
}