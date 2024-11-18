import React from 'react'
import * as Yup from 'yup';


export default function useLoginValidation() {
    const validationLogin = Yup.object({
        username: Yup.string()
        .required('Required'),
        password: Yup.string()
        .min(4,'Must be 4 characters or than')
        .required('Required'),
     })
  return validationLogin;
}
