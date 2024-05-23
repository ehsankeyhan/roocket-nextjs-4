import Link from "next/link";

export default function Item({name,bg}:any) {


    
  return (
    <>
        <Link href={`/${name==='Dashboard'?'':name.toLowerCase()}`} className={`flex flex-col h-24 gap-y-2 p-3 rounded-lg items-center text-xs text-neutral-500 hover:scale-[1.03] hover:bg-opacity-15 transition-all duration-300 ease-in-out ${bg?'':' hover:bg-neutral-500'}`} >
            <img className='w-12' src={`/${name.toLowerCase()}.png`} alt="" />
            <p>{name}</p>
            
        </Link>
    </>
  )
}
