import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface StudentReport {
  name: string
  grade: string
  competencies: {
    subject: string
    competency: string
    level: number
    date: string
  }[]
  assessments: {
    title: string
    score: number
    totalPossible: number
    date: string
  }[]
}

export const exportStudentReport = (student: StudentReport, schoolName: string = "Progresi CBC Tracker") => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 51, 102)
  doc.text("Progresi - Student Progress Report", 105, 20, { align: "center" })
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })
  
  // Student Info
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Student Name: ${student.name}`, 20, 50)
  doc.text(`Grade: ${student.grade}`, 20, 60)
  doc.text(`School: ${schoolName}`, 20, 70)
  
  // Competencies Table
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Competency Assessment", 20, 90)
  
  const competencyData = student.competencies.map(c => [
    c.date,
    c.subject,
    c.competency,
    `Level ${c.level}`,
  ])
  
  autoTable(doc, {
    startY: 95,
    head: [["Date", "Subject", "Competency", "Level"]],
    body: competencyData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 70 },
      3: { cellWidth: 30 },
    },
  })
  
  // Assessments Table
  let finalY = (doc as any).lastAutoTable?.finalY || 110
  finalY += 20
  
  doc.setFontSize(14)
  doc.setTextColor(0, 51, 102)
  doc.text("Assessment Scores", 20, finalY)
  
  const assessmentData = student.assessments.map(a => [
    a.date,
    a.title,
    `${a.score}/${a.totalPossible}`,
    `${((a.score / a.totalPossible) * 100).toFixed(1)}%`,
  ])
  
  autoTable(doc, {
    startY: finalY + 5,
    head: [["Date", "Assessment", "Score", "Percentage"]],
    body: assessmentData,
    theme: "striped",
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Progresi - CBC Assessment Tracker | Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    )
  }
  
  doc.save(`${student.name.replace(/\s/g, "_")}_Progress_Report.pdf`)
}

export const exportClassReport = (
  students: { name: string; grade: string; competencyCount: number; assessmentAvg: number }[],
  className: string
) => {
  const doc = new jsPDF()
  
  doc.setFontSize(20)
  doc.setTextColor(0, 51, 102)
  doc.text("Progresi - Class Summary Report", 105, 20, { align: "center" })
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" })
  doc.text(`Class: ${className}`, 105, 40, { align: "center" })
  
  const classData = students.map(s => [
    s.name,
    s.grade,
    s.competencyCount.toString(),
    s.assessmentAvg.toFixed(1),
  ])
  
  autoTable(doc, {
    startY: 55,
    head: [["Student Name", "Grade", "Competencies", "Avg Score (%)"]],
    body: classData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  })
  
  doc.save(`${className.replace(/\s/g, "_")}_Class_Report.pdf`)
}