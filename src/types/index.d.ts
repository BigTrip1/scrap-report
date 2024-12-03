import { ZodIssue } from 'zod'
import { Types, Document, PopulatedDoc } from 'mongoose'

type ActionResult<T> = { status: 'success'; data: T } | { status: 'error'; error: string | ZodIssue[] }

// Subdocument definition
interface IDivision {
  name: string
  roles: string[]
}

export interface IUser extends Document {
  email: string
  password: string
  name: string
  app: string
  divisions: IDivision[]
  emailVerified: boolean
  emailVerifiedAt?: Date
  varificationToken?: string
  varificationTokenExpires?: Date
  resetToken?: string
  resetTokenExpires?: string
  lastActive: Date
  canUpload: boolean
  // common
  _id: string
  createdAt: Date
  updatedAt: Date
}
