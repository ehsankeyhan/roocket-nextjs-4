import React, { Fragment } from 'react'
import ArticlesCard from './ArticlesCard'
import { Transition } from '@headlessui/react'


export default function ManageArticles() {
   
  return (
    <>
        <Transition
        as={Fragment}
        appear={false}
        show={true}
        enter="transition ease-in duration-300"
        enterFrom="transform opacity-0 translate-y-10"
        enterTo="transform opacity-100 translate-y-0"
        >
        <div className=' mb-20 md:w-full w-80 rounded-2xl bg-white  overflow-hidden '>
            <ArticlesCard limited={false} />
        </div>
        </Transition>
    </>
  )
}
