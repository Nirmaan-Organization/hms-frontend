import { CancelOutlined } from '@mui/icons-material'
import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import './volunteerForm/editVolunteer.css'
import EditVolunteerDet from './volunteerForm/EditVolunteerDet'
import SelectExistUser from './SelectExistUser'
import EditPatientDet from '../patientDetls/PatientForm/EditPatientDet'
import SelectExistPatients from '../patientDetls/SelectExistPatients'

const AddVolunteerOption = ({ fetchRecords, campIdD, userID, data, formMode, isOptionMode, isOptionOpen, onOptionClose }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px'
    };

    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isEditPatientOpen, setEditPatientOpen] = useState(false)
    const newCampId = campIdD;
    const [selectedData, setSelectedData] = useState(null)

    const addRecord = (row, add) => {
        setSelectedData(null);
        onOptionClose()
        if (isOptionMode === 'Patients') {
            setEditPatientOpen(true);
            setEditModalOpen(false);
        } else {
            setEditModalOpen(true);
            setEditPatientOpen(false);
        }
    }

    const [isSelectuser, setSelectUserClose] = useState(false)
    const [isSelectPatients, setSelectPatients] = useState(false)

    const selectUsers = (row, add) => {
        onOptionClose()
        if (isOptionMode === 'Patients') {
            setSelectPatients(true);
            setSelectUserClose(false);
        } else {
            setSelectUserClose(true);
            setSelectPatients(false);
        }
    }

    return (
        <div>
            <Modal open={isOptionOpen}>
                <div>
                    <Box sx={style}>
                        <CancelOutlined className="closed-editjobmodal" onClick={onOptionClose} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gridGap: '10px' }}>
                            <Typography id="modal-modal-title" variant="h6" component="h3">
                                Select Option
                            </Typography>

                            <div style={{ display: 'flex', gridGap: '10px', justifyContent: 'center' }}>
                                <Button style={{ height: '25px', textTransform: 'none' }}
                                    variant="outlined" color="success" onClick={() => addRecord(null)} >
                                    Create New
                                </Button>

                                <Button style={{ height: '25px', textTransform: 'none' }}
                                    variant="outlined" color="success" onClick={() => selectUsers(null)}>
                                    Select from Existing
                                </Button>
                            </div>
                        </div>
                    </Box>
                </div>
            </Modal >

            {isEditModalOpen && (
                <EditVolunteerDet fetchVoluntrData={fetchRecords} campIdD={newCampId}
                    userID={userID} data={null} formMode='add' isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)} />
            )
            }
            {isEditPatientOpen && (
                <EditPatientDet fetchPatientData={fetchRecords} campIdD={newCampId}
                    userID={userID} data={null} formMode='add' isOpen={isEditPatientOpen} onClose={() => setEditPatientOpen(false)} />
            )}

            {isSelectuser && (
                <SelectExistUser fetchVoluntrData={fetchRecords} campIdD={newCampId}
                    userID={userID} isSelectuser={isSelectuser}
                    onSelectUserClose={() => setSelectUserClose(false)} isOptionMode={isOptionMode} />
            )}
            {isSelectPatients && (
                <SelectExistPatients fetchVoluntrData={fetchRecords} campIdD={newCampId}
                    userID={userID} isSelectPatients={isSelectPatients}
                    onSelectPatients={() => setSelectPatients(false)} isOptionMode={isOptionMode} />
            )} 
        </div >
    )
}

export default AddVolunteerOption