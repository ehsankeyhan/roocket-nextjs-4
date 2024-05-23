'use client'

import React, { useContext, useEffect, useReducer, useState } from 'react'
import Recent from '../../../assets/icons/Recent'
import axios from 'axios';

import AriticleItem from './AriticleItem';
import ArticlesReducer from '../../../reducers/ArticlesReducer';
import { ArticlesContext } from '../../../contexts/ArticleContext';
import Plus from '../../../assets/icons/Plus';
import ArticleLoading from './ArticleLoading';
import useSweetAlert from '../../../hooks/useSweetAlert';
import useSWR from 'swr';
import HeaderCard from '../HeaderCard';
import AddNewTitleModal from '../../modal/AddNewTitleModal';

const fetcher = (url: string) => axios.get(url).then(res => res.data)


export default function ArticlesCard({limited}:any) {

    const [articlesData , articleDispatcher ] = useReducer(ArticlesReducer,[]) 
    const [isNewTitleModalOpen, setIsNewTitleModalOpen] = useState(false);
    const Toast = useSweetAlert()
    const { data, error, isLoading } = useSWR('https://65f7f726b4f842e808867f20.mockapi.io/rocket-1/api/Articles', fetcher)
    useEffect(()=>{
        if(data){
            const sortedData = data.sort((a: { createdAt: any | number | Date; }, b: { createdAt: any | number | Date; }) => {
                const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });
            
            articleDispatcher({
                type : 'initial-articles',
                articlesData : sortedData
            })
        }
    },[data])
    useEffect(()=>{
        if(error){
           Toast.fire({
                icon: "error",
                title: "An internal server Error"
              });
        }
    },[error])


    
  return (
    <div>
        <div className=' bg-[#dceefd] p-3 '>
            {limited?
            <HeaderCard title={'Articles'} />
            :<div className={`'p-3  flex justify-between rounded-xl'`}>
                <div className='flex items-center gap-x-3'>
                    <div className='w-10'>
                        <img src="/articles.png" alt="article" />
                    </div>
                    <div>
                        <p className='font-semibold text-xl tracking-wide'>Articles</p>
                        <div className='flex items-center -mt-1 text-sm text-neutral-600 font-extralight gap-x-1'>
                            <Recent />
                            <p>Recents</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsNewTitleModalOpen(true)} className='p-2 w-10 h-10 flex justify-center items-center rounded-xl hover:bg-neutral-500 hover:bg-opacity-15'>
                    <Plus w='17' h='17' />
                </button>
            </div>}
            
        </div>
        <div className={`transition-all ease-in-out duration-500 m-3  ${!limited&&!isLoading?'max-h-[480px] overflow-y-scroll':'max-h-80 '}`}>
        <ArticlesContext.Provider value={{articlesData,articleDispatcher}}>
          <table className='w-full '>
                <tbody className=''>
                        {articlesData&&!isLoading?
                            (limited?articlesData?.slice(0,3).map((article: { id: React.Key | null | undefined; },index: any)=>(
                                <AriticleItem key={article.id} index={index} article={article} limited={limited}/>
                            )):articlesData?.map((article: { id: React.Key | null | undefined; },index: any)=>(
                                <AriticleItem key={article.id} index={index}  article={article} limited={limited}/>
                            ))):<tr>
                                    <td>
                                        <ArticleLoading />
                                        <ArticleLoading /> 
                                        <ArticleLoading />
                                    </td>
                                </tr>
                        }
                </tbody>
            </table>
            <AddNewTitleModal 
            isOpen={isNewTitleModalOpen} 
            setIsOpen={setIsNewTitleModalOpen} 
            />
        </ArticlesContext.Provider>
        </div>
        
    </div>
  )
}
