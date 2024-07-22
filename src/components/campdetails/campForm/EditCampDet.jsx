import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import './editCamp.css'
import { NotificationContainer, NotificationManager } from 'react-notifications';


const EditCampDet = ({ fetchData, userID, data, formMode, isOpen, onClose }) => {

    // const apiUrl = process.env.NODE_BACKEND_API_URL;

    const apiUrl = process.env.REACT_APP_API_URL;

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
    const [location, setlocation] = useState(data === null ? '' : data.location)
    const [description, setdescription] = useState(data === null ? '' : data.description)
    const [timeSlotAllocation, settimeSlotAllocation] = useState(data === null ? '' : data.timeSlotAllocation)


    const [activityType, setactivityType] = useState(data === null ? '' : data.activityType)
    // const handledSelectedTypes = (e) =>{
    //     const options = e.target.options;
    //     const selectedValue = []
    //     for(let i=0;i<options.lenght;i++){
    //         if(options[i].selected){
    //             selectedValue.push(options[i].value)
    //         }
    //     }
    //     setactivityType(selectedValue)
    // }
    const createCampDet = async (e) => {
        e.preventDefault();
        let payload = {
            "campName": campName,
            "campDate": campDate,
            "startTime": startTime,
            "endTime": endTime,
            "location": location,
            "description": description,
            "activityType": activityType,
            "timeSlotAllocation": timeSlotAllocation,
            "created_by": userID,
            "organizerID": 1
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
                NotificationManager.success(data.message)
            }
        } catch (error) {
            NotificationManager.success(error)
        }
    }


    const updateCampDet = async () => {
        // e.preventDefault();
        let payload = {
            "campName": campName,
            "campDate": campDate,
            "startTime": startTime,
            "endTime": endTime,
            "location": location,
            "description": description,
            "activityType": activityType,
            "timeSlotAllocation": timeSlotAllocation,
            "created_by": userID,
            "organizerID": 1
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
                                                    <h3>{data === null ? 'Add Camp Details' : 'Edit Camp Details'}</h3>

                                                    <form method="put"
                                                    //  onSubmit={onUpdatePostDetails}
                                                    >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={6} className="forms-controfl">
                                                                    <label>Camp Name</label>
                                                                    <input type="text" placeholder="Camp Name"
                                                                        value={campName}
                                                                        onChange={(e) => setCampName(e.target.value)} required
                                                                    />

                                                                </Grid>
                                                                <Grid item xs={2} className="forms-controfl">
                                                                    <label>Camp date</label>
                                                                    <input type="date" placeholder="Camp date"
                                                                        value={campDate}
                                                                        onChange={(e) => setCampDate(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={2} className="forms-controfl">
                                                                    <label>Start Time</label>
                                                                    <input type="time"
                                                                        value={startTime}
                                                                        onChange={(e) => setstartTime(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={2} className="forms-controfl">
                                                                    <label>End Time</label>
                                                                    <input type="time"
                                                                        value={endTime}
                                                                        onChange={(e) => setendTime(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Location</label>
                                                                    <input type="text" placeholder="Location"
                                                                        value={location}
                                                                        onChange={(e) => setlocation(e.target.value)} required
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={8} className="forms-controfl">
                                                                    <label>Description</label>
                                                                    <input type="text" placeholder="Description"
                                                                        value={description}
                                                                        onChange={(e) => setdescription(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Activity Type </label>
                                                                    <select className="jm-job-select"
                                                                        value={activityType} onChange={(e) => setactivityType(e.target.value)}>
                                                                        <option>Select Type</option>
                                                                        {activityTypes === undefined ?
                                                                            <option>Select Type</option> :
                                                                            activityTypes.map((item) => (
                                                                                <option key={item.id} value={item.activityName}>
                                                                                    {item.activityName}
                                                                                </option>
                                                                            ))}

                                                                    </select>
                                                                </Grid>
                                                                <Grid item xs={6} className="forms-controfl">
                                                                    <label>Time Slot Allocation</label>
                                                                    <input type="text" placeholder="Start Time, End Time"
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
                                                            <Grid item xs={6} className="forms-controfl">
                                                                <label>Camp Name</label>
                                                                <input type="text" placeholder="Camp Name"
                                                                    value={campName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>Camp date</label>
                                                                <input type="date" placeholder="Camp date"
                                                                    value={campDate} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>Start Time</label>
                                                                <input type="time"
                                                                    value={startTime} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>End Time</label>
                                                                <input type="time"
                                                                    value={endTime} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Location</label>
                                                                <input type="text" placeholder="Location"
                                                                    value={location} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={8} className="forms-controfl">
                                                                <label>Description</label>
                                                                <input type="text" placeholder="Description"
                                                                    value={description} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Activity Type </label>
                                                                <input type="text" placeholder="Location"
                                                                    value={activityType} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Time Slot Allocation</label>
                                                                <input type="text" placeholder="Start Time, End Time"
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
                    </div>
                </>
            </Modal >
        </div >
    )
}

export default EditCampDet