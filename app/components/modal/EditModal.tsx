import React, { useContext, useEffect, useState } from 'react';
import { ArticlesContext } from '../../contexts/ArticleContext';
import axios from 'axios';
import LoadingButton from '../buttons/LoadingButton';
import useSweetAlert from '../../hooks/useSweetAlert';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import useFormik from '../../hooks/useFormik';
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr';



const editTitle = (url:any , { arg }:any) => axios.put(url,{
  title: arg,
  createdAt : Date.now()
}).then(res => res.data)


export default function EditModal ({ isOpen, article, setIsOpen}:any) {
  const {articleDispatcher}= useContext(ArticlesContext)
  const Toast = useSweetAlert()
  const formikProps = useFormik(article.title);
  const { mutate } = useSWRConfig()
  const {trigger,isMutating,data,error} = useSWRMutation(`https://65f7f726b4f842e808867f20.mockapi.io/rocket-1/api/Articles/${article.id}`,editTitle)



  useEffect(()=>{
    if(data){
      articleDispatcher({
          type :'edit-title',
          id:data.id,
          newTitle:data.title,
          createdAt:Date.now()
      })
      setIsOpen(false);
      Toast.fire({
        icon: "success",
        title: "Title edited successfully"
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
 
  const handleSaveTitle = async (newTitle:any) => {
    trigger(newTitle)
 }

  const handleCancelEdit = () => {
    setIsOpen(false); 
  };

  return (
    <>    
    <div className={isOpen ? 'fixed inset-0 flex items-center font-semibold bg-black bg-opacity-50 backdrop-blur-sm justify-center z-50' : 'hidden'}>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10">
        <p className="mb-4">Edit Title</p>
        <Formik
          {...formikProps}
          onSubmit={(values) => {
          handleSaveTitle(values.title)
         }}
       >
      {({ errors, touched }) => (
        <Form>
          <Field 
            type="text" 
            name="title"
            className={`border rounded-md px-3 py-2 mb-2 w-full ${
              errors.title && touched.title ? 'border-red-500 focus:outline-red-500' : 'border-gray-300 '
            }`}
          />
          <p className='text-red-500 max-w-80 mb-4 text-xs '>
            <ErrorMessage name="title"  />
          </p>
          <div className="flex justify-center">
            <button 
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              type='submit'
              disabled={isMutating}
            >
              <LoadingButton isMutating={isMutating} text='Save' /> 
            </button>
            <button 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancelEdit}
              type='button'
              disabled={isMutating}
            >
              Cancel
            </button>
          </div>
          </Form>
      )}
        </Formik>
      </div>
    </div>
    </>
  );
};


