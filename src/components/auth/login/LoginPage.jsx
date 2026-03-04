import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ForgetPassword from '../forgetPassword/ForgetPassword';
import { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import headerLogo from '../../../images/hms-logo.png';
import { getApiUrl } from '../../../config';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
function LoginPage() {

    const apiUrl = getApiUrl();

    const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);

    const openForgetModal = async (e) => {
        e.preventDefault();

        setIsForgetModalOpen(true);

    };

    const closeForgetModal = () => {
        setIsForgetModalOpen(false);
    };

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleForms = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let loginData = {
            "email": email,
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
                    <img src={headerLogo} alt="Logo" className='app-logo'/>

                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email} onChange={handleForms}
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
                                    value={password} onChange={handleForms}
                                />
                            </Grid>
                        </Grid>
                        {/* <Grid container justifyContent="flex-start">
                            <Grid item>
                                <Link href="/signup" variant="body2" onClick={openForgetModal}>
                                    Forget Password?
                                </Link>
                            </Grid>
                        </Grid> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    Create a new account? Sign up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
            <NotificationContainer />
            <ForgetPassword ispassChangeOpen={isForgetModalOpen} onpasschangeClose={closeForgetModal} />

        </ThemeProvider>
    );
}


export default LoginPage;