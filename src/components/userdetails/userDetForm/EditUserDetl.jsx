import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NotificationManager } from 'react-notifications'
import './editUser.css'


const EditUserDetl = ({ fetchData, userData, data, formMode, isOpen, onClose }) => {

    // const apiUrl = process.env.NODE_BACKEND_API_URL;

    const apiUrl = process.env.REACT_APP_API_URL;
    const userID = userData ? userData.id : null;

    const [preferredRoleList, setPreferredRoles] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllRoles`)
            .then(response => response.json())
            .then(data => {
                setPreferredRoles(data)
            }).catch(err => {

            })
    }, [])

    const [organizationList, setOrganizationList] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllOrgnDetls`)
            .then(response => response.json())
            .then(data => {
                setOrganizationList(data)
            }).catch(err => {

            })
    }, [])


    const [fullName, setfullName] = useState(data === null ? '' : data.fullName)
    const [dateOfBirth, setDateOfBirth] = useState(data === null ? '' : data.dateOfBirth)
    const [contactNo, setcontactNo] = useState(data === null ? '' : data.contactNo)
    const [email, setemailID] = useState(data === null ? '' : data.email)
    const [roleId, setpreferredRole] = useState(data === null ? '' : data.roleId)
    const [street, setstreet] = useState(data === null ? '' : data.street)
    const [city, setcity] = useState(data === null ? '' : data.city)
    const [state, setState] = useState(data === null ? '' : data.state)
    const [zipCode, setzipCode] = useState(data === null ? '' : data.zipCode)
    const [organizationDetId, setorganizationDetId] = useState(data === null ? '' : data.organizationDetId)



    const addVolunteerDetls = async (e) => {
        e.preventDefault();
        let payload = {
            "fullName": fullName,
            "dateOfBirth": dateOfBirth,
            "contactNo": contactNo,
            "email": email,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "roleId": roleId,
            "created_by": userID,
            "organizationDetId": organizationDetId,
            "organizerId": organizationDetId
        }
        if (fullName === '' || contactNo === '' || email === '' || roleId === '') {
            NotificationManager.error('Please fill mandatory fields')
        } else {

            try {
                const res = await fetch(`${apiUrl}/adduser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    await fetchData();
                    NotificationManager.success(data.message)
                    onClose();
                } else {
                    const data = await res.json();
                    NotificationManager.error(data.message)
                }
            } catch (error) {
                NotificationManager.error(error.message)
            }
        }
    }


    const updateVolunteerDetls = async () => {
        // e.preventDefault();
        let payload = {
            "fullName": fullName,
            "dateOfBirth": dateOfBirth,
            "contactNo": contactNo,
            "email": email,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "roleId": roleId,
            "created_by": userID,
            "organizationDetId": organizationDetId,
            "organizer_Id": organizationDetId
        }

        try {
            if (formMode === 'edit') {
                const res = await fetch(`${apiUrl}/updateUser/${data.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    await fetchData();
                    NotificationManager.success(data.message)
                    onClose();

                } else {
                    const data = await res.json();
                    NotificationManager.success(data.message)
                }
            }
        } catch (error) {
            NotificationManager.success(error)
        }
    }





    return (
        <div>
            <Modal
                open={isOpen}
            >
                <>
                    <div style={{ display: "block" }}>
                        <div className="editjobmodal " id="editjobPopupModal" style={{ display: "block" }} role="dialog">
                            <div className="editjobmodal-dialog editjobmodal-lg editjobmodal-dialog-centered editjob-editjobmodal editjobmodal-dialog-scrollable">
                                <div className="editjobmodal-content">
                                    <CancelOutlined className="closed-editjobmodal" onClick={onClose} />
                                    <div className="editjobmodal-body">
                                        <div id="editjob-editjobmodal">
                                            <div className="editjob-form default-form">
                                                <div className="form-inner" style={formMode === 'view' ? { display: 'none' } : { display: 'block' }}>
                                                    <h3>{data === null ? 'Add User Details' : 'Edit User Details'}</h3>

                                                    <form method="put"
                                                    //  onSubmit={onUpdatePostDetails}
                                                    >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item  xs={12} sm={4} md={5} className="forms-controfl">
                                                                    <label className='required-field'>Full Name</label>
                                                                    <input type="text" placeholder="Full Name"
                                                                        value={fullName}
                                                                        onChange={(e) => setfullName(e.target.value)} required
                                                                    />

                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={3} className="forms-controfl">
                                                                    <label >Date of Birth</label>
                                                                    <input type="date"
                                                                        value={dateOfBirth}
                                                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                    <label className='required-field'>Contact No</label>
                                                                    <input type="number"
                                                                        value={contactNo} placeholder="Enter 10-digit number" required
                                                                        onChange={(e) => setcontactNo(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label className='required-field'>Email ID</label>
                                                                    <input type="text" placeholder="Email ID"
                                                                        value={email}
                                                                        onChange={(e) => setemailID(e.target.value)} required
                                                                    />
                                                                </Grid>

                                                                <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                    <label className='required-field'> Preferred Role </label>
                                                                    <select className="jm-job-select" required
                                                                        value={roleId} onChange={(e) => setpreferredRole(e.target.value)}>
                                                                        <option>Select Role</option>
                                                                        {preferredRoleList === undefined ?
                                                                            <option>Select Role</option> :
                                                                            preferredRoleList.map((item) => (
                                                                                <option key={item.id} value={item.id}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}

                                                                    </select>
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                    <label>Organizer Name </label>
                                                                    <select className="jm-job-select" required
                                                                        value={organizationDetId} onChange={(e) => setorganizationDetId(e.target.value)}>
                                                                        <option>Select Organization</option>
                                                                        {organizationList === undefined ?
                                                                            <option>Select Organization</option> :
                                                                            organizationList.map((item) => (
                                                                                <option key={item.id} value={item.id}>
                                                                                    {item.orgName}
                                                                                </option>
                                                                            ))}

                                                                    </select>
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>Street</label>
                                                                    <input type="text" placeholder="Street"
                                                                        value={street}
                                                                        onChange={(e) => setstreet(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={3} className=" forms-controfl">
                                                                    <label>City</label>
                                                                    <input type="text" placeholder="City"
                                                                        value={city}
                                                                        onChange={(e) => setcity(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={3} className=" forms-controfl">
                                                                    <label>State</label>
                                                                    <input type="text" placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item  xs={12} sm={4} md={2} className=" forms-controfl">
                                                                    <label>Zip Code</label>
                                                                    <input type="number" placeholder="Zip Code"
                                                                        value={zipCode}
                                                                        onChange={(e) => setzipCode(e.target.value)}
                                                                    />
                                                                </Grid>


                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={12}>
                                                                <hr />
                                                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                                    {data === null ?
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={addVolunteerDetls}
                                                                            variant="contained" color="success">
                                                                            Create
                                                                        </Button>
                                                                        :
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={updateVolunteerDetls}
                                                                            variant="contained" color="success">
                                                                            Update
                                                                        </Button>
                                                                    }
                                                                </div>
                                                            </Grid>
                                                        </div>

                                                    </form>
                                                </div>
                                                <div className="form-inner" style={formMode === 'view' ? { display: 'block' } : { display: 'none' }}>
                                                    <h3>View User Details</h3>

                                                    <div className='jm-post-job-wrapper mb-40'>
                                                        <hr />
                                                        <Grid container spacing={2} className="row">

                                                            <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Volunteer Name</label>
                                                                <input type="text"
                                                                    value={fullName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={2} className="forms-controfl">
                                                                <label>Date of Birth</label>
                                                                <input type="date"
                                                                    value={dateOfBirth} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Contact NO</label>
                                                                <input type="text"
                                                                    value={contactNo} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Email ID</label>
                                                                <input type="text"
                                                                    value={email} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Preferred Role </label>
                                                                <input type="text"
                                                                    value={data === null ? '' : data.roles.name} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Organization Name </label>
                                                                <input type="text"
                                                                    value={data === null ? '' : data.organizationDet.orgName} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>Street</label>
                                                                <input type="text"
                                                                    value={street} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>City</label>
                                                                <input type="text"
                                                                    value={city} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>State</label>
                                                                <input type="text"
                                                                    value={state} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item  xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>Zip Code</label>
                                                                <input type="text"
                                                                    value={zipCode} disabled
                                                                />
                                                            </Grid>



                                                        </Grid>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </Modal >
        </div >
    )
}

export default EditUserDetl