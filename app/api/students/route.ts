import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { name, grade, stream } = await request.json()
    
    if (!name || !grade) {
      return NextResponse.json({ error: "Name and grade are required" }, { status: 400 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        grade,
        stream: stream || null,
        teacherId: teacher.id,
      }
    })
    
    return NextResponse.json({ student }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { students: true }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    return NextResponse.json({ students: teacher.students })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

// Update student
export async function PUT(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, name, grade, stream } = await request.json()

    if (!id || !name || !grade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify student belongs to this teacher
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { students: true }
    })

    const student = teacher?.students.find(s => s.id === id)

    if (!student) {
      return NextResponse.json({ error: "Student not found or unauthorized" }, {
        status: 404 
      })
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name,
        grade,
        stream: stream || null,
      }
    })

    return NextResponse.json({ student: updatedStudent })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

//Delete student
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 })
    }

    //Verify student belongs to this teacher
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { students: true }
    })

    const student = teacher?.students.find(s => s.id === id)

    if (!student) {
      return NextResponse.json({ error: "Student not found or unauthorized" }, { status: 404 })
    }

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}