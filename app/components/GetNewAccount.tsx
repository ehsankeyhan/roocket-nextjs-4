import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Button, Modal, Box, Typography } from '@mui/material';

export default function GetAccount() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [dataVmess, setDataVmess] = useState(""); // State for QR code data
    const [remark, setRemark] = useState(""); // State for QR code data
    const [showConfirm, setShowConfirm] = useState(false); // State for confirmation
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [isLoading, setIsLoading] = useState(false); // State for modal visibility
    const { user } = useAuth();

    // Update gigs, price and fetch data based on selected months
    const selectPlan = async (plan: '1' | '3') => {
        setModalOpen(true); // Open the modal here
        setIsLoading(true)
        let gigabytes;
        let months = parseInt(plan)
        let price:any;
        if (plan === '1') {
            price = 320000;
            gigabytes=50
        } else if (plan === '3') {
            price = 860000;
            gigabytes=200
        }

        // Check payment before fetching the data
        const isPaymentOk = await checkPayment(price, ""); // Use an empty string or appropriate remark
        if (!isPaymentOk) return;

        // Fetch data immediately after plan selection
        await fetchDataUpdateNew(gigabytes,months,price);
    };

    // Step 2: Check payment before proceeding
    const checkPayment = async (amount: number, remark: any) => {
        try {
            const response = await fetch('https://apiadmin.giftomo.net/checkpayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('sessionToken')}`,
                },
                body: JSON.stringify({ number: amount, inputRemarkValue: remark }),
            });
            const data = await response.json();
            if (data.message !== "Wallet balance is ok") {
                setMessage("Insufficient wallet balance.");
                return false;
            }
            return true;
        } catch (error) {
            setMessage("Payment check failed.");
            console.error("Payment Error:", error);
            return false;
        }
    };

    // Step 3: Fetch data and process account update
    const fetchDataUpdateNew = async (gigabytes:any,months:any,price:any) => {
        setIsProcessing(true);
        setMessage("");
        try {
            const totalGigabytes = gigabytes * 1073741824; // Convert to bytes
            const monthValue = parseInt(months);
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + monthValue);
            const updatedDate = currentDate.getTime();
            const userId = user?.ID ? user.ID.split('-')[0] : '';
            const response = await fetch(`/api/create/vmessTcpHttp?expire=${updatedDate}&gigs=${totalGigabytes}&userId=${userId}`);
            const data = await response.json();

            if (data.response && data.response.success) {
                const link = {
                    "v": "2",
                    "ps": data.newRemark,
                    "add": data.tunnel,
                    "port": data.newAccount.port,
                    "id": data.newAccount.settings.clients[0].id,
                    "aid": 0,
                    "net": "tcp",
                    "type": "http",
                    "host": "uptvs.com",
                    "path": "/",
                    "tls": "none"
                };

                const textToCopy = JSON.stringify(link);
                const encodedStringBtoA = btoa(textToCopy);
                const vmessLink = "vmess://" + encodedStringBtoA;

                // Make payment first
                const paymentResult = await makePayment(price, data.newRemark);
                
                // Only show data if payment was successful
                if (paymentResult) {
                    setRemark(data.newRemark);
                    setDataVmess(vmessLink);
                    setIsLoading(false);
                    setShowConfirm(true);
                } else {
                    setMessage("Payment failed. Account cannot be activated.");
                }
            } else {
                setMessage("Failed to create account");
            }
        } catch (error: any) {
            console.error('Error creating account:', error.message);
            setMessage('An error occurred while creating the account.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Step 4: Make payment
    const makePayment = async (amount: number, remark: any) => {
        try {
            const paymentResponse = await fetch(`https://apiadmin.giftomo.net/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('sessionToken')}`,
                },
                body: JSON.stringify({ number: amount, inputRemarkValue: remark }),
            });
            const paymentData = await paymentResponse.json();
            if (paymentData.message !== "Payment successful!") {
                throw new Error(paymentData.message);
            }
            setMessage("Payment completed successfully!");
            return true;
        } catch (error: any) {
            setMessage("Payment failed: " + error.message);
            console.error("Payment Error:", error);
            return false;
        }
    };

    // Helper function to get session token from cookies
    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts: any = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : '';
    }

    const closeModal = () => {
        setShowConfirm(false);
        setModalOpen(false);
        setDataVmess("");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard');
        });
    };

    return (
        <div>
            <h2 className='text-lg font-semibold'>Get New Account:</h2>
            <div className='flex gap-x-10  justify-center mt-10 '>
                <Button variant="contained" onClick={() => selectPlan('1')}>1 Month - 50 GB</Button>
                <Button   sx={{ backgroundColor: 'rgb(91 33 182)', color: 'white' }} variant="contained" onClick={() => selectPlan('3')}>3 Months - 200 GB</Button>
            </div>
            {message && <Typography color="error">{message}</Typography>}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className='mt-20 min-h-80 flex flex-col justify-center items-center gap-y-5 p-5 m-auto md:mx-auto md:max-w-96 mx-10 ' style={{ backgroundColor: 'white', borderRadius: '8px'}}>
                    {!isLoading&&
                    <>
                        <Typography id="modal-title" variant="h6" component="h2">QR Code Generated</Typography>
                        <h2 className='text-2xl font-bold'>{remark}</h2> {/* Display remark */}

                        <div id="qrCodeContainer" style={{ margin: '20px 0' }}>
                            {/* Display QR code here */}
                            <QRCodeSVG value={dataVmess} size={200} />
                        </div>
                        <Button variant="contained" onClick={() => copyToClipboard(dataVmess)}>Copy Link</Button>
                        <Button variant="outlined" onClick={closeModal}>Close</Button>
                    </>
                    }

                </div>
            </Modal>
        </div>
    );
}
