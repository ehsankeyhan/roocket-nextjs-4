import React from 'react';
import { Vazirmatn } from 'next/font/google';

const vazir = Vazirmatn({ subsets: ['arabic'] });

const Alert = () => {
  return (
    <div className={`bg-white rounded-lg text-right p-4 mb-6 shadow-md border-l-4 border-blue-500 ${vazir.className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="mx-3 leading-7">
          <p className="text-base text-blue-600 font-black mb-3">اطلاعیه همکار- قیمت ها تا اطلاع ثانوی بدون افزایش</p>
          <div className="space-y-2">
            <div className="border-r-2 border-gray-200 pr-2">
              <p className="text-sm font-bold text-gray-800">اکانت یک ماهه ۵۰ گیگ:</p>
              <p className="text-sm text-gray-600">• خرید جدید: <span className="font-bold text-blue-600">۱۶۰ هزار تومان</span></p>
              <p className="text-sm text-gray-600">• تمدید: <span className="font-bold text-green-600">۱۴۰ هزار تومان</span></p>
            </div>
            <div className="border-r-2 border-gray-200 pr-2">
              <p className="text-sm font-bold text-gray-800">اکانت سه ماهه ۲۰۰ گیگ:</p>
              <p className="text-sm text-gray-600">• خرید جدید: <span className="font-bold text-blue-600">۴۶۰ هزار تومان</span></p>
              <p className="text-sm text-gray-600">• تمدید: <span className="font-bold text-green-600">۴۲۰ هزار تومان</span></p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3 border-t pt-2 border-dashed">
            <span className="text-red-500">*</span> با تغییر زیرساخت سرورها تا اطلاع ثانوی افزایش قیمت نداریم. <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
