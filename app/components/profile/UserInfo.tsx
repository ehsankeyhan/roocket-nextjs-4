'use client'
import React from 'react';
import CloudProfile from '../../assets/icons/CloudProfile';
import ProfileAvatar from './ProfileAvatar';
import useAuth from '@/app/hooks/useAuth';
import useSWR from 'swr';

// Define a fetcher function for SWR
const fetcher = (url:any) => fetch(url).then((res) => res.json());

export default function UserInfo() {
  const { user } = useAuth();

  // Use SWR to fetch user data
  const { data, error, mutate } = useSWR(user ? `https://apiadmin.giftomo.net/api/users/${user.ID}` : null, fetcher, {
  });

  // Handle loading and error states
  if (error) return <div>Error loading user data.</div>;
  if (!data) return <div>Loading...</div>;

  // This function can be used to revalidate data from other components


  return (
    <div className='mb-10 py-3 h-80 w-80 cursor-pointer rounded-2xl shadow-2xl backdrop-blur-lg hover:scale-[1.03] transition-all duration-300 ease-in-out' style={{ background: 'radial-gradient(circle at 100% 0, hsla(0, 0%, 100%, .85) 0, hsla(0, 0%, 96.1%, .13) 183%)' }}>
      <div className='w-48 h-48'>
        <CloudProfile />
        <div className='absolute w-28 top-10 left-8'>
          <ProfileAvatar />
        </div>
      </div>
      <div className='ml-10 mt-2'>
        <h2 className='text-3xl font-bold truncate pr-5 uppercase'>{Number(data.Wallet).toLocaleString('en-US')} T</h2>
        <p className='font-thin tracking-wide text-neutral-600'>{data.Discount}%</p>
        <p className='uppercase mt-2'>{data.Name}</p>
      </div>
    </div>
  );
}
