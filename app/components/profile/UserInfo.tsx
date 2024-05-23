
'use client'
import React from 'react'
import CloudProfile from '../../assets/icons/CloudProfile'
import ProfileAvatar from './ProfileAvatar'
import useAuth from '@/app/hooks/useAuth'

export default function UserInfo() {
  const {user} = useAuth()
  console.log(user);
  
  return (
    <div className=' mb-10 py-3 h-80 w-80 cursor-pointer rounded-2xl shadow-2xl backdrop-blur-lg hover:scale-[1.03] transition-all duration-300 ease-in-out'  style={{background:'radial-gradient(circle at 100% 0, hsla(0, 0%, 100%, .85) 0, hsla(0, 0%, 96.1%, .13) 183%)'}}>
        <div className='w-48 h-48'>
            <CloudProfile />
            <div className='absolute w-28 top-10 left-8'>
                <ProfileAvatar />
            </div>
        </div>
        <div className='ml-10 mt-2'>
            <h2 className='text-3xl font-bold truncate pr-5 uppercase'>{user}</h2>
            <p className='font-thin tracking-wide text-neutral-600'>{user}</p>
            <p className='uppercase mt-2'>premium</p>
        </div>
    </div>
  )
}