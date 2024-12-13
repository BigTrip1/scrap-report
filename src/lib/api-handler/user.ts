import { fetcher } from '@/lib/utils'

export const fetchUserByEmail = async (email: string) => {
  try {
    const user = await fetcher(`${process.env.BASE_URL}/api/user/fetch-by-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    // console.log({user})

    if (user) return user

    return null
  } catch {
    return null
  }
}

export const fetchUserById = async (id: string) => {
  try {
    const user = await fetcher(`${process.env.BASE_URL}/api/user/fetch-by-id`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
    // console.log({user})

    if (user) return user

    return null
  } catch {
    return null
  }
}
