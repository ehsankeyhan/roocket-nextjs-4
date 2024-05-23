'use client'
import React, { useEffect, useState } from 'react'
import Recent from '../../../assets/icons/Recent'
import useAuth from '../../../hooks/useAuth';
import useSWR from 'swr';
import axios from "axios";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BarChart from './BarChart';
import HeaderCard from '../HeaderCard';



Chart.register(CategoryScale);



export default function ChartsCard() {
    const {token}= useAuth()
    const chartsData = (url:string) => axios.get(url,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.data)
    const { data, error, isLoading } = useSWR(token?'https://react-camp-api.roocket.ir/api/admin/dashboard':'',chartsData)


    const [chartData, setChartData] = useState({labels: undefined,datasets:[{}]});
      useEffect(()=>{
        return setChartData({
          labels: data?.data?.map((item: any) => item.date),
          datasets: [
            {
              label: "Amount",
              data: data?.data?.map((item: any) => item.amount),
              borderWidth: 2,
              borderColor: '#61D735',
              backgroundColor: 'rgba(97,215,53,0.2)',
              pointBackgroundColor: '#fff',
              pointStyle: 'circle',
              tension: 0.1,
              fill: true,
              borderRadius: 4,
              pointHoverRadius: 15
            }
          ]
        });
      },[data])

  return (
        <div className='h-full'>
            <div className=' bg-[#dceefd] p-3 '>
               <HeaderCard title={'Charts'} />
            </div>
            <div className={`transition-all ease-in-out duration-500 m-3 h-full`}>
                {chartData?.labels&&!isLoading?
                 <BarChart chartData={chartData} />:
                 <div className='flex justify-center items-center h-40'>
                    <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                 }
            </div>
        
    </div>
    )
}
