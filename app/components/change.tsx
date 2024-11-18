import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Button, Modal, Box, Typography } from '@mui/material';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

export default function ChangeAccount() {
    const [inputValue, setInputValue] = useState("");
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [foundObject, setFoundObject] = useState<any>(null); // State for found object
    const [data, setData] = useState<any>(null); // State for found object
    const [newAccountData, setNewAccountData] = useState<any>(null); // State for found object
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [dataVmess, setDataVmess] = useState(""); // State for QR code data
    const [remark, setRemark] = useState(""); // State for QR code data
    // Step 3: Fetch account data and show found object
    const handleUpdateAccount = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setIsProcessing(true);
        setMessage("");

        try {
            const inputUpdateValue = inputValue.toLowerCase();
            // Fetch account data
            const response = await fetch(`/api/list/${inputUpdateValue}`);
            const data = await response.json();

            // Show found object data in modal
            setFoundObject(data.newAccount);
            setData(data);
            setModalOpen(true); // Open modal here
        } catch (error) {
            setMessage("An error occurred during update.");
            console.error("Update Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Step 4: Confirm update and proceed with payment and update
    const confirmUpdate = async () => {
        setIsProcessing(true);
        try {

            const response = await axios.post('api/create/vmessTcpChange', data);
            const account = response.data
            setNewAccountData(account)
            const foundUpdatedObject = account.newAccount
            if (foundUpdatedObject) {
                setRemark(foundUpdatedObject.remark)

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
                    "type": "none",
                    "host": "",
                    "path": "",
                    "tls": "none"
                };

                const textToCopy = JSON.stringify(link);
                const encodedStringBtoA = btoa(textToCopy);
                const vmessLink = "vmess://" + encodedStringBtoA;

                setDataVmess(vmessLink);
                setIsProcessing(false)
          }
        } catch (error) {
            setMessage("An error occurred during update.");
            console.error("Update Error:", error);
        } finally {
            setIsProcessing(false);
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
    const closeModal = () => {
        setModalOpen(false);
        setDataVmess("");
        setRemark("")
        setNewAccountData("")
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard');
        });
    };


    const { remainingGigs, remainingDays } = calculateRemaining();

    return (
        <div className="h-52">
            <h2 className='text-lg font-semibold'>Change Account</h2>
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
                    {!newAccountData&&
                    <>
                    <p id="modal-description">
                        <p className='text-center text-2xl font-bold'>{foundObject?.remark}</p>
                        <p className={`font-bold mt-5 text-center text-xl mb-2 ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{foundObject?.enable?'Enable':'Account has Disabled'}</p>
                        <p>Remaining Gigs: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingGigs.toFixed(2)} GB</span></p>
                        <p>Remaining Days: <span className={`font-bold ${foundObject?.enable?'text-green-500':'text-red-500'}`}>{remainingDays} Days</span></p>
                    </p>
                    <div className='flex gap-x-10 mb-5 mt-8 justify-around'>
                        <Button variant="contained" onClick={() => confirmUpdate()} disabled={isProcessing}> Change Account</Button>
                    </div>
                    
                    <Button variant="outlined" onClick={() => setModalOpen(false)} disabled={isProcessing}>Cancel</Button>
                    </>}
                    {newAccountData&&
                    <div className=' flex flex-col justify-center items-center gap-y-5 m-auto md:mx-auto md:max-w-96 mx-10 '>
                        <h2 className='text-2xl font-bold'>{remark}</h2> {/* Display remark */}

                        <div id="qrCodeContainer" style={{ margin: '20px 0' }}>
                            {/* Display QR code here */}
                            <QRCodeSVG value={dataVmess} size={200} />
                        </div>
                        <Button variant="contained" onClick={() => copyToClipboard(dataVmess)}>Copy Link</Button>
                        <Button variant="outlined" onClick={closeModal}>Close</Button>
                    </div>
                    }
                </div>
 
            </Modal>
        </div>
    );
}
