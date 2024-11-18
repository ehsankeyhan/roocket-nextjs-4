import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Button, Modal, Box, Typography } from '@mui/material';

export default function GetAccount() {
    const [price, setPrice] = useState(320000); // Default price for 1 month
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
        if (plan === '1') {
            gigabytes=50
            setPrice(320000) ;
        } else if (plan === '3') {
            gigabytes=200
            setPrice(860000) ;
        }

        // Check payment before fetching the data
        const isPaymentOk = await checkPayment(price, ""); // Use an empty string or appropriate remark
        if (!isPaymentOk) return;

        // Fetch data immediately after plan selection
        await fetchDataUpdateNew(gigabytes,months);
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
    const fetchDataUpdateNew = async (gigabytes:any,months:any) => {
        setIsProcessing(true);
        setMessage("");

        try {
            const response = await fetch('https://apiadmin.giftomo.net/getAndRemoveRow');
            const data = await response.json();

            if (data.Link) {
                const inputUpdateValue = data.Remark;
                const newConst = inputUpdateValue.substring(0, 3);

                const responseData = await fetch(`https://apiadmin.giftomo.net/api/data/${newConst}`);
                const data2 = await responseData.json();
                const foundObject = data2.obj.find((obj: { remark: any; }) => obj.remark === data.Remark);

                if (foundObject) {
                    const monthValue = parseInt(months);
                    const currentDate = new Date();
                    currentDate.setMonth(currentDate.getMonth() + monthValue);
                    const updatedDate = currentDate.getTime();

                    const totalGigabytes = gigabytes * 1073741824; // Convert to bytes
                    const settingsObject = JSON.parse(foundObject.settings);
                    const uid = settingsObject.clients[0].id;
                    const sessionToken = getCookie('sessionToken'); // Ensure getCookie is defined
                    const endUid = uid.substring(8);
                    const startSessionToken = sessionToken.substring(0, 8);
                    const newUid = startSessionToken + endUid;

                    const idValue = foundObject.id;
                    const portValue = foundObject.port;

                    // Update account
                    await fetch(`https://apiadmin.giftomo.net/api/update/${newConst}/${idValue}/${inputUpdateValue}/${portValue}/${newUid}/${updatedDate}/${totalGigabytes}`);

                    // Fetch updated account data
                    const updatedResponse = await fetch(`https://apiadmin.giftomo.net/api/data/${newConst}`);
                    const updatedData = await updatedResponse.json();
                    const foundUpdatedObject = updatedData.obj.find((obj: { remark: any; }) => obj.remark === data.Remark);
                    setRemark(data.Remark)
                    if (foundUpdatedObject) {
                        const updatedSettingsObject = JSON.parse(foundUpdatedObject.settings);
                        const server = foundUpdatedObject.remark.substring(0, 3);
                        const id = updatedSettingsObject.clients[0].id;

                        const link = {
                            "v": "2",
                            "ps": foundUpdatedObject.remark,
                            "add": `${server}.giftomo.net`,
                            "port": foundUpdatedObject.port,
                            "id": id,
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

                        setDataVmess(vmessLink);
                        setIsLoading(false)

                        setShowConfirm(true);

                        // Make the payment after successful account update
                        await makePayment(price, data.Remark);
                    }
                } else {
                    setMessage("Account with this remark not found.");
                }
            } else {
                alert('No data available.');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
            alert('An error occurred while fetching data.');
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
        } catch (error: any) {
            setMessage("Payment failed: " + error.message);
            console.error("Payment Error:", error);
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
