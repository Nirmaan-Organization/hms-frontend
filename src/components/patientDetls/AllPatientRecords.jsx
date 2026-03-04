import { DeleteOutlineOutlined, ModeEditOutlineOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Button, IconButton, TablePagination, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './patientDet.css';
import EditPatientDet from './PatientForm/EditPatientDet';
import { useSelector } from 'react-redux';
import { getApiUrl } from '../../config';

function AllPatientRecords() {

    const value = useSelector(state => state.myReducer.value)
    const campIdD = useSelector(state => state.myReducer.campId)

    const apiUrl = getApiUrl();
    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userId = userProfile ? userProfile.id : null;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [campDetls, setCampDetls] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllCampNames`)
            .then(response => response.json())
            .then(data => {
                setCampDetls(data)
            }).catch(err => {

            })
    }, [])
    const [allPatientRecords, setAllPatientRecords] = useState([])

    const [selectCamp, setselectCamp] = useState(campIdD == '' ? null : campIdD)

    const fetchPatientData = async () => {

        try {
            const res = await fetch(`${apiUrl}/getAllPatientDetls`);
            const result = await res.json();

            if (result.status === 'FAILED') {
            } else {
                setAllPatientRecords(result)
            }

        } catch (err) {
            console.log('Error fetching data', err);
        }
    }

    console.log('patient detls', allPatientRecords);


    useEffect(() => {
        fetchPatientData();
    }, []);

    const [searchText, setsearchText] = useState('')
    const searchVolntrlists = allPatientRecords.filter(item =>
        searchText ? item.patientFullName !== null && item.patientFullName.toLowerCase().includes(searchText.toLowerCase())
            || item.patientID !== null && item.patientID.includes(searchText)
            || item.contactNo !== null && item.contactNo.includes(searchText)

            : true
    )

    // const volunteerLists = searchVolntrlists.filter(item =>
    //     selectCamp ? item.campId !== null && item.campId == selectCamp : true
    // )

    const clearSearch = () => {
        // setselectCamp('')
        setsearchText('')
    }

    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    const [formMode, setformMode] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addRecord = (row, add) => {
        setSelectedData(null);
        setformMode('add')
        setEditModalOpen(true);
    }

    const editVolunteerDet = (row, edit) => {
        setSelectedData(row);
        setformMode('edit')
        setEditModalOpen(true);
    }

    const viewVolunteerDet = (row, view) => {
        setSelectedData(row);
        setformMode('view')
        setEditModalOpen(true);
    }


    const deleteVolunteer = async (row) => {
        let payload = {
            "created_by": userId
        }

        try {
            const res = await fetch(`${apiUrl}/deleteVolunteer/${row.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                NotificationManager.success(data.message)

            } else {
                const data = await res.json();
                NotificationManager.success(data.message)
            }
        } catch (error) {
            NotificationManager.success(error)
        }
    }

    return (
        <>
            <div className="container">
                <div className="head-title">
                    <div className="left" style={{ display: 'flex', gridGap: '10px' }}>
                        <h2>All Patient Details </h2>
                    </div>
                    <a href="#" className='btn-download'>

                    </a>
                </div>
                <div className="table-data">
                    <section className='main-container'>
                        <div className="sub-container">
                            <div className="head">
                                <div className="search-filter">
                                    <input type="text" placeholder="Search with Patient ID, Full name or Contact No"
                                        onChange={e => setsearchText(e.target.value)}
                                        value={searchText}
                                    />
                                    {/* <select className="search-text" disabled
                                onChange={e => setselectCamp(e.target.value)}
                                value={selectCamp}>
                                <option>Select Camp Name</option>
                                {campDetls === undefined ?
                                    <option>Select camp Name</option> :
                                    campDetls.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.campName}
                                        </option>
                                    ))}

                            </select> */}
                                    <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                                        variant="contained" color="error" onClick={clearSearch}>
                                        Clear
                                    </Button>
                                </div>

                                <IconButton className='bx'>
                                    <Tooltip className='bx' title='Add Camp Details'>
                                        <AddCircleOutlineOutlined className='bx' onClick={() => addRecord(null)} />
                                    </Tooltip>
                                </IconButton>

                            </div>
                            <Paper className='table-patient-container'>
                                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                                    <Table size='small' aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ display: 'flex', alignItems: 'center' }} >Patient ID
                                                    {/* <SwapVertOutlinedIcon style={{fontSize:'15px'}}/>  */}
                                                </TableCell>
                                                <TableCell >Camp Name</TableCell>
                                                <TableCell >Patient FullName</TableCell>
                                                <TableCell >Age</TableCell>
                                                <TableCell align="left">Gender</TableCell>
                                                <TableCell align="left">Contact No</TableCell>
                                                <TableCell align="left">Email ID</TableCell>
                                                <TableCell align="left">Address</TableCell>
                                                <TableCell align="left">Marital Status </TableCell>
                                                <TableCell align="left">Occupation</TableCell>
                                                <TableCell align="left">Primary Lang</TableCell>
                                                <TableCell align="left">Existing Medical Cond</TableCell>
                                                <TableCell align="left">Current Medications</TableCell>
                                                <TableCell align="left">Allergies To Medications</TableCell>
                                                <TableCell align="left">Family Medical History</TableCell>
                                                <TableCell align="left">Reason For Visiting</TableCell>
                                                <TableCell align="left">Emergency Contact Name</TableCell>
                                                <TableCell align="left">Emergency Contact No</TableCell>
                                                <TableCell align="left" style={{ width: '500px' }}>Emergency Preson Relation</TableCell>
                                                <TableCell align="left">About Camp Known</TableCell>
                                                <TableCell align="left">Other Info</TableCell>
                                                <TableCell align="left">Created By</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {searchVolntrlists
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {

                                                    return (
                                                        <TableRow key={row.id}>
                                                            <TableCell component="td" scope="row">
                                                                {row.patientID}
                                                            </TableCell>
                                                            <TableCell component="td" scope="row">
                                                                {row.campPlanningDet ? row.campPlanningDet.campName : ''}
                                                            </TableCell>
                                                            <TableCell component="td" scope="row">
                                                                {row.patientFullName}
                                                            </TableCell>
                                                            <TableCell align="left">{row.age}</TableCell>
                                                            <TableCell align="left">{row.gender}</TableCell>
                                                            <TableCell align="left">{row.contactNo}</TableCell>
                                                            <TableCell align="left">{row.emailAddress}</TableCell>
                                                            <TableCell align="left">
                                                                {row.address}, {row.city}
                                                                <br /> {row.state} - {row.zipCode}
                                                            </TableCell>
                                                            <TableCell align="left">{row.maritalStatus}</TableCell>
                                                            <TableCell align="left">{row.occupation}</TableCell>
                                                            <TableCell align="left">{row.primaryLang}</TableCell>
                                                            <TableCell align="left">{row.existingMedicalCond}</TableCell>
                                                            <TableCell align="left">{row.currentMedications}</TableCell>
                                                            <TableCell align="left">{row.allergiesToMedications}</TableCell>
                                                            <TableCell align="left">{row.familyMedicalHistory}</TableCell>
                                                            <TableCell align="left">{row.reasonForVisiting}</TableCell>
                                                            <TableCell align="left">{row.emergencyContactName}</TableCell>
                                                            <TableCell align="left">{row.emergencyContactNo}</TableCell>
                                                            <TableCell align="left">{row.emergencyPresonRelationship}</TableCell>
                                                            <TableCell align="left">{row.aboutCampKnown}</TableCell>
                                                            <TableCell align="left">{row.otherInfo}</TableCell>
                                                            <TableCell align="left">{row.users.fullName}</TableCell>

                                                            <TableCell align="center" className='action-items'>
                                                                <IconButton className='icon-action'>
                                                                    <Tooltip title='Edit'>
                                                                        <ModeEditOutlineOutlined onClick={() => editVolunteerDet(row)} className='icon-action' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                                <IconButton className='icon-action'>
                                                                    <Tooltip title='View'>
                                                                        <VisibilityOutlined onClick={() => viewVolunteerDet(row)} className='icon-action' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                                <IconButton className='icon-action'>
                                                                    <Tooltip title='Delete'>
                                                                        <DeleteOutlineOutlined onClick={() => deleteVolunteer(row)} className='icon-action' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                            </TableCell>

                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"

                                    count={searchVolntrlists === undefined ? null : searchVolntrlists.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>
                        {isEditModalOpen && (
                            <EditPatientDet fetchPatientData={fetchPatientData} campIdD={''}
                                userID={userId} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
                        )}
                        <NotificationContainer />
                    </section>
                </div>
            </div>

        </>
    );
}


export default AllPatientRecords