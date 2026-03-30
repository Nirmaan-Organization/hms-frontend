import { Box, Button, Grid, Input, MenuItem, Paper, Select, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PasswordChange from './passChange/PasswordChange';
import { NotificationManager } from 'react-notifications';

const ProfileScreen = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)

    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        contactNo: '',
        emailId: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        role: '',

    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const [userRoles, setuserRoles] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllRoles`)
            .then(response => response.json())
            .then(data => {
                setuserRoles(data)
            }).catch(err => {

            })
        fetch(`${apiUrl}/getUser/${userProfile.id}`)
            .then(response => response.json())
            .then(data => {
                setFormData({
                    fullName: data.fullName || '',
                    dateOfBirth: data.dateOfBirth || '',
                    contactNo: data.contactNo || '',
                    emailId: data.email || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipCode: data.zipCode || '',
                    role: data.roles.id || ''
                });
            }).catch(err => {

            })
    }, [])


    const handleUpdate = () => {
        // Perform basic validation
        if (!formData.fullName || !formData.emailId || !formData.contactNo) {
            alert('Please fill out all required fields.');
            return;
        }

        // Make an API call to update the user profile
        fetch(`${apiUrl}/updateUser/${userProfile.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    NotificationManager.success('Profile updated successfully!')
                } else {
                    NotificationManager.error('Failed to update profile.');
                }
            })
            .catch((err) => {
            });
    };
    return (
        <Box sx={{ display: 'flex', p: 3, gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Sidebar */}
            <Paper
                sx={{
                    width: isMobile ? '100%' : 200,
                    padding: 2,
                    height: '100vh',
                    borderRadius: '8px',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#f4f4f4',
                }}
            >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Personal
                </Typography>
                <Tabs
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        alignItems: 'flex-start',
                        '& .MuiTab-root': {
                            fontSize: '14px',
                            fontWeight: '600',
                            minWidth: '150px',
                            padding: '12px',
                            textTransform: 'none',
                        },
                        '& .MuiTab-root.Mui-selected': {
                            backgroundColor: '#d0eaff',
                            color: '#0056b3',
                            borderRadius: '8px',
                        },
                        '& .MuiTab-root:hover': {
                            backgroundColor: '#e0f0ff',
                            color: '#0056b3',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <Tab label="Account" />
                    <Tab label="Security" />
                </Tabs>
            </Paper>

            {/* Main Content Area */}
            <Paper
                sx={{
                    flexGrow: 1,
                    padding: 3,
                    borderRadius: '8px',
                    width: isMobile ? '100%' : 'auto',
                }}
            >
                {activeTab === 0 && (
                    <Box >
                        <Typography variant="h5" gutterBottom>
                            Basic Information
                        </Typography>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <CustomAvatar src="https:
                            <Button variant="text" color="error">
                                Remove
                            </Button>
                        </Box> */}

                        <Box sx={{ padding: 3 }}>
                            <form style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Grid container spacing={2}>
                                    {/* Full Name and Date of Birth */}
                                    <Grid item xs={7}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Full Name</Typography>
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter full name"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Date of Birth</Typography>
                                        <Input
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                '& input': {
                                                    height: '36px !important',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    marginTop: '6px !important',
                                                    marginBottom: '0px !important',
                                                    fontSize: '11px',
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Role</Typography>
                                        <Select
                                            labelId="role-label"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }} >
                                            {userRoles === undefined ?
                                                <MenuItem sx={{ fontSize: '11px' }} value="">Select Role</MenuItem> :
                                                userRoles.map((item) => (
                                                    <MenuItem sx={{ fontSize: '11px' }} key={item.id} value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </Grid>
                                    {/* Mobile Number and Email */}
                                    <Grid item xs={4}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Mobile Number</Typography>
                                        <Input
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter mobile number"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Email Address</Typography>
                                        <Input
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            fullWidth
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>

                                    {/* Address */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Address</Typography>
                                        <Input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter address"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>

                                    {/* City, State, Zipcode */}
                                    <Grid item xs={4}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>City</Typography>
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter city"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>State</Typography>
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter state"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: '600' }}>Zip Code</Typography>
                                        <Input
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            fullWidth
                                            placeholder="Enter zip code"
                                            sx={{
                                                marginTop: 1,
                                                padding: '6px 12px',
                                                height: '36px',
                                                fontSize: '11px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Grid>

                                    {/* Save Button */}
                                    <Grid item xs={12} sx={{ marginTop: 2 }}>
                                        <div className='reg-button'>
                                            <Button style={{ height: '25px' }} variant="contained" color="success"
                                                onClick={handleUpdate}>
                                                Update Profile
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Box>
                )}

                {activeTab === 1 && (
                    <PasswordChange />
                )}
            </Paper>
        </Box>
    );
};

export default ProfileScreen;
