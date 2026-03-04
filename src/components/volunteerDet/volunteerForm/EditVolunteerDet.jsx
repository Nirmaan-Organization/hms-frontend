import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import './editVolunteer.css'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getApiUrl } from '../../../config';


const EditVolunteerDet = ({ fetchVoluntrData, userID, data, formMode, isOpen, onClose }) => {

    // const apiUrl = process.env.NODE_BACKEND_API_URL;

    const apiUrl = getApiUrl();

    const [preferredRoleList, setPreferredRoles] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/getAllRoles`)
            .then(response => response.json())
            .then(data => {
                setPreferredRoles(data)
            }).catch(err => {

            })
    }, [])

    const [campDetls, setCampDetls] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllCampNames`)
            .then(response => response.json())
            .then(data => {
                setCampDetls(data)
            }).catch(err => {

            })
    }, [])

    const [fullName, setfullName] = useState(data === null ? '' : data.fullName)
    const [dateOfBirth, setDateOfBirth] = useState(data === null ? '' : data.dateOfBirth)
    const [contactNO, setcontactNO] = useState(data === null ? '' : data.contactNO)
    const [email, setemailID] = useState(data === null ? '' : data.email)
    const [roleId, setpreferredRole] = useState(data === null ? '' : data.roleId)
    const [rolename, setrolename] = useState(data === null ? '' : data.roles.name)
    const [street, setstreet] = useState(data === null ? '' : data.street)
    const [city, setcity] = useState(data === null ? '' : data.city)
    const [state, setState] = useState(data === null ? '' : data.state)
    const [zipCode, setzipCode] = useState(data === null ? '' : data.zipCode)
    const [skillExpertise, setskillExpertise] = useState(data === null ? '' : data.skillExpertise)
    const [isSlotPicks, setisSlotPicks] = useState(data === null ? '' : data.isSlotPicks)
    const [campID, setcampID] = useState(data === null ? null : data.campID)

    const [campRecord, setcampRecord] = useState('')

    useEffect(() => {
        fetch(`${apiUrl}/getOneCamp/${campID}`)
            .then(response => response.json())
            .then(data => {
                setcampRecord(data)
            }).catch(err => {

            })
    }, [])


    const addVolunteerDetls = async (e) => {
        e.preventDefault();
        let payload = {
            "fullName": fullName,
            "dateOfBirth": dateOfBirth,
            "contactNO": contactNO,
            "email": email,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "skillExpertise": skillExpertise,
            "roleId": roleId,
            "isSlotPicks": isSlotPicks,
            "created_by": userID,
            "campID": 1
        }

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
                await fetchVoluntrData();
                NotificationManager.success(data.message)
                onClose();
            } else {
                const data = await res.json();
                NotificationManager.success(data.message)
            }
        } catch (error) {
            NotificationManager.success(error.message)
        }
    }


    const updateVolunteerDetls = async () => {
        // e.preventDefault();
        let payload = {
            "fullName": fullName,
            "dateOfBirth": dateOfBirth,
            "contactNO": contactNO,
            "email": email,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "skillExpertise": skillExpertise,
            "roleId": roleId,
            "isSlotPicks": isSlotPicks,
            "created_by": userID,
            "campID": campID
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
                    await fetchVoluntrData();
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
                                                    <h3>{data === null ? 'Add Volunteer Details' : 'Edit Volunteer Details'}</h3>

                                                    <form method="put"
                                                    //  onSubmit={onUpdatePostDetails}
                                                    >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={7} className="forms-controfl">
                                                                    <label>Camp Name</label>
                                                                    <select className="jm-job-select"
                                                                        value={campID} onChange={(e) => setcampID(e.target.value)}>
                                                                        <option>Select Camp</option>
                                                                        {campDetls === undefined ?
                                                                            <option>Select Camp</option> :
                                                                            campDetls.map((item) => (
                                                                                <option key={item.id} value={item.id}>
                                                                                    {item.campName}
                                                                                </option>
                                                                            ))}

                                                                    </select>

                                                                </Grid>
                                                                <Grid item xs={5} className="forms-controfl">
                                                                    <label>Volunteer Name</label>
                                                                    <input type="text" placeholder="Volunteer Name"
                                                                        value={fullName}
                                                                        onChange={(e) => setfullName(e.target.value)} required
                                                                    />

                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Date of Birth</label>
                                                                    <input type="date"
                                                                        value={dateOfBirth}
                                                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Contact NO</label>
                                                                    <input type="number"
                                                                        value={contactNO} placeholder="Contact No" required
                                                                        onChange={(e) => setcontactNO(e.target.value)}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Email ID</label>
                                                                    <input type="text" placeholder="Email ID"
                                                                        value={email}
                                                                        onChange={(e) => setemailID(e.target.value)} required
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={8} className=" forms-controfl">
                                                                    <label>Street</label>
                                                                    <input type="text" placeholder="Street"
                                                                        value={street}
                                                                        onChange={(e) => setstreet(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>City</label>
                                                                    <input type="text" placeholder="City"
                                                                        value={city}
                                                                        onChange={(e) => setcity(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>State</label>
                                                                    <input type="text" placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Zip Code</label>
                                                                    <input type="number" placeholder="Zip Code"
                                                                        value={zipCode}
                                                                        onChange={(e) => setzipCode(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Skill Expertise</label>
                                                                    <input type="text" placeholder="Skill Expertise"
                                                                        value={skillExpertise}
                                                                        onChange={(e) => setskillExpertise(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Preferred Role </label>
                                                                    <select className="jm-job-select"
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
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Opt-in for events created and Pick Slots</label>
                                                                    <input type="text" placeholder="Slot Picks"
                                                                        value={isSlotPicks}
                                                                        onChange={(e) => setisSlotPicks(e.target.value)}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <hr />
                                                                <div style={{ textAlign: 'right', marginTop:'10px' }}>
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
                                                            <Grid item xs={6} className="forms-controfl">
                                                                <label>Camp Name</label>
                                                                <input type="text"
                                                                    value={campRecord.campName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Volunteer Name</label>
                                                                <input type="text"
                                                                    value={fullName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>Date of Birth</label>
                                                                <input type="date"
                                                                    value={dateOfBirth} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Contact NO</label>
                                                                <input type="text"
                                                                    value={contactNO} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Email ID</label>
                                                                <input type="text"
                                                                    value={email} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Street</label>
                                                                <input type="text"
                                                                    value={street} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>City</label>
                                                                <input type="text"
                                                                    value={city} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>State</label>
                                                                <input type="text"
                                                                    value={state} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Zip Code</label>
                                                                <input type="text"
                                                                    value={zipCode} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Skill Expertise</label>
                                                                <input type="text"
                                                                    value={skillExpertise} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Preferred Role </label>
                                                                <input type="text"
                                                                    value={rolename} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
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

export default EditVolunteerDet