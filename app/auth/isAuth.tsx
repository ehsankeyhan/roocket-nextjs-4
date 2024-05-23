"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuth from "../hooks/useAuth";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const { token,setToken,setUser } = useAuth();


    useEffect(() => {
      if (!token) {
        setToken('')

        return redirect("/login");
      }
    }, []);


    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}