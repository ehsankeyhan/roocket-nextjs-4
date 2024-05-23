import { Form, Formik } from 'formik'
import React from 'react'

import useFormikLogin from '../../hooks/useFormikLogin';
import SmapleFields from '../forms/inputs/SmapleFields';
import useAuth from '../../hooks/useAuth';


export default function LoginCard() {
    const {isMutating,handleLogin} = useAuth()

    const formikProps = useFormikLogin();




  return (
    <div>
        <div className='md:w-3/5 pb-5 rounded-[2rem] drop-shadow-2xl shadow-2xl bg-white mx-auto'>
            <div className='relative mx-auto flex justify-center items-center h-40 w-40 pt-20'>
                <img src="/iAdminLogin.svg" alt="" className='animate-spin-slow absolute w-40 h-40'/>
                <p className='font-semibold text-xl '>iAdmin</p>
            </div>
            <div className=' mt-20 md:mx-20 mx-10 transition-all duration-300 ease-in-out'>
                <p className='font-medium text-center mb-5  text-4xl'>Sign In With Email</p>
                <Formik
                    {...formikProps}
                    onSubmit={(values) => {
                    handleLogin(values)
                    }}
                >
                {({ errors, touched,handleBlur,values}) => (
                    <Form className='space-y-4'>
                    <SmapleFields type={'email'} name={'email'} errors={errors.email} touched={touched.email} values={values.email} handleBlur={handleBlur} placeHolder={'Your Email'} />
                    <SmapleFields type={'password'} name={'password'} errors={errors.password} touched={touched.password} values={values.password} handleBlur={handleBlur} placeHolder={'Password'} /> 
                    <button  type='submit' className="group  mx-auto block px-4 py-4 border-gray-300 transition-all duration-300 hover:border-black border-2 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                        {isMutating?
                        <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 transition-all duration-300 text-gray-400 group-hover:text-black h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                        }
                    </button>
                    </Form>
                )}
                </Formik>
            </div>
           
        </div>
    </div>
  )
}
