import prisma from '@/lib/prisma'
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, school, phone, password } = await request.json()

    // Check if teacher already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email }
    })

    if (existingTeacher) {
      return NextResponse.json(
        { error: "Teacher with this email already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the teacher
    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        school,
        phone,
        password: hashedPassword,
      }
    })

    // Don't send password back
    const { password: _, ...teacherWithoutPassword } = teacher

    return NextResponse.json(
      { message: "Teacher created successfully", teacher: teacherWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}