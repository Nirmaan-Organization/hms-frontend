import { CancelOutlined } from '@mui/icons-material';
import { Modal } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import '../login/login.css'

const VerifyMail = ({ userData, isOtpverifyTab, OtpverifyTabClose }) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    
    const [click, setClick] = useState(false)
    const [emailID, setEmailID] = useState('');
    const [otpnumber, setOtpnumber] = useState('')

    if (!isOtpverifyTab) return null;

    const accountVerify = async (e) => {
        e.preventDefault();
        let payload = {
            "userID": userData,
            "otp": otpnumber
        }

        try {
            const response = await fetch(`${apiUrl}/api/auth/verifyOTP`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const jsonRes = await response.json();
                if (jsonRes.status === "FAILED") {
                    NotificationManager.error(jsonRes.message)
                } else {
                    NotificationManager.success(jsonRes.message)                    
                    window.location='/'
                }
            } else{
                const data = await response.json()
                NotificationManager.error(data.message)
            }
        }
        catch (error) {
            NotificationManager.error(error)
        }

    }

    return (
        <div>
            <Modal
                open={isOtpverifyTab}
            >
                <>
                    <div className="modal fade show" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
                            <div className="modal-content">
                                <CancelOutlined className="closed-modal" onClick={OtpverifyTabClose} />
                                <div className="modal-body">
                                    {/* OTP Verify Div */}

                                    <div id="login-modal" >
                                        <div className="login-form default-form">
                                            <div className="form-inner">
                                                <h3>Verify your Account</h3>

                                                <form method="post"
                                                    onSubmit={accountVerify}
                                                >
                                                    <div className="form-group1">
                                                        <label>OTP: </label>
                                                        <input type="text"
                                                            value={otpnumber} onChange={(e) => setOtpnumber(e.target.value)}
                                                            name="otpnumber" placeholder="Enter your otp" />
                                                    </div>
                                                    <div className="form-group">
                                                        <div className='btn-align'>
                                                            <button className="theme-btn btn-style-one" type="submit" name="verify">
                                                                Verify
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <NotificationContainer />
                    </div>

                </>
            </Modal>

        </div>
    )
}

export default VerifyMail