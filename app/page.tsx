'use client'

import { Transition } from '@headlessui/react'
import UserInfo from './components/profile/UserInfo';
import ArticlesCard from './components/card/articles/ArticlesCard';
import ChartsCard from './components/card/charts/ChartsCard';
import isAuth from './auth/isAuth';
import RenewAccount from './components/renew';
import GetAccount from './components/GetNewAccount';
import Alert from './components/Alert';

const Dashboard = () => {

  return (
    <>
      <div className='flex md:flex-row flex-col md:w-full md:gap-x-8 '>
        <Alert />

        <Transition
        appear={true}
        show={true}
        enter="transition ease-in duration-300"
        enterFrom="transform opacity-0 translate-x-10"
        enterTo="transform opacity-100 translate-x-0"
        >
          <div className='basis-1/3 mb-10'>
              <UserInfo />
          </div>
        </Transition>
        <div className='basis-2/3'>
        <Transition
          appear={true}
          show={true}
          enter="transition ease-in duration-200"
          enterFrom="transform opacity-0 translate-y-10"
          enterTo="transform opacity-100 translate-y-0"
          >
          <div className='  mb-10  rounded-2xl bg-white overflow-hidden shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out' >
              <ArticlesCard limited={true}/>
          </div>
          </Transition>
          <Transition
          appear={true}
          show={true}
          enter="transition ease-in duration-500"
          enterFrom="transform opacity-0 translate-y-10"
          enterTo="transform opacity-100 translate-y-0"
          >
          <div className='   mb-10 min-h-80 rounded-2xl bg-white overflow-hidden shadow-2xl hover:scale-[1.03] transition-all duration-300 ease-in-out' >
              <ChartsCard />
          </div>
          </Transition>
        </div>
      </div>
    </>
  );
}

export default isAuth(Dashboard);
