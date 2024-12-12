'use client'

import { signOutUser } from '@/app/actions/authActions'
import { capitalizeFirstLetterOfAllWords } from '@/lib/helper_functions'
import { FaCaretDown } from 'react-icons/fa'
import { IDivision, IUser } from '@/types'

import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'

import Link from 'next/link'

type Props = {
  userInfo: IUser
}

const UserMenu = ({ userInfo }: Props) => {
  return (
    <>
      <Dropdown placement='bottom-end' className='text-black '>
        <DropdownTrigger className='cursor-pointer'>
          <div className='font-LatoBold text-black flex'>
            <span>Options</span>
            <span className='mt-1'>
              <FaCaretDown size={18} />
            </span>
          </div>
        </DropdownTrigger>
        <DropdownMenu variant='flat' aria-label='User actions menu'>
          {userInfo?.divisions.length > 0 ? (
            <DropdownSection showDivider>
              {userInfo?.divisions
                .filter((elem) => elem.roles.includes('dpu admin'))
                .map((division: IDivision) => (
                  <DropdownItem key={division.name} as={Link} href={`/admin/${division.name}`}>
                    {division.name} Admin
                  </DropdownItem>
                ))}
            </DropdownSection>
          ) : (
            <DropdownItem hidden></DropdownItem>
          )}

          <DropdownItem color='danger' onClick={async () => signOutUser()}>
            Log out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className='font-LatoBold text-black'>Signed in as {capitalizeFirstLetterOfAllWords(userInfo?.name)}</div>
    </>
  )
}

export default UserMenu
