import { compare } from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'

import Credentials from 'next-auth/providers/credentials'

import { fetchUserByEmail } from '@/lib/api-handler/user'

import { loginSchema } from '@/lib/schemas/loginSchema'

export default {
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      // name: 'credentials',
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds)
        if (validated.success) {
          const { email, password } = validated.data
          const user = await fetchUserByEmail(email)
          if (!user || !(await compare(password, user.password))) return null
          return user
        }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await fetchUserByEmail(session.user.email)

      if (user && session.user) {
        session.user.id = user._id
      }
      return session
    },
  },
} satisfies NextAuthConfig
