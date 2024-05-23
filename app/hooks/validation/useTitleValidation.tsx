import React from 'react'
import * as Yup from 'yup';


export default function useTitleValidation() {
    const validationTitle = Yup.object({
        title: Yup.string()
         .min(5,'Must be 5 characters or than')
         .max(30, 'Must be 15 characters or less')
         .required('Required'),
     })
  return validationTitle;
}
