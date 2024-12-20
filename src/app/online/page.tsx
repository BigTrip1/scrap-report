'use client'

import socket from '@/lib/socket'
import { useEffect, useState } from 'react'

const ActiveUsersPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    socket.on('activeUsers', (data) => {
      console.log('Recieved from SERVER ::', data)
      // Execute any command
      setOnlineUsers(data)
    })
  }, [socket])
  return (
    <div>
      <div>Active Users</div>
      {onlineUsers && onlineUsers.length > 0 && onlineUsers.map((user) => <div key={user}>hello</div>)}
    </div>
  )
}

export default ActiveUsersPage
