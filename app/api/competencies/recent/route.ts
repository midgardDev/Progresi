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
            competencies: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }
      }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    // Flatten competencies from all students
    const recentCompetencies = teacher.students.flatMap(student => 
      student.competencies.map(comp => ({
        ...comp,
        studentName: student.name
      }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ competencies: recentCompetencies })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch competencies" }, { status: 500 })
  }
}