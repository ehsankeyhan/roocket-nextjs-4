'use client'
import { Field } from 'formik'
import React, { useState } from 'react'

export default function SmapleFields({type,name,values,errors,touched,handleBlur,placeHolder}:any) {
    const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
        <Field 
            type={type} 
            name={name}                          
            onBlur={(e:any) => (setIsFocused(false),handleBlur(e))}
            onFocus={() => setIsFocused(true)}
            value={values?.name}
            autoComplete = {name}
            className={`border rounded-md px-3  pt-6 pb-2 mb-2 bg-transparent w-full ${
                errors && touched ? ' border-red-500 focus:outline-red-500' : 'border-gray-300 '
            }`}
        />
        <p className={` max-w-80 mb-4  absolute py-1 px-3 transition-all duration-300 ease-in-out -z-10 ${values||isFocused?'top-1 text-sm':'top-3 text-lg '} ${errors && touched ? 'text-red-500' :'text-gray-400'}`}>
            {errors && touched? errors :placeHolder}
        </p>
    </div>
  )
}
