import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Button, Modal, Box, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

export default function UpdateAccount() {
    const VALID_PREFIXES = ['irw', 'irx', 'iry', 'irz', 'irk', 'irm', 'irv'];
    const [inputValue, setInputValue] = useState("");
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [foundObject, setFoundObject] = useState<any>(null); // State for found object
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [newAccountLink, setNewAccountLink] = useState<string | null>(null);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    console.log("User:", user);
    const [remark, setRemark] = useState("");
    // Step 2: Check payment before proceeding
    const checkPayment = async (price: any) => {
        try {
            const response = await fetch(`https://apiadmin.giftomo.net/checkpayment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('sessionToken')}`,
                },
                body: JSON.stringify({ number: price, inputRemarkValue: inputValue }),
            });
            const data = await response.json();
            if (data.message !== "Wallet balance is ok") {
                setMessage("Insufficient wallet balance.");
                return false;
            }
            return  true;
        } catch (error) {
            setMessage("Payment check failed.");
            console.error("Payment Error:", error);
            return false;
        }
    };

    // Step 3: Fetch account data and show found object
    const handleUpdateAccount = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setIsProcessing(true);
        setMessage("");

        try {
            const inputUpdateValue = inputValue.toLowerCase();
            const newConst = inputUpdateValue.substring(0, 3);

            // Fetch account data
            const response = await fetch(`https://apiadmin.giftomo.net/api/data/${newConst}`);
            const data = await response.json();
            const found = data.obj.find((obj: { remark: string; }) => obj.remark === inputUpdateValue);

            if (!found) {
                setMessage("Account with this remark not found.");
                setIsProcessing(false);
                return;
            }

            // Show found object data in modal
            setFoundObject(found);
            setModalOpen(true); // Open modal here
        } catch (error) {
            setMessage("An error occurred during update.");
            console.error("Update Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step 4: Confirm update and proceed with payment and update
    const confirmUpdate = async (months: number, gigabytes: number) => {
        setIsProcessing(true);
        setModalOpen(false); // Close modal
        let price;
        if (months === 1) {
            price = 280000;
        } else if (months === 3) {
            price = 840000;
        }

        try {
            const isPaymentOk = await checkPayment(price);
            if (!isPaymentOk) return;

            // Calculate expiration and convert gigabytes to bytes
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + months);
            const updatedDate = currentDate.getTime();
            const totalGigabytes = gigabytes * 1073741824; // Convert to bytes

            // Prepare update request
            const settingsObject = JSON.parse(foundObject.settings);
            const uid = settingsObject.clients[0].id;
            const idValue = foundObject.id;
            const portValue = foundObject.port;

            // Send update request
            const updateResponse = await fetch(`https://apiadmin.giftomo.net/api/update/${foundObject.remark.substring(0, 3)}/${idValue}/${inputValue}/${portValue}/${uid}/${updatedDate}/${totalGigabytes}`);
            if (!updateResponse.ok) throw new Error("Account update failed.");

            // Final step: Complete payment after successful update
            await makePayment(price);

            setMessage("Account updated and payment completed successfully!");

        } catch (error) {
            setMessage("An error occurred during update.");
            console.error("Update Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Final step: Complete payment function
    const makePayment = async (price: any) => {
        try {
            const paymentResponse = await fetch(`https://apiadmin.giftomo.net/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('sessionToken')}`,
                },
                body: JSON.stringify({ number: price, inputRemarkValue: inputValue }),
            });
            const paymentData = await paymentResponse.json();
            if (paymentData.message !== "Payment successful!") throw new Error(paymentData.message);
        } catch (error: any) {
            throw new Error("Payment failed: " + error.message);
        }
    };

    // Helper function to get session token from cookies
    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts: any = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : '';
    }

    // Remaining gigs and days calculation
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

    const handleAccountChange = async () => {
        if (!foundObject) return;
        setIsProcessing(true);
        setModalOpen(false);

        try {
            const prefix = foundObject.remark.substring(0, 3);
            if (!VALID_PREFIXES.includes(prefix)) {
                setMessage("This account type cannot be changed.");
                return;
            }

            // Get first user ID (before dash)
            const userId = user?.ID ? user.ID.split('-')[0] : '';

            // Use GET method with query params, include userId
            const url = `/api/create/vmessTcpHttp?expire=${foundObject.expiryTime}&gigs=${foundObject.total-foundObject.up-foundObject.down}&userId=${userId}`;
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) throw new Error("Failed to change account");
            
            const data = await response.json();
            // Assume newAccount and its settings are returned
            const newAccount = data?.newAccount;
            let vmessLink = '';
            if (newAccount && newAccount.settings && newAccount.streamSettings) {
                // Compose vmess link (basic, adjust as needed)
                const vmessObj = {
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
                vmessLink = "vmess://" + btoa(JSON.stringify(vmessObj));
            }
            setNewAccountLink(vmessLink);
            setRemark(data.newRemark);
            setQrModalOpen(true);
            setMessage("Account changed successfully!");

            // --- New code: Disable old account after successful change ---
            if (!data.error) {
                const item = foundObject;
                const { enable, region, userId, up, down, total, remark, expiryTime, listen, port, protocol, settings, streamSettings, tag, sniffing } = item;

                await fetch(`https://apiadmin.giftomo.net/api/inbound/update/${item.remark.substring(0, 3)}/${item.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enable: false,
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
            }
            // --- End new code ---

        } catch (error) {
            setMessage("Failed to change account: " + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-52">
            <h2 className='text-lg font-semibold'>Update Account</h2>
            <form onSubmit={handleUpdateAccount}>
                <div>
                    <input
                        className="rounded-lg w-full px-3 py-2 my-10 text-md  border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200" 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your account number: (irn001)"
                    />
                </div>

                <Button type="submit" variant="contained" disabled={isProcessing}>Show Account</Button>
            </form>
            {message && <p>{message}</p>}
            
            {/* Material-UI Modal for Confirmation */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className='mt-20 flex flex-col min-h-80 justify-center p-5 m-auto md:mx-auto md:max-w-96 mx-10 ' style={{ backgroundColor: 'white', borderRadius: '8px'}}>
                    <p id="modal-description">
                        <p className='text-center text-2xl font-bold'>{foundObject?.remark}</p>
                        <p className={`font-bold mt-5 text-center text-xl mb-2 ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{foundObject?.enable?'Enable':'Account has Disabled'}</p>
                        <p>Remaining Gigs: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingGigs.toFixed(2)} GB</span></p>
                        <p>Remaining Days: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingDays} Days</span></p>
                    </p>
                    <div className='flex gap-x-10 mb-5 mt-8 justify-around'>
                        <Button variant="contained" onClick={() => confirmUpdate(1, 50)} disabled={isProcessing}> 1 Month (50 GB)</Button>
                        <Button variant="contained" sx={{ backgroundColor: 'rgb(91 33 182)', color: 'white' }}  onClick={() => confirmUpdate(3, 200)} disabled={isProcessing}> 3 Months (200 GB)</Button>
                    </div>
                    
                    {foundObject?.enable && VALID_PREFIXES.includes(foundObject.remark.substring(0, 3)) && (
                        <Button 
                            variant="contained" 
                            sx={{ backgroundColor: 'green', marginBottom: '10px' }}
                            onClick={handleAccountChange} 
                            disabled={isProcessing}
                        >
                            Change Account Type
                        </Button>
                    )}
                    
                    <Button variant="outlined" onClick={() => setModalOpen(false)} disabled={isProcessing}>Cancel</Button>
                </div>
            </Modal>

            {/* QR Modal for new account */}
            <Modal
                open={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                aria-labelledby="qr-modal-title"
                aria-describedby="qr-modal-description"
            >
                <div className='mt-20 flex flex-col min-h-80 justify-center p-5 m-auto md:mx-auto md:max-w-96 mx-10' style={{ backgroundColor: 'white', borderRadius: '8px'}}>
                    <h2 className='text-xl font-bold mb-4 text-center'>Scan QR Code</h2>
                    <h2 className='text-2xl text-center font-bold'>{remark}</h2> {/* Display remark */}
                    {newAccountLink && (
                        <>
                            <div className='flex justify-center mb-4'>
                                <QRCodeSVG value={newAccountLink} size={180} />
                            </div>
                            <div className='break-all text-xs bg-gray-100 p-2 rounded mb-4'>{newAccountLink}</div>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigator.clipboard.writeText(newAccountLink || '');
                                }}
                                sx={{ mb: 2 }}
                            >
                                Copy Link
                            </Button>
                        </>
                    )}
                    <Button variant="outlined" onClick={() => setQrModalOpen(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
}
