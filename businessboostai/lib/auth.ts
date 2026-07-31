import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  pages: {
    signIn: "/Login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // In a real application, you would verify credentials against a database
        // For this MVP, we'll use a simple demo user
        if (credentials?.email === "demo@businessboost.ai" && credentials?.password === "demo123") {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@businessboost.ai",
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  // NEXTAUTH_URL is optional - NextAuth will use default if not set
}