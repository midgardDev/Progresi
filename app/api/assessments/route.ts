import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { title, subject, date } = await request.json()
    
    if (!title || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    const assessment = await prisma.assessment.create({
      data: {
        title,
        subject,
        date: new Date(date),
        teacherId: teacher.id,
      }
    })
    
    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    const assessments = await prisma.assessment.findMany({
      where: { teacherId: teacher.id },
      orderBy: { date: 'desc' },
      include: {
        results: true
      }
    })
    
    return NextResponse.json({ assessments })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}

// Update assessment
export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id, title, subject, date } = await request.json()
    
    if (!id || !title || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Verify assessment belongs to this teacher
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { assessments: true }
    })
    
    const assessment = teacher?.assessments.find(a => a.id === id)
    
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found or unauthorized" }, { status: 404 })
    }
    
    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data: {
        title,
        subject,
        date: new Date(date),
      }
    })
    
    return NextResponse.json({ assessment: updatedAssessment })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
  }
}

// Delete assessment
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (!id) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }
    
    // Verify assessment belongs to this teacher
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { assessments: true }
    })
    
    const assessment = teacher?.assessments.find(a => a.id === id)
    
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found or unauthorized" }, { status: 404 })
    }
    
    // Delete associated results 
    await prisma.assessmentResult.deleteMany({
      where: { assessmentId: id }
    })
    
    await prisma.assessment.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: "Assessment deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete assessment" }, { status: 500 })
  }
}
