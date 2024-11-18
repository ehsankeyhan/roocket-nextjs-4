'use client';

import ArticlesCard from './ArticlesCard';
import { Transition } from '@headlessui/react';
import React, { useState, useEffect, Fragment } from 'react';
import useSWR, { mutate } from 'swr';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog } from '@mui/material'; // Import MUI Dialog

export default function Orders() {
  const [dropdownValue, setDropdownValue] = useState('irn');
  const [falseCount, setFalseCount] = useState(0);
  const [trueCount, setTrueCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [qrCodeItemId, setQrCodeItemId] = useState(null);
  const [newData, setNewData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [qrCodeValue, setQrCodeValue] = useState(''); // State for the QR code value

  const fetcher = async (url: string | URL | Request) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching data');
    return response.json();
  };
  const sessionToken = getCookie('sessionToken');

  const { data, error, isValidating } = useSWR(`https://apiadmin.giftomo.net/orders/${sessionToken}`, fetcher, 
  {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const handleDropdownChange = (event: any) => {
    setDropdownValue(event.target.value);
  };


  function getCookie(name: string) {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : '';
  }

  const filteredData = data?.filter((item:any) => {
    return item?.Remark?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Transition as={Fragment} show enter="transition ease-in duration-300" enterFrom="opacity-0 translate-y-10" enterTo="opacity-100 translate-y-0">
      <div>
      <div className="mb-20 md:w-full w-96 rounded-2xl bg-white overflow-hidden">
        <div className="list-account-table">
          <div className="header-table">
            <div className="list-account">
              <h2 className='text-2xl font-semibold m-5'>List Of Orders</h2>
              <form>
                <div className="flex m-5">
                  <input 
                    type="text" 
                    placeholder="Search Your Account..." 
                    className="rounded-lg w-full px-3 py-2 text-md font-bold border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200" 
                    required 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </form>
            </div>
          </div>

          <hr className="divider" />

          <div className="overflow-x-scroll">
            {isValidating ? <div id="loading">Loading...</div> : null}
            <table className='overflow-x-scroll w-full' style={{ display: isValidating ? 'none' : 'table' }}>
              <thead>
                <tr>
                  <td className="px-4 py-2">*</td>
                  <td className="px-4 py-2">Account Name</td>
                  <td className="px-4 py-2">Date</td>
                  <td className="px-4 py-2">Price</td>

                </tr>
              </thead>
              <tbody>
                {filteredData?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                    </td>
                    <td className="px-4 py-2">{item?.Remark}</td>
                    <td className="px-4 py-2">{item?.Date}</td>
                    <td className="px-4 py-2">
                    {item?.Price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* MUI Modal for QR Code */}
      </div>
    </Transition>
  );
}
