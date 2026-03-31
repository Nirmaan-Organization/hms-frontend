import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './login.css';
import headerLogo from '../../../images/hms-logo.png';
import ForgetPassword from '../forgetPassword/ForgetPassword';

// TODO remove, this demo shouldn't need to reset the theme.

function LoginPage() {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);
    const openForgetModal = async (e) => {
        e.preventDefault();
        setIsForgetModalOpen(true);
    };
    const closeForgetModal = () => {
        setIsForgetModalOpen(false);
    };

    const [emailorContactNo, setEmailorContactNo] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleForms = (e) => {
        const { name, value } = e.target;
        if (name === 'emailorContactNo') {
            setEmailorContactNo(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let loginData = {
            // Send both keys for backward/forward compatibility with deployed APIs
            "emailorContactNo": emailorContactNo,
            "email": emailorContactNo,
            "password": password
        }
        try {
            const response = await fetch(`${apiUrl}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data.role,'dilipppp');
                NotificationManager.success('Login successfully')
                localStorage.setItem('userData', JSON.stringify(data))
 
                window.location = '/dashboard'
            } else {
                const data = await response.json()
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error)
        }
    };

    //    console.log(localStorage.getItem('userData'));

    return (
        <div>
            <Container>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={headerLogo} alt="" className="app-logo" />

                    <Typography
                        component="h1"
                        variant="h5"
                        className="login-headername"
                        sx={{ mt: 2, mb: 0.5, textAlign: 'center', fontWeight: 600, maxWidth: 420 }}
                    >
                        Nirmaan Health Management System
                    </Typography>

                    <Typography component="h2" variant="h6" className="login-headername" sx={{ mb: 1, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }}>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address or Contact No"
                                    name="emailorContactNo"
                                    autoComplete="email"
                                    value={emailorContactNo} onChange={handleForms}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                    value={password} onChange={handleForms}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-start">
                            <Grid item>
                                <Link href="/signup" variant="body2" onClick={openForgetModal}>
                                    Forget Password?
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Button
                                className='btn-login'
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Grid>
                        {/* <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    Create a new account? Sign up
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>

            </Container>
            <NotificationContainer />
            <ForgetPassword ispassChangeOpen={isForgetModalOpen} onpasschangeClose={closeForgetModal} />

        </div>
    );
}


export default LoginPage;