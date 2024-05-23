import React from 'react'

export default function ArticleLoading() {
  return (
    <div className="animate-pulse grid grid-cols-12 mt-3 mb-6 items-center gap-x-3 ">
        <div className="h-4 w-full bg-zinc-100 rounded"></div>
        <div className="h-6 w-3/4 col-span-5 bg-zinc-100 rounded"></div>
        <div className=" w-full col-span-4 flex-1  space-y-2  ">
            <div className="h-4 w-16 bg-zinc-100 rounded"></div>
            <div className="h-4 w-16 bg-zinc-100 rounded"></div>
        </div>
    </div>
  )
}
