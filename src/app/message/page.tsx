'use client'
import React, { useEffect, useState } from 'react'

import socket from '@/lib/socket'

import MainHeader from '@/components/layout/MainHeader'

import { Spinner } from '@nextui-org/react'
const MessagePage = () => {
  const [updating, setUpating] = useState(false)

  useEffect(() => {
    socket.on('dpuUpdating', (data) => {
      console.log('Recieved from SERVER ::', data)
      // Execute any command
      setUpating(data)
    })
    return () => {
      socket.off('dpuUpdating') // This represents the unmount function.
    }
  }, [socket])

  return (
    <div>
      <MainHeader mainText='Socket test page' subText='Info' />
      <div className='text-center w-100 mt-10 text-2xl'>
        {updating ? (
          <div className='text-center w-100 flex justify-center'>
            <div>
              <Spinner size='lg' color='danger' />
              <div>Updating DPU report please wait....</div>
            </div>
          </div>
        ) : (
          <div>Report OK</div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
