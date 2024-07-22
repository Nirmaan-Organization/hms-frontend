import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import './editPatient.css'
import { NotificationContainer, NotificationManager } from 'react-notifications';


const EditPatientDet = ({ fetchPatientData, campIdD, userID, data, formMode, isOpen, onClose }) => {

    // const apiUrl = process.env.NODE_BACKEND_API_URL;

    const apiUrl = process.env.REACT_APP_API_URL;

    console.log('campIdD', campIdD);
    const [campDetls, setCampDetls] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllCampNames`)
            .then(response => response.json())
            .then(data => {
                setCampDetls(data)
            }).catch(err => {

            })
    }, [])

    const [patientFullName, setpatientFullName] = useState(data === null ? '' : data.patientFullName)
    const [age, setage] = useState(data === null ? '' : data.age)
    const [gender, setgender] = useState(data === null ? '' : data.gender)
    const [contactNo, setcontactNO] = useState(data === null ? '' : data.contactNo)
    const [emailAddress, setemailID] = useState(data === null ? '' : data.emailAddress)
    const [address, setAddress] = useState(data === null ? '' : data.address)
    const [city, setcity] = useState(data === null ? '' : data.city)
    const [state, setState] = useState(data === null ? '' : data.state)
    const [zipCode, setzipCode] = useState(data === null ? '' : data.zipCode)
    const [maritalStatus, setmaritalStatus] = useState(data === null ? '' : data.maritalStatus)
    const [occupation, setoccupation] = useState(data === null ? '' : data.occupation)
    const [primaryLang, setprimaryLang] = useState(data === null ? '' : data.primaryLang)
    const [existingMedicalCond, setexistingMedicalCond] = useState(data === null ? '' : data.existingMedicalCond)
    const [currentMedications, setcurrentMedications] = useState(data === null ? '' : data.currentMedications)
    const [allergiesToMedications, setallergiesToMedications] = useState(data === null ? '' : data.allergiesToMedications)
    const [familyMedicalHistory, setfamilyMedicalHistory] = useState(data === null ? '' : data.familyMedicalHistory)
    const [reasonForVisiting, setreasonForVisiting] = useState(data === null ? '' : data.reasonForVisiting)
    const [emergencyContactName, setemergencyContactName] = useState(data === null ? '' : data.emergencyContactName)
    const [emergencyContactNo, setemergencyContactNo] = useState(data === null ? '' : data.emergencyContactNo)
    const [emergencyPresonRelationship, setemergencyPresonRelationship] = useState(data === null ? '' : data.emergencyPresonRelationship)
    const [aboutCampKnown, setaboutCampKnown] = useState(data === null ? '' : data.aboutCampKnown)
    const [otherInfo, setotherInfo] = useState(data === null ? '' : data.otherInfo)

    const [campID, setcampID] = useState(data === null ? campIdD : data.campId)

    const [campRecord, setcampRecord] = useState('')


    useEffect(() => {
        fetch(`${apiUrl}/getOneCamp/${campID}`)
            .then(response => response.json())
            .then(data => {
                setcampRecord(data)
            }).catch(err => {

            })
    }, [])

    const genderRec = [
        { id: 1, name: 'Male' },
        { id: 2, name: 'Female' },
        { id: 3, name: 'Transgender' },
        { id: 4, name: 'Others' }
    ]
    const relationShipRec = [
        { id: 1, name: 'Father' },
        { id: 2, name: 'Mother' },
        { id: 3, name: 'Brother' },
        { id: 4, name: 'Sister' },
        { id: 5, name: 'Others' }
    ]

    const maritalList = [
        { id: 1, name: 'Single' },
        { id: 2, name: 'Married' },
        { id: 3, name: 'Widowed' },
        { id: 4, name: 'Divorced' },
        { id: 5, name: 'Separated' },
    ]


    const addVolunteerDetls = async (e) => {
        e.preventDefault();
        let payload = {
            "patientFullName": patientFullName,
            "age": age,
            "gender": gender,
            "contactNo": contactNo,
            "emailAddress": emailAddress,
            "address": address,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "maritalStatus": maritalStatus,
            "occupation": occupation,
            "primaryLang": primaryLang,
            "existingMedicalCond": existingMedicalCond,
            "currentMedications": currentMedications,
            "allergiesToMedications": allergiesToMedications,
            "familyMedicalHistory": familyMedicalHistory,
            "reasonForVisiting": reasonForVisiting,
            "emergencyContactName": emergencyContactName,
            "emergencyContactNo": emergencyContactNo,
            "emergencyPresonRelationship": emergencyPresonRelationship,
            "aboutCampKnown": aboutCampKnown,
            "otherInfo": otherInfo,
            "created_by": userID,
            "userId": userID,
            "campId": campID
        }

        try {
            const res = await fetch(`${apiUrl}/addPatientDet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                await fetchPatientData();
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
            "patientFullName": patientFullName,
            "age": age,
            "gender": gender,
            "contactNo": contactNo,
            "emailAddress": emailAddress,
            "address": address,
            "city": city,
            "state": state,
            "zipCode": zipCode,
            "maritalStatus": maritalStatus,
            "occupation": occupation,
            "primaryLang": primaryLang,
            "existingMedicalCond": existingMedicalCond,
            "currentMedications": currentMedications,
            "allergiesToMedications": allergiesToMedications,
            "familyMedicalHistory": familyMedicalHistory,
            "reasonForVisiting": reasonForVisiting,
            "emergencyContactName": emergencyContactName,
            "emergencyContactNo": emergencyContactNo,
            "emergencyPresonRelationship": emergencyPresonRelationship,
            "aboutCampKnown": aboutCampKnown,
            "otherInfo": otherInfo,
            "created_by": userID,
            "userId": userID,
            "campId": campID
        }

        try {
            if (formMode === 'edit') {
                const res = await fetch(`${apiUrl}/updatePatientDet/${data.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    await fetchPatientData();
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
                                                    <h3>{data === null ? 'Add Patient Details' : 'Edit Patient Details'}</h3>

                                                    <form method="put"
                                                    //  onSubmit={onUpdatePostDetails}
                                                    >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={7} className="forms-controfl">
                                                                    <label>Camp Name</label>
                                                                    <select className="jm-job-select" disabled={campIdD === '' ? false : true}
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
                                                                    <label>Patient Name</label>
                                                                    <input type="text" placeholder="Patient Name"
                                                                        value={patientFullName}
                                                                        onChange={(e) => setpatientFullName(e.target.value)} required
                                                                    />

                                                                </Grid>
                                                                <Grid item xs={1.5} className="forms-controfl">
                                                                    <label>Age</label>
                                                                    <input type="number"
                                                                        value={age}
                                                                        onChange={(e) => setage(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={2.5} className="forms-controfl">
                                                                    <label>Gender</label>
                                                                    <select className="jm-job-select"
                                                                        value={gender} onChange={(e) => setgender(e.target.value)}>
                                                                        <option>Select Gender</option>
                                                                        {genderRec === undefined ?
                                                                            <option>Select Gender</option> :
                                                                            genderRec.map((item) => (
                                                                                <option key={item.id} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Contact NO</label>
                                                                    <input type="text"
                                                                        value={contactNo} placeholder="Contact No" required
                                                                        onChange={(e) => setcontactNO(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Email Address</label>
                                                                    <input type="text" placeholder="Email ID"
                                                                        value={emailAddress}
                                                                        onChange={(e) => setemailID(e.target.value)} required
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Address</label>
                                                                    <input type="text" placeholder="Address"
                                                                        value={address}
                                                                        onChange={(e) => setAddress(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={3} className=" forms-controfl">
                                                                    <label>City</label>
                                                                    <input type="text" placeholder="City"
                                                                        value={city}
                                                                        onChange={(e) => setcity(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={3} className=" forms-controfl">
                                                                    <label>State</label>
                                                                    <input type="text" placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={2} className=" forms-controfl">
                                                                    <label>Zip Code</label>
                                                                    <input type="number" placeholder="Zip Code"
                                                                        value={zipCode}
                                                                        onChange={(e) => setzipCode(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className=" forms-controfl">
                                                                    <label>Marital Status</label>
                                                                    <select className="jm-job-select"
                                                                        value={maritalStatus} onChange={(e) => setmaritalStatus(e.target.value)}>
                                                                        <option>Marital Status</option>
                                                                        {maritalList === undefined ?
                                                                            <option>Marital Status</option> :
                                                                            maritalList.map((item) => (
                                                                                <option key={item.id} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Occupation</label>
                                                                    <input type="text" placeholder="Occupation"
                                                                        value={occupation}
                                                                        onChange={(e) => setoccupation(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Primary Lang</label>
                                                                    <input type="text" placeholder="Primary Lang"
                                                                        value={primaryLang}
                                                                        onChange={(e) => setprimaryLang(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Existing Medical Cond</label>
                                                                    <input type="text" placeholder="Existing Medical Cond"
                                                                        value={existingMedicalCond}
                                                                        onChange={(e) => setexistingMedicalCond(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Current Medications</label>
                                                                    <input type="text" placeholder="Current Medications"
                                                                        value={currentMedications}
                                                                        onChange={(e) => setcurrentMedications(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Allergies To Medications</label>
                                                                    <input type="text" placeholder="Allergies To Medications"
                                                                        value={allergiesToMedications}
                                                                        onChange={(e) => setallergiesToMedications(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Family Medical History</label>
                                                                    <input type="text" placeholder="Family Medical History"
                                                                        value={familyMedicalHistory}
                                                                        onChange={(e) => setfamilyMedicalHistory(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Reason For Visiting</label>
                                                                    <input type="text" placeholder="Reason For Visiting"
                                                                        value={reasonForVisiting}
                                                                        onChange={(e) => setreasonForVisiting(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Emergency Contact Name</label>
                                                                    <input type="text" placeholder="Emergency Contact Name"
                                                                        value={emergencyContactName}
                                                                        onChange={(e) => setemergencyContactName(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Emergency Contact No</label>
                                                                    <input type="text" placeholder="Emergency Contact No"
                                                                        value={emergencyContactNo}
                                                                        onChange={(e) => setemergencyContactNo(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>Emergency Preson Relationship</label>
                                                                    <select className="jm-job-select"
                                                                        value={emergencyPresonRelationship} onChange={(e) => setemergencyPresonRelationship(e.target.value)}>
                                                                        <option>Select Relationship</option>
                                                                        {relationShipRec === undefined ?
                                                                            <option>Select Relationship</option> :
                                                                            relationShipRec.map((item) => (
                                                                                <option key={item.id} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}

                                                                    </select>
                                                                </Grid>
                                                                <Grid item xs={4} className="forms-controfl">
                                                                    <label>About Camp Known</label>
                                                                    <input type="text" placeholder="About Camp Known"
                                                                        value={aboutCampKnown}
                                                                        onChange={(e) => setaboutCampKnown(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} className="forms-controfl">
                                                                    <label>Other Info</label>
                                                                    <input type="text" placeholder="Other Info"
                                                                        value={otherInfo}
                                                                        onChange={(e) => setotherInfo(e.target.value)}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12}>
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
                                                    <h3>View Patient Details</h3>

                                                    <div className='jm-post-job-wrapper mb-40'>
                                                        <hr />
                                                        <Grid container spacing={2} className="row">
                                                            <Grid item xs={8} className="forms-controfl">
                                                                <label>Camp Name</label>
                                                                <input type="text"
                                                                    value={campRecord.campName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Patient Name</label>
                                                                <input type="text"
                                                                    value={patientFullName} disabled
                                                                />

                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>Age</label>
                                                                <input type="number"
                                                                    value={age} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} className="forms-controfl">
                                                                <label>Gender</label>
                                                                <input type="text"
                                                                    value={gender} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Contact NO</label>
                                                                <input type="text"
                                                                    value={contactNo} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Email ID</label>
                                                                <input type="text"
                                                                    value={emailAddress} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Address</label>
                                                                <input type="text"
                                                                    value={address} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3} className=" forms-controfl">
                                                                <label>City</label>
                                                                <input type="text"
                                                                    value={city} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3} className=" forms-controfl">
                                                                <label>State</label>
                                                                <input type="text"
                                                                    value={state} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} className=" forms-controfl">
                                                                <label>Zip Code</label>
                                                                <input type="text"
                                                                    value={zipCode} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className=" forms-controfl">
                                                                <label>Marital Status</label>
                                                                <input type="text"
                                                                    value={maritalStatus} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Occupation</label>
                                                                <input type="text"
                                                                    value={occupation} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Primary Lang</label>
                                                                <input type="text"
                                                                    value={primaryLang} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Existing Medical Cond</label>
                                                                <input type="text"
                                                                    value={existingMedicalCond} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Current Medications</label>
                                                                <input type="text"
                                                                    value={currentMedications} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Allergies To Medications</label>
                                                                <input type="text"
                                                                    value={allergiesToMedications} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Family Medical History</label>
                                                                <input type="text"
                                                                    value={familyMedicalHistory} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Reason For Visiting</label>
                                                                <input type="text"
                                                                    value={reasonForVisiting} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Emergency Contact Name</label>
                                                                <input type="text"
                                                                    value={emergencyContactName} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Emergency Contact No</label>
                                                                <input type="text"
                                                                    value={emergencyContactNo} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>Emergency Person Relationship </label>
                                                                <input type="text"
                                                                    value={emergencyPresonRelationship} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} className="forms-controfl">
                                                                <label>About Camp Known</label>
                                                                <input type="text"
                                                                    value={aboutCampKnown} disabled
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} className="forms-controfl">
                                                                <label>Other Info</label>
                                                                <input type="text"
                                                                    value={otherInfo} disabled
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

export default EditPatientDet