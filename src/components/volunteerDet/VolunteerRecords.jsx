import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteOutlineOutlined, ModeEditOutlineOutlined, ViewInArOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, TextField, TablePagination, Tooltip, Button } from '@mui/material';
import { useState, useEffect } from 'react';
// import EditCampDet from './campForm/EditCampDet';
import { AddCircleOutlineOutlined, Search, SearchOutlined } from '@mui/icons-material';
import './volunteerDet.css'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import EditVolunteerDet from './volunteerForm/EditVolunteerDet';
import { useSelector } from 'react-redux';
import { getApiUrl } from '../../config';

function VolunteerRecords() {

    // const apiUrl = process.env.REACT_APP_API_URL;

    const apiUrl = getApiUrl();
    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userId = userProfile ? userProfile.id : null;

    const [preferredRoles, setpreferredRoles] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/getAllPreRoleDetls`)
            .then(response => response.json())
            .then(data => {
                setpreferredRoles(data)
            }).catch(err => {

            })
    }, [])

    const campIdD = useSelector(state => state.myReducer.campId)
    const [selectCamp, setselectCamp] = useState(campIdD == '' ? null : campIdD)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [allVolunteers, setallVolunteer] = useState([])

    const fetchVoluntrData = async () => {
        try {
            const res = await fetch(`${apiUrl}/getOneCamp/${selectCamp}`);
            const result = await res.json()
            if (result.status === 'FAILED') {

            } else {
                setallVolunteer(result.data.users)
            }
        } catch (err) {
            console.log('Error fetching data', err);
        }
    }
    console.log('allVolunteers', allVolunteers);

    useEffect(() => {
        fetchVoluntrData();
    }, []);


    const [searchText, setsearchText] = useState('')
    const [selectType, setselectType] = useState('')

    const volunteerLists = allVolunteers
    // .filter(item =>
    //     searchText ? item.users.fullName !== null && item.users.fullName.toLowerCase().includes(searchText.toLowerCase()) : true
    // )

    const clearSearch = () => {
        setselectType('')
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
            <section className='main-container'>
                <div className="sub-container">
                    <div className="head">
                        <div className="search-filter">
                            <input type="text" placeholder="Search with Volunteer name"
                                onChange={e => setsearchText(e.target.value)}
                                value={searchText}
                            />
                            <select className="search-text"
                                onChange={e => setselectType(e.target.value)}
                                value={selectType}>
                                <option>Select Preferred Role</option>
                                {preferredRoles === undefined ?
                                    <option>Select Activity Type</option> :
                                    preferredRoles.map((item) => (
                                        <option key={item.id} value={item.preferredRoleName}>
                                            {item.preferredRoleName}
                                        </option>
                                    ))}

                            </select>
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
                    <Paper className='table-volunteer-container'>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table size='small' aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ display: 'flex', alignItems: 'center' }} >volunteer ID
                                            {/* <SwapVertOutlinedIcon style={{fontSize:'15px'}}/>  */}
                                        </TableCell>
                                        <TableCell >Camp ID</TableCell>
                                        <TableCell >Volunteer Name</TableCell>
                                        <TableCell align="left">Date Of Birth</TableCell>
                                        <TableCell align="left">Contact No</TableCell>
                                        <TableCell align="left">Email ID</TableCell>
                                        <TableCell align="left">Address</TableCell>
                                        <TableCell align="left">Skill Expertise </TableCell>
                                        <TableCell align="left">Role Assigned</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {volunteerLists
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {

                                            return (
                                                <TableRow key={row.id}>
                                                    <TableCell component="td" scope="row">
                                                        {row.userID}
                                                    </TableCell>
                                                    <TableCell component="td" scope="row">
                                                        { row.campID}
                                                    </TableCell>
                                                    <TableCell component="td" scope="row">
                                                        {row.fullName}
                                                    </TableCell>
                                                    <TableCell align="left">{row.dateOfBirth}</TableCell>
                                                    <TableCell align="left">{row.contactNO}</TableCell>
                                                    <TableCell align="left">{row.email}</TableCell>
                                                    <TableCell align="left">
                                                        {row.street}, {row.city}
                                                        <br /> {row.state} - {row.zipCode}
                                                    </TableCell>
                                                    <TableCell align="left">{row.skillExpertise}</TableCell>

                                                    <TableCell align="left">{row.roles.name}</TableCell>

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

                            count={volunteerLists === undefined ? null : volunteerLists.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
                {isEditModalOpen && (
                    <EditVolunteerDet fetchVoluntrData={fetchVoluntrData} userID={userId} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
                )}
                <NotificationContainer />
            </section>


        </>
    );
}


export default VolunteerRecords