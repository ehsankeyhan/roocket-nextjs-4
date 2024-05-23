import React, { useContext, useEffect, useState } from 'react'
import { ArticlesContext } from '../../contexts/ArticleContext';
import axios from 'axios';
import LoadingButton from '../buttons/LoadingButton';
import useSweetAlert from '../../hooks/useSweetAlert';
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr';


const deleteTitle = (url: string) => axios.delete(url).then(res => res.data)


export default function DeleteModal({ isOpen , setIsOpen ,article}:any) {
    const {articleDispatcher}= useContext(ArticlesContext)
    const Toast = useSweetAlert()
    const { mutate } = useSWRConfig()
    const {trigger,isMutating,data,error} = useSWRMutation(`https://65f7f726b4f842e808867f20.mockapi.io/rocket-1/api/Articles/${article.id}`,deleteTitle)
  


    useEffect(()=>{
      if(data){
        articleDispatcher({
          type :'delete-title',
          id:data.id,
      })
        setIsOpen(false);
        Toast.fire({
          icon: "success",
          title: "Title deleted successfully"
        });
        mutate('https://65f7f726b4f842e808867f20.mockapi.io/rocket-1/api/Articles');
      }
  },[data])
  
  useEffect(()=>{
      if(error){
         Toast.fire({
            icon: "error",
            title: "An internal server Error"
          });
          setIsOpen(false);
      }
  },[error])



    

    const handleDelete = () => {
        trigger()

    };

    const handleCancel = () => {
        setIsOpen(false);
    };

  return (
    <>
    <div className={isOpen ? 'fixed inset-0 flex items-center bg-black bg-opacity-50 backdrop-blur-sm justify-center z-50' : 'hidden'}>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        <p className="mb-4">Are you sure you want to delete?</p>
        <div className="flex justify-center">
          <button 
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed "
            onClick={handleDelete}
            disabled={isMutating}
          >
              <LoadingButton isMutating={isMutating} text='Delete' /> 
          </button>
          <button 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancel}
            disabled={isMutating}
          >
            <span className='w-14 block'>No</span>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
