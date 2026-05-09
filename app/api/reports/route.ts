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
            competencies: true
          }
        }
      }
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    // Subject Performance 
    const subjectMap = new Map()
    teacher.students.forEach(student => {
      student.competencies.forEach(comp => {
        if (!subjectMap.has(comp.subject)) {
          subjectMap.set(comp.subject, { total: 0, count: 0 })
        }
        const data = subjectMap.get(comp.subject)
        data.total += comp.level
        data.count += 1
      })
    })
    
    const subjectPerformance = Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      average: Number((data.total / data.count).toFixed(2))
    }))
    
    // Level Distribution
    const levelMap = new Map()
    teacher.students.forEach(student => {
      student.competencies.forEach(comp => {
        const level = comp.level
        levelMap.set(level, (levelMap.get(level) || 0) + 1)
      })
    })
    
    const levelDistribution = Array.from(levelMap.entries()).map(([level, count]) => ({
      name: `Level ${level}`,
      value: count
    }))
    
    // Progress Over Time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentCompetencies = teacher.students.flatMap(student =>
      student.competencies.filter(comp => comp.createdAt >= thirtyDaysAgo)
    )
    
    const dailyAverages = new Map()
    recentCompetencies.forEach(comp => {
      const date = comp.createdAt.toISOString().split('T')[0]
      if (!dailyAverages.has(date)) {
        dailyAverages.set(date, { total: 0, count: 0 })
      }
      const data = dailyAverages.get(date)
      data.total += comp.level
      data.count += 1
    })
    
    const progressOverTime = Array.from(dailyAverages.entries())
      .map(([date, data]) => ({
        date,
        average: Number((data.total / data.count).toFixed(2))
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return NextResponse.json({
      subjectPerformance,
      levelDistribution,
      progressOverTime
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 })
  }
}