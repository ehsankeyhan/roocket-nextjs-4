// import useAuth from '../../hooks/useAuth'
'use client'

import React, { Fragment } from 'react'
import MenuDots from '../../assets/icons/MenuDots'
import ProfileAvatar from '../profile/ProfileAvatar'
import { Menu, MenuButton, MenuItem, MenuItems,Transition } from '@headlessui/react'

import Item from './MenuItems'
import useAuth from '../../hooks/useAuth';





export default function MainMenu() {

  const {token,handleLogout}= useAuth()


  if (!token){
    return null
  }



  return (
    <div className='w-full h-14 fixed z-50 backdrop-blur-lg bg-neutral-600 bg-opacity-20  '>
        <div className='flex justify-between h-full items-center'>
            <h1 className=' ml-10 text-white tracking-wide font-semibold text-xl'>
                iAdmin
            </h1>
            <div className='flex items-center  gap-x-5 mx-5'>
            <Menu as="div">
                <MenuButton className='relative hover:bg-neutral-600 hover:bg-opacity-20 py-1 px-2 rounded-lg  '>
                    <MenuDots />
                </MenuButton>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-300"
                    enterFrom="transform opacity-0 scale-110"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <div className={`right-24  top-[3.2rem] grid grid-cols-3 gap-x-3 p-4 max-w-72 mx-auto absolute  bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out`}>
                        <Item name='Dashboard' />
                        <Item name='Articles' />
                    </div>
                </Transition>
            </Menu>
            
            <Menu as="div" className=''>
                <MenuButton className='h-12 w-14 px-2 py-1 hover:bg-opacity-20 rounded-lg hover:bg-neutral-600'>
                    <ProfileAvatar />
                </MenuButton>
                <Transition
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-110"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                >
                    <div className='absolute right-0 mr-5 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
                            <button
                            className={`hover:bg-gray-200 text-red-500 flex w-full font-semibold items-center justify-center rounded-md px-2 py-2 `}
                            onClick={handleLogout}
                            >
                            LogOut
                            </button>
                    </div>
                </Transition>
            </Menu>
        </div>
    </div>
    </div>
  )
}
