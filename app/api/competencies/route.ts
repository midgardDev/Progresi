import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { studentId, subject, competency, level, notes } = await request.json()
    
    if (!studentId || !subject || !competency || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Verify the student belongs to this teacher
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { students: true }
    })
    
    const student = teacher?.students.find(s => s.id === studentId)
    
    if (!student) {
      return NextResponse.json({ error: "Student not found or unauthorized" }, { status: 404 })
    }
    
    // Create competency record
    const competencyRecord = await prisma.competencyRecord.create({
      data: {
        studentId,
        subject,
        competency,
        level: parseInt(level),
        notes: notes || null,
      }
    })
    
    return NextResponse.json({ competencyRecord }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to record competency" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: {
        students: {
          include: {
            competencies: true
          }
        }
      }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    // If studentId provided, return only that student's competencies
    if (studentId) {
      const student = teacher.students.find(s => s.id === studentId)
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }
      return NextResponse.json({ competencies: student.competencies })
    }
    
    // Otherwise return all students with their competencies
    return NextResponse.json({ students: teacher.students })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch competencies" }, { status: 500 })
  }
}