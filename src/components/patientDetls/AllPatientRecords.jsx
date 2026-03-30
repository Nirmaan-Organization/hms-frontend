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
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './patientDet.css';
import EditPatientDet from './PatientForm/EditPatientDet';
import { useDispatch, useSelector } from 'react-redux';
import DeleteCampDet from '../campdetails/DeleteCampDet';
import { setCamp } from '../redux/reducer';

function AllPatientRecords() {

    // const value = useSelector(state => state.myReducer.value)
    const campIdD = useSelector(state => state.myReducer.campId)

    const apiUrl = process.env.REACT_APP_API_URL;
    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)

    const userId = userProfile ? userProfile.id : null;
    const userRole = userProfile ? userProfile.role : null;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [campDetls, setCampDetls] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getAllCampNames`)
            .then(response => response.json())
            .then(data => {
                const camps =
                    Array.isArray(data) ? data
                        : Array.isArray(data?.data) ? data.data
                            : Array.isArray(data?.rows) ? data.rows
                                : [];
                setCampDetls(camps)
            }).catch(err => {

            })
    }, [apiUrl])
    const [allPatientRecords, setAllPatientRecords] = useState([])

    const [selectCamp, setselectCamp] = useState(campIdD === '' ? null : campIdD)

    const [bloodList, setBloodList] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getBloodGroups`)
            .then(response => response.json())
            .then(data => {
                const bloodGroups =
                    Array.isArray(data) ? data
                        : Array.isArray(data?.data) ? data.data
                            : Array.isArray(data?.rows) ? data.rows
                                : [];
                setBloodList(bloodGroups)
            }).catch(err => {

            })
    }, [apiUrl])

    const fetchPatientData = async () => {

        try {
            const res = await fetch(`${apiUrl}/getAllPatientDetls`);
            const result = await res.json();

            if (result.status === 'FAILED') {
            } else {
                const patients =
                    Array.isArray(result) ? result
                        : Array.isArray(result?.data) ? result.data
                            : Array.isArray(result?.rows) ? result.rows
                                : [];
                setAllPatientRecords(patients)
            }

        } catch (err) {
            console.log('Error fetching data', err);
        }
    }

    useEffect(() => {
        fetchPatientData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl]);

    const [searchText, setsearchText] = useState('')
    const [searchBlood, setBloodName] = useState('')

    const patientArray = Array.isArray(allPatientRecords) ? allPatientRecords : [];
    const searchWthBlood = patientArray.filter((item) => {
        const matchesText = searchText
            ? (
                (item.patientFullName !== null && item.patientFullName?.toLowerCase().includes(searchText.toLowerCase())) ||
                (item.patientID !== null && item.patientID?.includes(searchText)) ||
                (item.contactNo !== null && item.contactNo?.includes(searchText))
            )
            : true;

        const isSuperAdmin = userRole === "ROLE_SUPER_ADMIN";
        const createdByMatches = userId ? item.created_by === userId : true;
        const canSeeRow = isSuperAdmin || createdByMatches;

        return matchesText && canSeeRow;
    })
    const searchVolntrlists = searchWthBlood.filter(item =>
        searchBlood ? item.bloodgroup !== null && item.bloodgroup.toLowerCase().includes(searchBlood.toLowerCase())
            : true
    )

    const clearSearch = () => {
        setBloodName('')
        setsearchText('')
    }

    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [selectedData, setSelectedData] = useState(null)
    const [formMode, setformMode] = useState('')
    const [patientCampSelection, setpatientCampSelection] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const dispatch = useDispatch();

    const addRecord = (row, add) => {
        setpatientCampSelection('MultiCamp')
        setSelectedData(null);
        dispatch(setCamp(''))
        setformMode('add')
        setEditModalOpen(true);
    }

    const editPatientDet = (row, edit) => {
        setpatientCampSelection('MultiCamp')
        dispatch(setCamp(''))
        setSelectedData(row);
        setformMode('edit')
        setEditModalOpen(true);
    }

    const viewPatientDet = (row, view) => {
        setSelectedData(row);
        setformMode('view')
        setEditModalOpen(true);
    }

    const [deletePop, setDeletePop] = useState(false);
    const [deleteOption, setDeleteOption] = useState(false);

    const deletePatient = (row) => {
        setSelectedData(row);
        setDeleteOption('Patient')
        setDeletePop(true);
    }

    return (
        <>
            <div className="container">
                <div className="head-title">
                    <div className="left" style={{ display: 'flex', gridGap: '10px' }}>
                        <h2>All Patient Details </h2>
                    </div>
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
                                    <select className="jm-search-select"
                                        value={searchBlood} onChange={(e) => setBloodName(e.target.value)}>
                                        <option>Select Group</option>
                                        {bloodList === undefined ?
                                            <option>Select Group</option> :
                                            bloodList.map((item) => (
                                                <option key={item.id} value={item.bloodGroup}>
                                                    {item.bloodGroup}
                                                </option>
                                            ))}
                                    </select>
                                    <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                                        variant="contained" color="error" onClick={clearSearch}>
                                        Clear
                                    </Button>
                                </div>
                                {userRole === "ROLE_SUPER_ADMIN" || userRole === "ROLE_CAMP_ADMIN" ?
                                    <IconButton className='bx'>
                                        <Tooltip className='bx' title='Add Patient Details'>
                                            <AddCircleOutlineOutlined className='bx' onClick={() => addRecord(null)} />
                                        </Tooltip>
                                    </IconButton>
                                    : ''}

                            </div>
                            <Paper className='table-patientAll-container'>
                                <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                                    <Table size='small' aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Patient ID</TableCell>
                                                <TableCell >Patient FullName</TableCell>
                                                <TableCell >Age</TableCell>
                                                <TableCell align="left">Gender</TableCell>
                                                <TableCell align="left">Blood Group</TableCell>
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
                                                                {row.patientFullName}
                                                            </TableCell>
                                                            <TableCell align="left">{row.age}</TableCell>
                                                            <TableCell align="left">{row.gender}</TableCell>
                                                            <TableCell align="left">{row.bloodgroup}</TableCell>
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
                                                                {userRole === "ROLE_SUPER_ADMIN" || userRole === "ROLE_CAMP_ADMIN" ?
                                                                    <IconButton className='icon-action'>
                                                                        <Tooltip title='Edit'>
                                                                            <ModeEditOutlineOutlined onClick={() => editPatientDet(row)} className='icon-action' />
                                                                        </Tooltip>
                                                                    </IconButton>
                                                                    : ''}
                                                                <IconButton className='icon-action'>
                                                                    <Tooltip title='View'>
                                                                        <VisibilityOutlined onClick={() => viewPatientDet(row)} className='icon-action' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                                {userRole === "ROLE_SUPER_ADMIN" ?
                                                                    <IconButton className='icon-action'>
                                                                        <Tooltip title='Delete'>
                                                                            <DeleteOutlineOutlined onClick={() => deletePatient(row)} className='icon-action' />
                                                                        </Tooltip>
                                                                    </IconButton> : ''}
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
                            <EditPatientDet fetchPatientData={fetchPatientData} campIdD={''} patientCampSelection={patientCampSelection}
                                userID={userId} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
                        )}
                        {deletePop && (
                            <DeleteCampDet deleteItem={deleteOption} data={selectedData} isDeletePop={deletePop} OnDeletePopClose={() => setDeletePop(false)} userId={userId} fetchData={fetchPatientData} />
                        )}
                    </section>
                </div>
            </div>

            <NotificationContainer />
        </>
    );
}


export default AllPatientRecords