'use client'

import { FaBackward } from 'react-icons/fa'
import { TiHome } from 'react-icons/ti'
import { useRouter } from 'next/navigation'

const NavButtons = () => {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }
  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className='flex gap-4'>
      <TiHome className='mt-1 cursor-pointer' size={28} color='black' onClick={handleGoHome} />

      <FaBackward className='mt-2 cursor-pointer  ' size={25} color='black' onClick={handleBackClick} />
    </div>
  )
}

export default NavButtons
