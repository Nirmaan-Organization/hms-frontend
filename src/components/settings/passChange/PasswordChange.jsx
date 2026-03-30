import { Box, Button, Grid, Input, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const PasswordChange = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userId = userProfile ? userProfile.id : null;


    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    // const [showPassword1, setShowPassword1] = useState(false);
    // const [showPassword2, setShowPassword2] = useState(false);
    // const [showPassword3, setShowPassword3] = useState(false);

    // const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    // const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
    // const handleClickShowPassword3 = () => setShowPassword3((show) => !show);

    const changePassword = async () => {
        let payload = {
            id: userId,
            password: currentPassword,
            newpassword: newPassword,
            newpassword2: confirmPassword,
        }
        console.log('pa', payload);
        try {
            const res = await fetch(`${apiUrl}/api/auth/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                NotificationManager.success(data.message)
                setNewPassword(''); setCurrentPassword(''); setconfirmPassword('');
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error.message)
        }

    }

    return (
        <>
            <Box>
                <Typography variant="h5" gutterBottom>
                Change Password
                </Typography>
                <div
                    style={{
                        padding: 3,
                        borderRadius: '8px',
                        marginTop: 3,
                    }} >
                      <Grid container spacing={2}>
                        {/* Old Password */}
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Old Password</Typography>
                            <Input
                                placeholder="Old Password"
                                type="password"
                                fullWidth
                                sx={{
                                    marginTop: 1,
                                    padding: '6px 12px',
                                    height: '36px',
                                    fontSize: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Grid>

                        {/* New Password */}
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>New Password</Typography>
                            <Input
                                placeholder="New Password"
                                type="password"
                                fullWidth
                                sx={{
                                    marginTop: 1,
                                    padding: '6px 12px',
                                    height: '36px',
                                    fontSize: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Grid>

                        {/* Re-type New Password */}
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Re-type New Password</Typography>
                            <Input
                                placeholder="Re-type New Password"
                                type="password"
                                fullWidth
                                sx={{
                                    marginTop: 1,
                                    padding: '6px 12px',
                                    height: '36px',
                                    fontSize: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }} value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: 2 }}>
                        <Button style={{ height: '25px' }} variant="contained" color="primary" onClick={changePassword}>
                            Update Password
                        </Button>
                    </Box>
                </div>
            </Box>
            <NotificationContainer />

        </>
    )
}

export default PasswordChange