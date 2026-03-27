import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import VerifyMail from './VerifyMail';
import headerLogo from '../../../images/hms-logo.png';
import { getApiUrl } from '../../../config';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();


function RegisterPage() {

    const apiUrl = getApiUrl();

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role] = useState('1')
    const [userID, setUserID] = useState('')
    const [otpNumber, setOtpNumber] = useState('')

    const [successMessage, setsuccessMessage] = useState('')


    const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);

    const openForgetModal = async (e) => {
        e.preventDefault();

        setIsForgetModalOpen(true);

    };

    const closeForgetModal = () => {
        setIsForgetModalOpen(false);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fullname') {
            setFullname(value)
        } else if (name === 'email') {
            setEmail(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let payload = {
            "fullName": fullname,
            "email": email,
            "password": password,
            "roleId": Number(role)
        }

        try {
            const response = await fetch(`${apiUrl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                const jsonRes = await response.json()
                if (jsonRes.status === 'FAILED') {
                    NotificationManager.error(jsonRes.message)
                } else {
                    const userID = jsonRes.data
                    setUserID(userID)
                    NotificationManager.success(jsonRes.message);
                    setsuccessMessage(jsonRes.message);
                    window.location = '/'
                    // setIsForgetModalOpen(true);
                }
            } else {
                const data = await response.json()
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error?.message || 'Something went wrong. Please try again.')
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={headerLogo} alt="Logo" className='app-logo' />

                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="fullname"
                                    label="Fullname"
                                    name="fullname"
                                    autoComplete="fullname"
                                    value={fullname} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email} onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password} onChange={handleChange}
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <NotificationContainer />
            {/* <VerifyMail userData={userID} isOtpverifyTab={isForgetModalOpen} OtpverifyTabClose={closeForgetModal} /> */}


        </ThemeProvider>
    );
}


export default RegisterPage;