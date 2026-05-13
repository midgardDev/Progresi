# Progresi - CBC Competency Tracker for Teachers

**Progresi** is a full-stack web application that helps teachers track student competencies under the Competency-Based Curriculum (CBC). Record assessments, generate reports, and monitor student progress.

## Features

**Authentication** - Secure login and registration for teachers
**Student Management** - Add, edit, and delete students by grade and stream
**Competency Tracking** - Record CBC Competencies across all subjects with proficiency levels
**Assessment Management** - Create formal tests and record scores for students
**Reports and Analytics** - Visual charts showing class performance and student progress
**PDF Export** - Generate individual student reports and class summaries
**Responsive Design** - Works perfectly on desktop, tablet and mobile devices

## Tech Stack

Framework: Next.js 16
Language - Typescript
Database - PostgreSQL (Superbase)
ORM - Prisma 5
Authentication - NextAuth.js
Styling - Tailwind CSS
Charts - Recharts
PDF Generation - jsPDF + autoTable
Deployment - Vercel

## Installation

## Preriquisites

- Node.js 18+
- PostgreSQL database (Superbase recommended)

### Setup steps

```bash
# Clone the repository
git clone https://github.com/midgardDev/Progresi.git
cd Progresi

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following:
DATABASE_URL="postgresql://your-db-url:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://your-db-url:5432/postgres"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Set up the database
npx prisma db push
npx prisma generate

# Run the developmemt server
npm run dev

open http://localhost:3000 to view the app.

# Contributions
- Fork the repository
- Create your feature branch
- Commit your changes
- Push to the branch
- Open a Pull Request
```
