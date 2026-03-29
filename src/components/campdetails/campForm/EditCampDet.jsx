import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import './editCamp.css'


const EditCampDet = ({ fetchData, userData, data, formMode, isOpen, onClose }) => {

    // const apiUrl = process.env.NODE_BACKEND_API_URL;
    const apiUrl = process.env.REACT_APP_API_URL;

    const userID = userData ? userData.id : null;

    const [activityTypes, setActivtyDetails] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/getAllActivityDetls`)
            .then(response => response.json())
            .then(data => {
                setActivtyDetails(data)
            }).catch(err => {

            })
    }, [])

    const [campName, setCampName] = useState(data === null ? '' : data.campName)
    const [campDate, setCampDate] = useState(data === null ? '' : data.campDate)
    const [startTime, setstartTime] = useState(data === null ? '' : data.startTime)
    const [endTime, setendTime] = useState(data === null ? '' : data.endTime)
    const [street, setstreet] = useState(data === null ? '' : data.street)
    const [city, setcity] = useState(data === null ? '' : data.city)
    const [state, setState] = useState(data === null ? '' : data.state)
    const [zipCode, setzipCode] = useState(data === null ? '' : data.zipCode)
    const [description, setdescription] = useState(data === null ? '' : data.description)
    const [timeSlotAllocation, settimeSlotAllocation] = useState(data === null ? '' : data.timeSlotAllocation)


    const [activityType, setactivityType] = useState(data === null ? '' : data.activityType)
    const [otherActivityType, setOtheractivityType] = useState(data === null ? '' : data.otherActivityType)

    const createCampDet = async (e) => {
        e.preventDefault();
        let payload = {
            "campName": campName,
            "campDate": campDate,
            "startTime": startTime,
            "endTime": endTime,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "description": description,
            "activityType": activityType,
            "otherActivityType": otherActivityType,
            "timeSlotAllocation": timeSlotAllocation,
            "created_by": userID,
            "userId": userID
        }

        try {
            const res = await fetch(`${apiUrl}/addCamp`, {
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
            NotificationManager.error(error)
        }
    }


    const updateCampDet = async () => {
        // e.preventDefault();
        let payload = {
            "campName": campName,
            "campDate": campDate,
            "startTime": startTime,
            "endTime": endTime,
            "street": street,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "description": description,
            "activityType": activityType,
            "otherActivityType": otherActivityType,
            "timeSlotAllocation": timeSlotAllocation,
            "created_by": userID,
            "userId": userID
        }
        try {
            if (formMode === 'edit') {
                const res = await fetch(`${apiUrl}/updateCamp/${data.id}`, {
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
                    NotificationManager.error(data.message)
                }
            }
        } catch (error) {
            NotificationManager.error(error.message)
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
                                                    <h3>{data === null ? 'Add Camp Details' : 'Edit Camp Details'}</h3>

                                                    <form method="put" >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={12} sm={6} className="forms-controfl">
                                                                    <label className='required-field'>Camp Name</label>
                                                                    <input type="text" placeholder="Camp Name"
                                                                        value={campName}
                                                                        onChange={(e) => setCampName(e.target.value)} required
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                    <label className='required-field'>Camp date</label>
                                                                    <input type="date" placeholder="Camp date"
                                                                        value={campDate}
                                                                        onChange={(e) => setCampDate(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                    <label className='required-field'>Start Time</label>
                                                                    <input type="time"
                                                                        value={startTime}
                                                                        onChange={(e) => setstartTime(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                    <label className='required-field'>End Time</label>
                                                                    <input type="time"
                                                                        value={endTime}
                                                                        onChange={(e) => setendTime(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={4} className=" forms-controfl">
                                                                    <label className='required-field'>Street</label>
                                                                    <input type="text" placeholder="Street"
                                                                        value={street}
                                                                        onChange={(e) => setstreet(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3} className=" forms-controfl">
                                                                    <label className='required-field'>City</label>
                                                                    <input type="text" placeholder="City"
                                                                        value={city}
                                                                        onChange={(e) => setcity(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3} className=" forms-controfl">
                                                                    <label className='required-field'>State</label>
                                                                    <input type="text" placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={2} className=" forms-controfl">
                                                                    <label className='required-field'>Zip Code</label>
                                                                    <input type="number" placeholder="Zip Code"
                                                                        value={zipCode}
                                                                        onChange={(e) => setzipCode(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} className="forms-controfl">
                                                                    <label>Description</label>
                                                                    <input type="text" placeholder="Description"
                                                                        value={description}
                                                                        onChange={(e) => setdescription(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3} className="forms-controfl">
                                                                    <label>Activity Type </label>
                                                                    {activityType === 'Other' ? (
                                                                        <input type="text" placeholder="Activity Type"
                                                                            value={otherActivityType}
                                                                            onChange={(e) => setOtheractivityType(e.target.value)}
                                                                        />
                                                                    ) :
                                                                        (<select className="jm-job-select"
                                                                            value={activityType} onChange={(e) => setactivityType(e.target.value)}>
                                                                            <option>Select Type</option>
                                                                            {activityTypes === undefined ?
                                                                                <option>Select Type</option> :
                                                                                activityTypes.map((item) => (
                                                                                    <option key={item.id} value={item.activityName}>
                                                                                        {item.activityName}
                                                                                    </option>
                                                                                ))}0
                                                                        </select>
                                                                        )}
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={3} className="forms-controfl">
                                                                    <label>Organizer Name </label>
                                                                    <input type="text" placeholder="Organizer Name"
                                                                        value={userData.organzationName} disabled
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={12} md={6} className="forms-controfl">
                                                                    <label>Assoication with</label>
                                                                    <input type="text" placeholder="Assoication with"
                                                                        value={timeSlotAllocation}
                                                                        onChange={(e) => settimeSlotAllocation(e.target.value)}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <hr />
                                                                <div className='reg-button'>
                                                                    {data === null ?
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={createCampDet}
                                                                            variant="contained" color="success">
                                                                            Create
                                                                        </Button>
                                                                        :
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={updateCampDet}
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
                                                    <h3>View Camp Details</h3>

                                                    <div className='jm-post-job-wrapper mb-40'>
                                                        <hr />
                                                        <Grid container spacing={2} className="row">
                                                            <Grid item xs={12} sm={6} className="forms-controfl">
                                                                <label>Camp Name</label>
                                                                <input type="text"
                                                                    value={campName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                <label>Camp date</label>
                                                                <input type="date"
                                                                    value={campDate} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                <label>Start Time</label>
                                                                <input type="time"
                                                                    value={startTime} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={2} className="forms-controfl">
                                                                <label>End Time</label>
                                                                <input type="time"
                                                                    value={endTime} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} className=" forms-controfl">
                                                                <label>Street</label>
                                                                <input type="text"
                                                                    value={street} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3} className=" forms-controfl">
                                                                <label>City</label>
                                                                <input type="text"
                                                                    value={city} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3} className=" forms-controfl">
                                                                <label>State</label>
                                                                <input type="text"
                                                                    value={state} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={2} className=" forms-controfl">
                                                                <label>Zip Code</label>
                                                                <input type="number"
                                                                    value={zipCode} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} className="forms-controfl">
                                                                <label>Description</label>
                                                                <input type="text"
                                                                    value={description} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3} className="forms-controfl">
                                                                <label>Activity Type </label>
                                                                <input type="text"
                                                                    value={activityType} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={3} className="forms-controfl">
                                                                <label>Organizer Name </label>
                                                                <input type="text"
                                                                    value={userData.organzationName} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={6} className="forms-controfl">
                                                                <label>Assoication with</label>
                                                                <input type="text"
                                                                    value={timeSlotAllocation} disabled
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
                        <NotificationContainer />
                    </div>

                </>
            </Modal >
        </div >
    )
}

export default EditCampDet