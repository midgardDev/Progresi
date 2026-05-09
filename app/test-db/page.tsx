import prisma from '@/lib/prisma'

export default async function TestDatabasePage() {

  let teacherCount = 0
  let error = null
  
  try {
    teacherCount = await prisma.teacher.count()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error connecting to database:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Check your .env DATABASE_URL and make sure Supabase is running.
          </p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">✅ Database connected successfully!</p>
          <p>Current teacher count: {teacherCount}</p>
          <p className="mt-2 text-sm">Your database is ready to go.</p>
        </div>
      )}
      
      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
      </div>
    </div>
  )
}