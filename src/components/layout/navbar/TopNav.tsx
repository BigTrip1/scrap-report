import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react'
import Link from 'next/link'

import { auth } from '@/auth'
import UserMenu from './UserMenu'
import Image from 'next/image'
import { getLoggedInUser } from '@/app/actions/authActions'

import NavButtons from './NavButtons'

const TopNav = async () => {
  const session = await auth()
  const userInfo = session?.user && (await getLoggedInUser())

  return (
    <Navbar
      maxWidth='full'
      isBordered
      isBlurred={false}
      className='bg-jcb h-[40px] w-full '
      classNames={{
        item: ['text-xl', 'text-black', 'uppercase', 'data-[active=true]:text-black'],
      }}
    >
      <div className='h-10 flex justify-start ml-2 gap-4'>
        <NavbarBrand as={Link} href='/'>
          <Image src={`/images/logos/jcb-logo.png`} alt='Jcb logo' width={77} height={26} />
        </NavbarBrand>
        <NavButtons />
      </div>

      <NavbarContent justify='end'>
        {userInfo ? (
          <UserMenu userInfo={userInfo} />
        ) : (
          <div className='flex gap-3 text-black font-LatoBold'>
            {/* <NavLink href='/login' label='Login' /> */}
            <Link href='/login'>Login</Link>
            <Link href='/register'>Sign Up</Link>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default TopNav
