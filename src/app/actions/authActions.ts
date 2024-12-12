'use server'

import { registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { ActionResult } from '@/types'
import { LoginSchema } from '@/lib/schemas/loginSchema'
import { signIn, signOut, auth } from '@/auth'
import { AuthError } from 'next-auth'

import { IUser } from '@/types'
// import { generateToken } from '@/lib/tokens'
import { isJcbEmail, stringifyForComponent } from '@/lib/helper_functions'
import { generateToken } from '@/lib/token'
// import { sendVerificationEmail } from '@/lib/mail'
import connectDB from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'

// import { sendVerificationEmail } from '@/lib/mail'

export const signInUser = async (data: LoginSchema): Promise<ActionResult<string>> => {
  try {
    await connectDB()
    const existingUser = await User.findOne({ email: data.email })

    if (!existingUser) return { status: 'error', error: 'Invalid credentials' }

    // if (!existingUser.emailVerified) {
    // 	const token = generateToken(1)

    // 	await User.findByIdAndUpdate(existingUser._id, {
    // 		varificationToken: token.string,
    // 		varificationTokenExpires: token.expires,
    // 	})
    // 	await sendVerificationEmail(data.email, token.string)

    // 	return { status: 'error', error: 'Please verify email address' }
    // }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return {
      status: 'success',
      data: 'Logged in',
    }
  } catch (error) {
    // console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
        case 'CallbackRouteError':
          return { status: 'error', error: 'Invalid credentials' }
        default:
          return { status: 'error', error: 'Something went wrong' }
      }
    } else {
      return { status: 'error', error: 'Something else went wrong' }
    }
  }
}

export const signOutUser = async () => {
  await connectDB()
  await signOut({ redirectTo: '/' })
}

export const registerUser = async (data: RegisterSchema): Promise<ActionResult<IUser>> => {
  try {
    await connectDB()
    const validated = registerSchema.safeParse(data)

    if (!validated.success) {
      return { status: 'error', error: validated.error.errors }
    }

    const { name, email, password } = validated.data

    if (!isJcbEmail(email)) return { status: 'error', error: 'Must be a JCB email address' }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await User.findOne({ email })

    if (existingUser) return { status: 'error', error: 'Email already in use' }

    const token = generateToken(1)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      varificationToken: token.string,
      varificationTokenExpires: token.expires,
    })

    // TODO: send email for varification

    await sendVerificationEmail(data.email, token.string)

    return {
      status: 'success',
      data: stringifyForComponent(user),
    }
  } catch (error) {
    console.log(error)
    return { status: 'error', error: 'Something went wrong' }
  }
}

export const getUserByEmail = async (email: string) => {
  await connectDB()
  const user = await User.findOne({ email })
  return stringifyForComponent(user)
}

export const getLoggedInUser = async () => {
  await connectDB()
  const session = await auth()

  if (!session || !session?.user?.id) {
    return null
  }

  const foundUser = await User.findById(session.user.id)

  return stringifyForComponent(foundUser) as IUser
}

export const verifyEmail = async (token: string): Promise<ActionResult<string>> => {
  try {
    await connectDB()
    const foundUser = await User.findOne({ varificationToken: token })

    if (!foundUser) return { status: 'error', error: 'Invalid token' }

    const hasExpired = new Date() > foundUser.varificationTokenExpires

    if (hasExpired) return { status: 'error', error: 'Token has expired' }

    await User.findByIdAndUpdate(foundUser._id, {
      emailVerified: true,
      emailVerifiedAt: Date.now(),
      varificationToken: null,
      varificationTokenExpires: null,
    })

    return { status: 'success', data: 'Success' }
  } catch (error) {
    console.log(error)
    throw error
    // return { status: 'error', error: 'Something went wrong' }
  }
}
