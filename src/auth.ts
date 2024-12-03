// declare module 'next-auth' {
// 	interface User {
// 		Add your additional properties here:
// 		givenName?: string | null
// 		preferLanguage?: string | null
// 	}
// }

// import NextAuth from 'next-auth'

// import authConfig from '@/auth.config'

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   trustHost: true,

//   session: { strategy: 'jwt' },
//   ...authConfig,
// })

import NextAuth from 'next-auth'

import authConfig from '@/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  ...authConfig,
})
