import React from 'react'
import * as Yup from 'yup';


export default function useLoginValidation() {
    const validationLogin = Yup.object({
        email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
        password: Yup.string()
        .min(5,'Must be 5 characters or than')
        .required('Required'),
     })
  return validationLogin;
}
