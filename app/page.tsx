import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Progresi</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-blue-50 px-4 pt-20 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-blue-800 text-xs font-medium mb-6 border border-blue-200">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          CBC Assessment Made Simple
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Track CBC Competencies
        </h1>
        <h1 className="text-5xl font-bold tracking-tight text-blue-600 leading-tight mb-5">
          With Ease &amp; Confidence
        </h1>

        <p className="max-w-2xl mx-auto text-base text-gray-500 leading-relaxed mb-10">
          Progresi helps teachers record, track, and report student competencies
          under the Competency-Based Curriculum. Save time, reduce paperwork, and focus on teaching.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-8 py-16">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-2">
          Everything you need
        </p>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Built for Kenyan teachers
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Student Management */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
            <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="inline-block text-xs font-medium text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full mb-3">
              Students
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Student Management</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Add, organize, and track all your students in one place. Group by grade and stream.
            </p>
          </div>

          {/* Competency Tracking */}
          <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-200 group relative">
            <div className="absolute -top-px right-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-b-lg">
              Most used
            </div>
            <div className="w-11 h-11 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="inline-block text-xs font-medium text-green-800 bg-green-50 px-2.5 py-0.5 rounded-full mb-3">
              Tracking
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Competency Tracking</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Record individual competencies across all subjects with proficiency levels.
            </p>
          </div>

          {/* Progress Reports */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-200 group">
            <div className="w-11 h-11 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="inline-block text-xs font-medium text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full mb-3">
              Reports
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Progress Reports</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate beautiful charts and reports to visualize student progress over time.
            </p>
          </div>

        </div>
      </div>

      {/* Stats Banner */}
      <div className="w-full bg-blue-600 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8 mt-auto">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Join Thousands of Teachers</h3>
          <p className="text-blue-200 text-sm">Making CBC assessment easier across the country</p>
        </div>

        <div className="flex items-center gap-10 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-xs text-blue-200 mt-0.5">Teachers</div>
          </div>
          <div className="w-px h-10 bg-blue-500" />
          <div className="text-center">
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-xs text-blue-200 mt-0.5">Students</div>
          </div>
          <div className="w-px h-10 bg-blue-500" />
          <div className="text-center">
            <div className="text-3xl font-bold">50,000+</div>
            <div className="text-xs text-blue-200 mt-0.5">Assessments</div>
          </div>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition shrink-0"
        >
          Get Started
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

    </div>
  )
}