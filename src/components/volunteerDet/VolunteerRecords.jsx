import { ModeEditOutlineOutlined, VisibilityOutlined } from '@mui/icons-material';
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
// import EditCampDet from './campForm/EditCampDet';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import AddVolunteerOption from './AddVolunteerOption';
import './volunteerDet.css';
import EditVolunteerDet from './volunteerForm/EditVolunteerDet';

function VolunteerRecords() {



    const apiUrl = process.env.REACT_APP_API_URL;
    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userId = userProfile ? userProfile.id : null;
    const userRole = userProfile ? userProfile.role : null;


    const [preferredRoles, setpreferredRoles] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/getAllRoles`)
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
                setallVolunteer(result.data.volunteerDetls)
            }
        } catch (err) {
            console.log('Error fetching data', err);
        }
    }

    useEffect(() => {
        fetchVoluntrData();
    }, []);


    const [searchText, setsearchText] = useState('')
    const [selectType, setselectType] = useState('')

    const searchVol = allVolunteers  
        .filter(item =>
            searchText ? item.volunteerName !== null && item.volunteerName.toLowerCase().includes(searchText.toLowerCase()) : true
        )

    const volunteerLists = searchVol.filter(item => {
        const roleMatches = selectType ? item.users.roles?.name !== null && item.users.roles.name.toLowerCase().includes(selectType.toLowerCase()) : true;
        const isSuperAdmin = userRole === "ROLE_SUPER_ADMIN";
        const createdByMatches = userId ? item.created_by === userId : true;

        return roleMatches && (isSuperAdmin || createdByMatches);
    })

    const clearSearch = () => {
        setselectType('')
        setsearchText('')
    }

    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isOptionOpen, setisOptionOpen] = useState(false)
    const [isOptionMode, setisOptionMode] = useState('')

    const [selectedData, setSelectedData] = useState(null)
    const [formMode, setformMode] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addOptionOpen = (row) => {
        setisOptionOpen(true);
        setisOptionMode('Volunteer')
    }

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
                                    <option>Select Preferred Role</option> :
                                    preferredRoles.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}

                            </select>
                            <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                                variant="contained" color="error" onClick={clearSearch}>
                                Clear
                            </Button>
                        </div>

                        <IconButton className='bx'>
                            <Tooltip className='bx' title='Add Volunteer Details'>
                                <AddCircleOutlineOutlined className='bx'
                                    // onClick={() => addRecord(null)} 
                                    onClick={() => addOptionOpen(null)}
                                />
                            </Tooltip>
                        </IconButton>

                    </div>
                    <Paper className='table-volunteer-container'>
                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                            <Table size='small' aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ display: 'flex', alignItems: 'center' }} >Volunteer ID
                                            {/* <SwapVertOutlinedIcon style={{fontSize:'15px'}}/>  */}
                                        </TableCell>
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
                                                        {row.volunteerID}
                                                    </TableCell>

                                                    <TableCell component="td" scope="row">
                                                        {row.volunteerName}
                                                    </TableCell>
                                                    <TableCell align="left">{row.dateOfBirth}</TableCell>
                                                    <TableCell align="left">{row.contactNo}</TableCell>
                                                    <TableCell align="left">{row.users.email}</TableCell>
                                                    <TableCell align="left">
                                                        {row.street}, {row.city}
                                                        <br /> {row.state} - {row.zipCode}
                                                    </TableCell>
                                                    <TableCell align="left">{row.skillExpertise}</TableCell>

                                                    <TableCell align="left">{row.users.roles.name}</TableCell>

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
                <AddVolunteerOption fetchRecords={fetchVoluntrData} campIdD={selectCamp}
                    userID={userId} data={selectedData} formMode={formMode} isOptionMode={isOptionMode} isOptionOpen={isOptionOpen}
                    onOptionClose={() => setisOptionOpen(false)} />

                {isEditModalOpen && (
                    <EditVolunteerDet fetchVoluntrData={fetchVoluntrData} campIdD={selectCamp}
                        userID={userId} data={selectedData} formMode={formMode} isOpen={isEditModalOpen}
                        onClose={() => setEditModalOpen(false)} />
                )}
                <NotificationContainer />
            </section>


        </>
    );
}


export default VolunteerRecords