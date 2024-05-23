'use client'


import { createContext, useEffect, useState} from "react";
import useSweetAlert from "../hooks/useSweetAlert";
import useSWRMutation from 'swr/mutation'
import axios from "axios";
import { useRouter } from "next/navigation";


export const AuthContext = createContext<any>(null);

const login = (url: string, { arg }: any) => axios.post(url,{
  email: arg.email,
  password :  arg.password,
}).then(res => res.data);

export function AuthProvider ({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const { trigger, isMutating, data, error } = useSWRMutation('https://react-camp-api.roocket.ir/api/admin/login', login);
    const Toast = useSweetAlert();
    const navigate = useRouter();

    let localToken :any;
    let localUser :any;
    if (typeof window !== "undefined") {
       localToken=localStorage.getItem('token')
       localUser=localStorage.getItem('user')
    }

    useEffect(()=>{
      if(localToken){
        setToken(localToken)
      }
    },[localToken])
    useEffect(()=>{
        if(localUser){
          setUser(localUser)
        }
    },[localUser])

    useEffect(() => {
      if(data){
        Toast.fire({
          icon: "success",
          title: "You are Login successfully"
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.name);
        const origin = '/'|| '/';
        navigate.push(origin);
        setToken(data.token);
        setUser(data.name);
      }
  }, [data]);

  useEffect(() => {
      if(error){
         Toast.fire({
            icon: "error",
            title: error.response.data.message
          });
      }
  }, [error]);

  const handleLogin = async(values: any) => {
      await trigger(values);
      
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('')
    navigate.push('/login');
  };

  const value: any = {
    token,
    setToken,
    user,
    setUser,
    handleLogin,
    handleLogout,
    isMutating
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
