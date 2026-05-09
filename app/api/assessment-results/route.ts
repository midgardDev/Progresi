import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { assessmentId, scores } = await request.json()
    
    if (!assessmentId || !scores || !Array.isArray(scores)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    // Get the assessment to check total possible
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    })
    
    if (!assessment || assessment.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Assessment not found or unauthorized" }, { status: 404 })
    }
    
    // Create results for each student
    const results = await Promise.all(
      scores.map(({ studentId, score }) =>
        prisma.assessmentResult.create({
          data: {
            assessmentId,
            studentId,
            score,
            totalPossible: 100
          }
        })
      )
    )
    
    return NextResponse.json({ results }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to record scores" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: {
        assessments: {
          include: {
            results: {
              include: {
                student: true
              }
            }
          }
        }
      }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    return NextResponse.json({ assessments: teacher.assessments })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}