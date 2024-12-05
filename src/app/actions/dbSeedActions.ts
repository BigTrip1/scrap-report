'use server'

import User from '@/models/User'
import { userData } from '@/db_seed_data/userData'
import bcrypt from 'bcryptjs'
import socket from '@/socket'
import axios from 'axios'
import connectDB from '@/lib/db'

export const seedDB = async () => {
  await connectDB()
  try {
    // ? web socket test start
    console.log('started')
    socket.emit('dpuUpdating', true)

    setTimeout(function () {
      console.log('finished')
      socket.emit('dpuUpdating', false)
    }, 3000)

    // ? web socket test end

    // ? post to backend test start
    // let link = `${process.env.BACKEND_SERVER_HOST}/send-email`
    // // let link = `http://172.30.60.22:3001/send-email`

    // const data = {
    //   message: 'ok',
    // }

    // try {
    //   const response = await axios.post(link, data)

    //   console.log(response.data)
    // } catch (error) {
    //   console.log(error)
    // }

    // ? post to backend test end

    // !seed users
    const usersExist = await User.findOne({})
    if (!usersExist) {
      for (const user of userData) {
        const hashedPassword = await bcrypt.hash('password', 10)
        const data = {
          ...user,
          password: hashedPassword,
        }
        await User.create(data)
      }
    }

    return { success: true }
  } catch (error) {
    console.log(error)
    throw error
  }
}
