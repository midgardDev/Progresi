import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const teacher = await prisma.teacher.findUnique({
          where: { email: credentials.email }
        })

        if (!teacher || !teacher.password) {
          throw new Error("No teacher found with this email")
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          teacher.password
        )

        if (!passwordMatch) {
          throw new Error("Invalid password")
        }

        return {
          id: teacher.id,
          email: teacher.email,
          name: teacher.name,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }