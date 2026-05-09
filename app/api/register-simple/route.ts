import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received registration data:", body)
    
    return NextResponse.json({ 
      message: "Registration received (database not connected yet)" 
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}