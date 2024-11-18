'use client';

import ArticlesCard from './ArticlesCard';
import { Transition } from '@headlessui/react';
import React, { useState, useEffect, Fragment } from 'react';
import useSWR, { mutate } from 'swr';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog } from '@mui/material'; // Import MUI Dialog

export default function ManageArticles() {
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

  const { data, error, isValidating } = useSWR(`https://apiadmin.giftomo.net/api/data/${dropdownValue}`, fetcher, 
  {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      processTableData(data.obj);
    }
  }, [data]);

  function processTableData(items: any[]) {
    let falseCountLocal = 0, trueCountLocal = 0, totalCountLocal = 0;
    const sessionToken = getCookie('sessionToken');

    const processedData = items
      .map((item: { settings: any; remark: string; port: any; expiryTime: string | number | Date; enable: boolean; }) => {
        const settingsObject = JSON.parse(item.settings || '{}');
        const id = settingsObject.clients?.[0]?.id || '';
        const link = {
          "v": "2",
          "ps": item.remark,
          "add": `${item.remark.substring(0, 3)}.giftomo.net`,
          "port": item.port,
          "id": id,
          "aid": 0,
          "net": "tcp",
          "type": "http",
          "host": "uptvs.com",
          "path": "/",
          "tls": "none"
        };
        const vmess = "vmess://" + btoa(JSON.stringify(link));
        const startSessionToken = sessionToken?.substring(0, 8) || '';
        const startId = id.substring(0, 8);
        const formattedDate = formatDateToDDMMYY(new Date(item.expiryTime));
        const isItemEnabled = item.enable !== false;
          //true
          //startSessionToken===startId
        if (startSessionToken===startId) {
          totalCountLocal++;
          isItemEnabled ? trueCountLocal++ : falseCountLocal++;

          return { ...item, vmess, formattedDate, isItemEnabled };
        }
        
        return null;
      })
      .filter(item => item !== null);

    setFalseCount(falseCountLocal);
    setTrueCount(trueCountLocal);
    setTotalCount(totalCountLocal);
    setNewData(processedData);
  }
  
  function formatDateToDDMMYY(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substring(2);
    return `${day}/${month}/${year}`;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  const handleDropdownChange = (event: any) => {
    setDropdownValue(event.target.value);
  };

  const toggleQRCodeDisplay = (item: any) => {
    setQrCodeValue(item.vmess); // Set the QR code value
    setOpenModal(true); // Open the modal
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : '';
  }

  const handleToggleAccount = async (item: any) => {
    const { enable, region, userId, up, down, total, remark, expiryTime, listen, port, protocol, settings, streamSettings, tag, sniffing } = item;

    const response = await fetch(`https://apiadmin.giftomo.net/api/inbound/update/${item.remark.substring(0, 3)}/${item.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enable: !enable,
        region,
        userId,
        up,
        down,
        total,
        remark,
        expiryTime,
        listen,
        port,
        protocol,
        settings,
        streamSettings,
        tag,
        sniffing
      }),
    });

    if (response.ok) {
      const updatedAccount = await response.json();
      mutate(`https://apiadmin.giftomo.net/api/data/${dropdownValue}`);
    } else {
      alert('Error updating account status');
    }
  };

  const filteredData = newData.filter((item:any) => {
    return item.remark.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Transition as={Fragment} show enter="transition ease-in duration-300" enterFrom="opacity-0 translate-y-10" enterTo="opacity-100 translate-y-0">
      <div>
      <div className="mb-20 md:w-full w-96 rounded-2xl bg-white overflow-hidden">
        <div className="list-account-table">
          <div className="header-table">
            <div className="list-account">
              <h2 className='text-2xl font-semibold m-5'>List Of Account</h2>
              <form>
                <div className="flex m-5">
                  <select onChange={handleDropdownChange} value={dropdownValue}   className=" rounded-lg px-3 py-2 mx-5 text-md font-bold border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200">
                    {['ira', 'irv', 'ire', 'irt', 'irz', 'iry', 'irx', 'irw', 'iru', 'irs', 'irp', 'irm', 'irk', 'iro', 'irn'].map((srv) => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
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

            <div className="flex justify-around">
              <div className="active-server">
                <h4>Activate <br /> Account</h4>
                <p>{trueCount}</p>
              </div>
              <div className="active-server">
                <h4>DeActivate <br /> Account</h4>
                <p>{falseCount}</p>
              </div>
              <div className="active-server">
                <h4>Total <br /> Account</h4>
                <p>{totalCount}</p>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="overflow-x-scroll">
            {isValidating ? <div id="loading">Loading...</div> : null}
            <table className=' w-full' style={{ display: isValidating ? 'none' : 'table' }}>
              <thead>
                <tr>
                  <td className="px-4 py-2">*</td>
                  <td className="px-4 py-2">Account Name</td>
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">Download</td>
                  <td className="px-4 py-2">Upload</td>
                  <td className="px-4 py-2">Days</td>
                  <td className="px-4 py-2">QR</td>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((item: any, index: any) => (
                  <tr key={index} style={{ backgroundColor: item.isItemEnabled ? '' : 'rgba(255, 160, 125, 0.2)' }}>
                    <td className="px-4 py-2">
                      <button onClick={() => handleToggleAccount(item)}>
                        {item.enable ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                    <td className="px-4 py-2">{item.remark}</td>
                    <td className="px-4 py-2">{(item.total) / 1073741824} GB</td>
                    <td className="px-4 py-2">{((item.down) / 1073741824).toFixed(2)} GB</td>
                    <td className="px-4 py-2">{((item.up) / 1073741824).toFixed(2)} GB</td>
                    <td className="px-4 py-2">{item.formattedDate}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => toggleQRCodeDisplay(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* MUI Modal for QR Code */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <div className="rounded-xl w-80 h-96 flex flex-col justify-center items-center gap-y-5" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>QR Code</h2>
          <h2>{newData.find((item:any) => item.vmess === qrCodeValue)?.remark}</h2> {/* Display remark */}

          {qrCodeValue && <QRCodeSVG value={qrCodeValue} size={150} />}
          <button onClick={() => handleCopy(qrCodeValue)}>Copy QR Code</button>
          <button onClick={() => setOpenModal(false)}>Close</button>
        </div>
      </Dialog>
      </div>
    </Transition>
  );
}
