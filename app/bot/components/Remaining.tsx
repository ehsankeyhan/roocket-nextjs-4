import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { vazirmatn } from '../../fonts';

export default function Remaining() {
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [foundObject, setFoundObject] = useState<any>(null); // State for found object
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

    const handleCheckAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setMessage("");

        try {
            const response = await fetch(`/api/list/${inputValue}`);
            const data = await response.json();
            
            if (data.error === "Account not found") {
                setMessage("اکانت یافت نشد");
                setFoundObject(null);
            } else {
                setFoundObject(data);
                setModalOpen(true);
                setMessage("");
            }
        } catch (error) {
            setMessage("اکانت یافت نشد");
            setFoundObject(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const calculateRemaining = () => {
        if (!foundObject) return { remainingGigs: 0, remainingDays: 0 };

        const total = foundObject.total; // Total gigabytes
        const up = foundObject.up; // Uploaded gigabytes
        const down = foundObject.down; // Downloaded gigabytes

        const remainingGigs = (total - (up + down)) / 1073741824;
        const expiryTime = foundObject.expiryTime; // Expiry time in milliseconds
        const currentTime = Date.now(); // Current time in milliseconds

        const remainingTime = expiryTime - currentTime; // Remaining time in milliseconds
        const remainingDays = Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24))); // Convert to days

        return { remainingGigs, remainingDays };
    };

    const { remainingGigs, remainingDays } = calculateRemaining();

    return (
        <div className={`h-52 ${vazirmatn.className}`} dir="rtl">
            <h2 className='text-lg font-semibold text-right'>بررسی اکانت</h2>
            <form onSubmit={handleCheckAccount} className="text-right">
                <div>
                    <input
                        className="rounded-lg w-full px-3 py-2 my-10 text-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-right" 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="شماره اکانت خود را وارد کنید: (irn001)"
                        dir="rtl"
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isProcessing}
                    className={`${vazirmatn.className} w-full`}
                >
                    {isProcessing ? 'در حال بررسی...' : 'نمایش اکانت'}
                </Button>
            </form>
            {message && <p className="text-red-500 mt-2 text-right">{message}</p>}
            
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className={`mt-20 flex flex-col min-h-80 justify-center p-5 m-auto md:mx-auto md:max-w-96 mx-10 ${vazirmatn.className}`} 
                    style={{ backgroundColor: 'white', borderRadius: '8px'}} 
                    dir="rtl"
                >
                    <div id="modal-description" className="text-right">
                        <p className='text-center text-2xl font-bold'>{foundObject?.remark}</p>
                        <p className={`font-bold mt-5 text-center text-xl mb-2 ${foundObject?.enable?'text-green-500':'text-red-500'}`}>
                            {foundObject?.enable ? 'فعال' : 'غیرفعال'}
                        </p>
                        <div className="space-y-2">
                            <p>حجم باقیمانده: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingGigs.toFixed(2)} گیگابایت</span></p>
                            <p>روزهای باقیمانده: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingDays} روز</span></p>
                        </div>
                    </div>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => setModalOpen(false)} 
                        className={`mt-4 w-full ${vazirmatn.className}`}
                    >
                        بستن
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
