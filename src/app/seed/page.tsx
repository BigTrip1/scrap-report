import { Button } from '@nextui-org/react'
import { auth } from '@/auth'

import { FaRegSmile } from 'react-icons/fa'
import { seedDB } from '../actions/dbSeedActions'
import MainHeader from '@/components/layout/MainHeader'
import { getLoggedInUser } from '../actions/authActions'

const SeedDbPage = async () => {
  const session = await auth()
  const loggedInUnser = await getLoggedInUser()

  const seedTheBd = async () => {
    'use server'
    try {
      await seedDB()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <MainHeader mainText='Seed MongoDb' subText='Info' />

      <div className='mt-2 mb-12'>
        <form action={seedTheBd}>
          <Button type='submit' className='bg-green-500'>
            Seed DB <FaRegSmile size={20} />
          </Button>
        </form>
      </div>
      <div className='flex gap-8'>
        <div>
          <h3 className='text-2xl font-semibold mb-2'>Logged in user data:</h3>
          {loggedInUnser ? (
            <div>
              <pre>{JSON.stringify(loggedInUnser, null, 2)}</pre>
            </div>
          ) : (
            <div>Not logged in</div>
          )}
        </div>
        <div>
          <h3 className='text-2xl font-semibold'>User session data:</h3>
          {session ? (
            <div>
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
          ) : (
            <div>Not signed in</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SeedDbPage
