import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import '../login/login.css'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { CancelOutlined } from '@mui/icons-material';
// import { useLocation } from 'react-router-dom'
import { getApiUrl } from '../../../config';


const ForgetPassword = ({ ispassChangeOpen, onpasschangeClose }) => {

    const apiUrl = getApiUrl();


    const [emailID, setEmailID] = useState('');
    const [userID, setUserID] = useState('')
    const [otpnumber, setOtpnumber] = useState('')

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [forgettab, setforgettab] = useState(true);
    const [verifytab, setverifytab] = useState(false);
    const [passchangetab, setPasschangetab] = useState(false);

    const forgetPasswordSubmit = async (e) => {
        e.preventDefault();


        let payload = {
            "email": emailID
        }
        try {
            const response = await fetch(`${apiUrl}/api/auth/forgetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.status === "FAILED") {
                    NotificationManager.error(jsonResponse.message);
                } else {
                    const { userID } = jsonResponse.data;
                    // Access the userID
                    setUserID(userID);
                    NotificationManager.success(jsonResponse.message);
                    setforgettab(!forgettab)
                    setverifytab(true)
                }
            } else {
                // Handle login error
                const data = await response.json();
                NotificationManager.error(data.message);
            }
        } catch (error) {
            NotificationManager.error(error);
        }
    }

    const accountVerify = async (e) => {
        e.preventDefault();

        let payload = {
            "userID": userID,
            "otp": otpnumber,
            "password": password1,
            "password2": password2
        }

        try {
            const response = await fetch(`${apiUrl}/api/auth/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.status === "FAILED") {
                    NotificationManager.error(jsonResponse.message);
                } else {
                    NotificationManager.success(jsonResponse.message);
                    setverifytab(!verifytab);
                    onpasschangeClose()
                    setPasschangetab(true)
                }
            } else {
                // Handle login error
                const data = await response.json();
                NotificationManager.error(data.message);
            }
        } catch (error) {
            NotificationManager.error(error);
        }
    }

    // const resetPasswordsubmit = async (e) => {
    //     e.preventDefault();
    //     setPasschangetab(!passchangetab)
    //     onpasschangeClose()
    // }

    if (!ispassChangeOpen) return null;

    return (
        <div>
            <Modal
                open={ispassChangeOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <div className="modal fade show" id="registerModal" style={{ display: 'block' }} aria-modal="true" role="dialog">
                        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
                            <div className="modal-content">
                                <CancelOutlined className="closed-modal" onClick={onpasschangeClose} />
                                <div className="modal-body">

                                    {/* Forget Password Div */}
                                    <div id="login-modal" style={{ display: forgettab ? "block" : 'none' }} >
                                        <div className="login-form default-form">
                                            <div className="form-inner">
                                                <h3>Forgot Password</h3>

                                                <form method="post" onSubmit={forgetPasswordSubmit}>
                                                    <div className="form-group1">
                                                        <label>Email ID</label>
                                                        <input type="text" name="emailid"
                                                            value={emailID} onChange={(e) => setEmailID(e.target.value)}
                                                            placeholder="Email ID" />
                                                    </div>
                                                    <div className="form-group">
                                                        <div className='btn-align'>
                                                            <button
                                                                className="theme-btn btn-style-one" type="submit" name="log-in">Generate OTP
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OTP Verify Div */}

                                    <div id="login-modal" style={{ display: verifytab ? "block" : 'none' }} >
                                        <div className="login-form default-form">
                                            <div className="form-inner">
                                                <h3>Verify your Account</h3>

                                                <form method="post" onSubmit={accountVerify}>
                                                    <div className="form-group1">
                                                        <label>OTP: </label>
                                                        <input type="text"
                                                            value={otpnumber} onChange={(e) => setOtpnumber(e.target.value)}
                                                            name="otpnumber" placeholder="Enter your otp" />
                                                    </div>
                                                    <div className="form-group1">
                                                        <label>Password</label>
                                                        <input type="password"
                                                            value={password1} onChange={(e) => setPassword1(e.target.value)}
                                                            name="password1" placeholder="password" />
                                                    </div>
                                                    <div className="form-group1">
                                                        <label>Confirm Password</label>
                                                        <input
                                                            value={password2} onChange={(e) => setPassword2(e.target.value)}
                                                            type="password" name="password2" placeholder="confirm password" />
                                                    </div>
                                                    <div className="form-group">
                                                        <div className='btn-align'>
                                                            <button className="theme-btn btn-style-one" type="submit" name="register">Verify</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <NotificationContainer />
                </>
            </Modal>

        </div>
    )
}

export default ForgetPassword