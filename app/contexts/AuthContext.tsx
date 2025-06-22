'use client'

import { createContext, useEffect, useState } from "react";
import useSweetAlert from "../hooks/useSweetAlert";
import useSWRMutation from 'swr/mutation';
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<any>(null);

const login = (url: string, { arg }: any) => axios.post(url, {
  username: arg.username,
  password: arg.password
}).then(res => res.data);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const { trigger, isMutating, data, error } = useSWRMutation('https://apiadmin.giftomo.net/login', login);
  const Toast = useSweetAlert();
  const navigate = useRouter();

  let localToken: any;
  let localUser: any;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate.push('/login');
  };
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : '';
}
  if (typeof window !== "undefined") {
    localToken = localStorage.getItem('token');
    localUser = localStorage.getItem('user');
    
    // Check for sessionToken in cookies

  }

  useEffect(() => {
    if (localToken) {
      setToken(localToken);
      const cookieValue = getCookie('sessionToken')
      if (!cookieValue) {
        handleLogout()
      }
    }
  }, [localToken]);
  // useEffect(() => {
  //     setToken(localToken);
  //     const cookieValue = getCookie('sessionToken')
  //     if (!cookieValue) {
  //       handleLogout()
  //     }
  // }, [data]);

  useEffect(() => {
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, [localUser]);

  useEffect(() => {
    if (data) {
      Toast.fire({
        icon: "success",
        title: "You are logged in successfully"
      });
      localStorage.setItem('token', data.user.ID);
      const maxAgeInSeconds = 7 * 86400; // 7 days
      const expires = new Date(Date.now() + maxAgeInSeconds * 1000).toUTCString();
      document.cookie = `sessionToken=${data.user.ID}; expires=${expires}; path=/`;
      localStorage.setItem('user', JSON.stringify(data.user));
      const origin = '/';
      navigate.push(origin);
      setToken(data.user.ID);
      setUser(data.user);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Toast.fire({
        icon: "error",
        title: error.response.data.message
      });
    }
  }, [error]);

  // useEffect(() => {
  //   if (!token) {
  //     handleLogout();
  //   }
  // }, [token]);

  const handleLogin = async (values: any) => {
    await trigger(values);
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
