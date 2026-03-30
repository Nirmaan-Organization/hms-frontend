import { Modal } from "@mui/material";
import React, { useState } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './uploadexcel.css';
import { CancelOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";


const UploadJobDet = ({ modelType, fetchData, isOpen, onClose }) => {

    const [file, setFile] = useState();
    const apiUrl = process.env.REACT_APP_API_URL;

    const currentUserJSON = localStorage.getItem("userData");

    const currentUser = JSON.parse(currentUserJSON);
    const userID = currentUser ? currentUser.id : null;
    const campIdD = useSelector(state => state.myReducer.campId)

    const sendFile = async (e) => {
        e.preventDefault();
        let formData = new FormData();

        if (file == null || file === undefined) {
            NotificationManager.error('please upload file');
        }

        else if (file && file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

            formData.append('file', file.file);
            formData.append('userid', userID);
            formData.append('campId', campIdD);

            // Valid .xlsx file selected
            if (modelType === 'patientUpload') {
                try {
                    const response = await fetch(`${apiUrl}/patientUpload`, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        NotificationManager.success('Bulk Patient details successfully uploaded');
                        await fetchData(); 
                        setFile(null)
                        onClose()
                    }
                    else {
                        // Handle login error
                        const data = await response.json();
                        // console.log(data.message);
                        setFile(null)
                        NotificationManager.error(data.message);
                    }

                } catch (error) {
                    // console.error('Error:', error);
                    setFile('')
                    NotificationManager.error(error);
                }
            } else {
                try {
                    const response = await fetch(`${apiUrl}/upload`, {
                        method: 'POST',
                        body: formData

                    });
                    console.log(response);
                    if (response.ok) {
                        NotificationManager.success('Bulk Patient details successfully uploaded');
                        await fetchData();
                        onClose()
                    }
                    else {
                        // Handle login error
                        const data = await response.json();
                        // console.log(data.message);
                        setFile('')
                        NotificationManager.error(data.message);
                    }

                } catch (error) {
                    // console.error('Error:', error);                        
                    setFile('')

                    NotificationManager.error(error);
                }
            }

        }
    }
    if (!isOpen) return null;

    return (
        <div>
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <div style={{ display: "block" }}>
                        <div className="modal fade show" id="loginPopupModal" style={{ display: "block" }} aria-modal="true" role="dialog">
                            <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
                                <div className="modal-content">
                                    <CancelOutlined className="closed-modal" onClick={onClose} />
                                    <div className="modal-body">
                                        <div id="login-modal">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">File upload</h5>
                                            </div>
                                            <div className="modal-body" id="input-body">
                                                <div className="forms-controfl" id="uploadfile-input">
                                                    <input type="file" name="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04"
                                                        aria-label="Upload" onChange={e => setFile({ file: e.target.files[0] })} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                                <button type="button" onClick={sendFile} className="btn-sendfile">Upload</button>
                                            </div>
                                        </div></div>
                                </div>

                            </div>
                        </div>
                    </div>

                </>
            </Modal>
            <NotificationContainer />
        </div>
    );
};

export default UploadJobDet;