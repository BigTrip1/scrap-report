import { NextResponse } from 'next/server'

import connectDB from '@/lib/db'
import User from '@/models/User'
import { IUser } from '@/types'
import socket from '@/lib/socket'
// api/user/fetch-by-email
export async function POST(req: Request) {
  await connectDB()

  const { email } = await req.json()

  const user = await User.findOne({ email })

  if (user) {
    socket.emit('active', user._id)
    const userObject: IUser = {
      ...user.toObject(),
      _id: user._id.toString(),
    }
    return NextResponse.json(userObject)
  } else {
    return NextResponse.json(null)
  }
}
