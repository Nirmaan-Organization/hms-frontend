import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React, { useState } from 'react'
import { NotificationManager } from 'react-notifications'
import '../PatientForm/editPatient.css'

const AddPatientReport = ({ data, loadUploadedFiles, attachmentData, isOpen, onClose }) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userId = userProfile ? userProfile.id : null;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileDesc, setFileDesc] = useState(!attachmentData ? null : attachmentData.description);
    const [reportType, setreportType] = useState(!attachmentData ? null : attachmentData.reportType);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const uploadFiles = async (req) => {
        try {
            setLoading(true);
            if (data.patientID && selectedFiles.length !== 0) {
                const formData = new FormData();
                selectedFiles.forEach((file) => {
                    formData.append('file', file);
                });
                formData.append('patientID', data.patientID);
                formData.append('reportType', reportType);
                formData.append('description', fileDesc);
                formData.append('userID', userId);
                try {
                    setLoading(true);
                    const response = await fetch(`${apiUrl}/uploadReport`, {
                        method: 'POST',
                        body: formData
                    });
                    if (!response.ok) {
                        throw new Error('Failed to upload files.');
                    } else {
                        NotificationManager.success("File upload successfully");
                        loadUploadedFiles()
                        onClose();
                    }
                } catch (error) {
                    console.error('Error uploading files:', error); setLoading(false);
                } finally {
                    setLoading(false);
                }
            }

        } catch (error) {
            NotificationManager.error(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Modal open={isOpen}>
                <>
                    <div style={{ display: "block" }}>
                        <div className="editjobmodal " id="editjobPopupModal" style={{ display: "block" }} role="dialog">
                            <div className="editjobmodal-dialog editjobmodal-lg editjobmodal-dialog-centered editjob-editjobmodal editjobmodal-dialog-scrollable">
                                <div className="editjobmodal-content">
                                    <CancelOutlined className="closed-editjobmodal" onClick={onClose} />
                                    <div className="editjobmodal-body">
                                        <div id="editjob-editjobmodal">
                                            <div className="editjob-form default-form">
                                                <div className="form-inner" style={{ display: 'block' }}>
                                                    <h3> Upload Report</h3>

                                                    <form method="put">
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={12} style={{ display: 'flex', gridGap: 10 }} className="forms-controfl">
                                                                    <Grid item xs={8} className="forms-controfl">
                                                                        <label>Medical Reports</label>
                                                                        <input type="file" multiple onChange={handleFileChange} />
                                                                    </Grid>
                                                                    <Grid item xs={4} className="forms-controfl">
                                                                        <label>File Type</label>
                                                                        <input type="text" value={reportType} onChange={(e) => setreportType(e.target.value)} />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={12} style={{ display: 'flex', gridGap: 10 }} className="forms-controfl">
                                                                    <Grid item xs={12} className="forms-controfl">
                                                                        <label>Description</label>
                                                                        <input type="text" value={fileDesc} onChange={(e) => setFileDesc(e.target.value)} />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <hr />
                                                                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={uploadFiles}
                                                                            variant="contained" color="success">
                                                                            Upload
                                                                        </Button>
                                                                    </div>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    </form>
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

export default AddPatientReport