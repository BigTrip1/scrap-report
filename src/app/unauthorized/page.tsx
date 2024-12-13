import Link from 'next/link'

import { FaHandMiddleFinger } from 'react-icons/fa'
import { BiSolidNoEntry } from 'react-icons/bi'
import { Button } from '@nextui-org/react'

const UnauthorizedPage = () => {
  return (
    <section className=' flex-grow '>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='px-6 py-24 mb-4 shadow-md rounded-md  m-4 md:m-0'>
          <div className='flex justify-center'>
            {/* <FaHandMiddleFinger className='text-jcb text-8xl' /> */}
            <BiSolidNoEntry className='text-8xl ' color='red' />
          </div>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mt-4 mb-3'>Unauthorized</h1>
            <p className='text-md mb-10'>You do not have the required access for page you are looking for.</p>
            <Button as={Link} href='/' className='hover:bg-jcb text-black font-LatoBold font-bold py-3 px-4 rounded'>
              Go Home
            </Button>
          </div>
        </div>
      </div>
      <div className='flex-grow'></div>
    </section>
  )
}
export default UnauthorizedPage
