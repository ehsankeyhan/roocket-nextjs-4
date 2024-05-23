import React, {useState } from 'react'
import Edit from '../../../assets/icons/Edit'
import Delete from '../../../assets/icons/Delete'
import DeleteModal from '../../modal/DeleteModal';
import EditModal from '../../modal/EditModal';


export default function  AriticleItem({article,index,limited}:any) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <tr className=' w-full font-thin'>
        <td className='px-2'>
            <div className='grid grid-cols-12 items-center group hover:bg-zinc-200 hover:bg-opacity-80  rounded-lg'>
                <p className='invisible md:visible text-center md:w-12'>{index+1}</p>
                <p className='text-left col-span-5 font-semibold'>{article.title}</p>
                <div className='col-span-3 m-1'>
                    <p>{new Date(article.createdAt).toLocaleDateString('en-Us',{ month: 'long', day: '2-digit' })}</p>
                    <p>{new Date(article.createdAt).toLocaleTimeString('en-Us',{ hour12: false, hour: '2-digit', minute: '2-digit'})}</p>
                </div>   
                {!limited?<div className=' col-span-3 justify-end hidden gap-x-2 group-hover:flex'>
                    <button onClick={() => setIsEditModalOpen(true)}>
                        <Edit />
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)}>
                        <Delete />
                    </button>

                </div>:''}
                                        
            </div>
            
            <DeleteModal 
                isOpen={isDeleteModalOpen} 
                setIsOpen={setIsDeleteModalOpen} 
                article={article}
            />
            <EditModal
                isOpen={isEditModalOpen} 
                setIsOpen={setIsEditModalOpen}
                article={article} 
             />
        </td>
    </tr>
  )
}
