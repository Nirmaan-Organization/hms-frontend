import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import './editAllVolunteer.css'


const EditAllVolunteerDet = ({ fetchVoluntrData, campIdD, userID, data, formMode, isOpen, onClose }) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [fullName, setfullName] = useState(data === null ? '' : data.volunteerName)
    const [dateOfBirth, setDateOfBirth] = useState(data === null ? '' : data.dateOfBirth)
    const [contactNo, setcontactNO] = useState(data === null ? '' : data.users.contactNo)
    const [email, setemailID] = useState(data === null ? '' : data.users.email)
    const [street, setstreet] = useState(data === null ? '' : data.street)
    const [city, setcity] = useState(data === null ? '' : data.city)
    const [state, setState] = useState(data === null ? '' : data.state)
    const [zipCode, setzipCode] = useState(data === null ? '' : data.zipCode)
    const [skillExpertise, setskillExpertise] = useState(data === null ? '' : data.skillExpertise)
    const [isSlotPicks, setisSlotPicks] = useState(data === null ? '' : data.isSlotPicks)


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
            "skillExpertise": skillExpertise,
            "isSlotPicks": isSlotPicks,
            "created_by": userID,
            // "campId":campIdD,
        }

        try {
            const res = await fetch(`${apiUrl}/addVolunteer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'SUCCESS') {
                    await fetchVoluntrData();
                    NotificationManager.success(data.message)
                    onClose();
                } else {
                    NotificationManager.error(data.message)
                }
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error.message)
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
            "skillExpertise": skillExpertise,
            "isSlotPicks": isSlotPicks,
            "created_by": userID,
            // "campId":campIdD
        }

        try {
            if (formMode === 'edit') {
                const res = await fetch(`${apiUrl}/updateVolunteer/${data.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    await fetchVoluntrData();
                    NotificationManager.success(data.message)
                    onClose();

                } else {
                    const data = await res.json();
                    NotificationManager.error(data.message)
                }
            }
        } catch (error) {
            NotificationManager.error(error)
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
                                                    <h3>{data === null ? 'Add Volunteer Details' : 'Edit Volunteer Details'}</h3>

                                                    <form method="put" >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={12} sm={4} md={6} className="forms-controfl">
                                                                    <label className='required-field'>Volunteer Name</label>
                                                                    <input type="text" placeholder="Volunteer Name"
                                                                        value={fullName}
                                                                        onChange={(e) => setfullName(e.target.value)} required
                                                                    />

                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={3} className="forms-controfl">
                                                                    <label>Date of Birth</label>
                                                                    <input type="date"
                                                                        value={dateOfBirth}
                                                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={3} className="forms-controfl">
                                                                    <label className='required-field'>Contact No</label>
                                                                    {data === null ?
                                                                        <input type="number"
                                                                            value={contactNo} placeholder="Contact No" required
                                                                            onChange={(e) => setcontactNO(e.target.value)}
                                                                        /> : <input type="number"
                                                                            value={contactNo} placeholder="Contact No" disabled
                                                                        />}
                                                                </Grid>

                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label className='required-field'>Email ID</label>
                                                                    {data === null ?
                                                                        <input type="text" placeholder="Email ID"
                                                                            value={email}
                                                                            onChange={(e) => setemailID(e.target.value)} required
                                                                        /> :
                                                                        <input type="text" placeholder="Email ID"
                                                                            value={email} disabled
                                                                        />
                                                                    }
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={8} className=" forms-controfl">
                                                                    <label>Street</label>
                                                                    <input type="text" placeholder="Street"
                                                                        value={street}
                                                                        onChange={(e) => setstreet(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>City</label>
                                                                    <input type="text" placeholder="City"
                                                                        value={city}
                                                                        onChange={(e) => setcity(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>State</label>
                                                                    <input type="text" placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>Zip Code</label>
                                                                    <input type="number" placeholder="Zip Code"
                                                                        value={zipCode}
                                                                        onChange={(e) => setzipCode(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>Skill Expertise</label>
                                                                    <input type="text" placeholder="Skill Expertise"
                                                                        value={skillExpertise}
                                                                        onChange={(e) => setskillExpertise(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className="forms-controfl">
                                                                    <label>Opt-in for events created and Pick Slots</label>
                                                                    <input type="text" placeholder="Slot Picks"
                                                                        value={isSlotPicks}
                                                                        onChange={(e) => setisSlotPicks(e.target.value)}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={12}>
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
                                                    <h3>View Volunteer Details</h3>

                                                    <div className='jm-post-job-wrapper mb-40'>
                                                        <hr />
                                                        <Grid container spacing={2} className="row">

                                                            <Grid item xs={12} sm={4} md={6} className="forms-controfl">
                                                                <label>Volunteer Name</label>
                                                                <input type="text"
                                                                    value={fullName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={3} className="forms-controfl">
                                                                <label>Date of Birth</label>
                                                                <input type="date"
                                                                    value={dateOfBirth} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={3} className="forms-controfl">
                                                                <label>Contact NO</label>
                                                                <input type="text"
                                                                    value={contactNo} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>Email ID</label>
                                                                <input type="text"
                                                                    value={email} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={8} className=" forms-controfl">
                                                                <label>Street</label>
                                                                <input type="text"
                                                                    value={street} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>City</label>
                                                                <input type="text"
                                                                    value={city} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>State</label>
                                                                <input type="text"
                                                                    value={state} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>Zip Code</label>
                                                                <input type="text"
                                                                    value={zipCode} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                <label>Skill Expertise</label>
                                                                <input type="text"
                                                                    value={skillExpertise} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4} className="forms-controfl">
                                                                <label>isSlotPicks</label>
                                                                <input type="text"
                                                                    value={isSlotPicks} disabled
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

export default EditAllVolunteerDet