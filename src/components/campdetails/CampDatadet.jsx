import { AddCircleOutlineOutlined, GroupAddTwoTone, LocalHospitalTwoTone } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useDispatch } from 'react-redux';
import { setCamp, setValue, setactiveStyle } from '../redux/reducer';
import './campdet.css';
import EditCampDet from './campForm/EditCampDet';
import DeleteCampDet from './DeleteCampDet';
import CustomizedMenus from './MenuOptions/CustomizedMenus';
import UploadJobDet from './UploadFileDiv/UploadJobDet';


function CampDatadet() {

  const dispatch = useDispatch();
  const [campID, setCampID] = useState('')

  const sidebarChange = (row) => {
    dispatch(setCamp(row.id))
    dispatch(setactiveStyle(3))
    dispatch(setValue(3))
  }
  const volunteerDisply = (row) => {
    dispatch(setCamp(row.id))
    dispatch(setactiveStyle(5))
    dispatch(setValue(5))
  }



  const masterRole = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_CAMP_ORGANIZER']

  const apiUrl = process.env.REACT_APP_API_URL;
  const currentUser = localStorage.getItem('userData')
  const userProfile = JSON.parse(currentUser)

  const userId = userProfile ? userProfile.id : null;
  const userRole = userProfile ? userProfile.role : null;

  const [activityTypes, setActivtyDetails] = useState([])

  useEffect(() => {
    fetch(`${apiUrl}/getAllActivityDetls`)
      .then(response => response.json())
      .then(data => {
        setActivtyDetails(data)
      }).catch(err => {

      })
  }, [])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [allcamplists, setallCampDet] = useState([])

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/getAllCampdet`);
      const result = await res.json()
      if (result.status === 'FAILED') {

      } else {
        setallCampDet(result)

      }
    } catch (err) {
      console.log('Error fetching data', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [searchText, setsearchText] = useState('')
  const [selectType, setselectType] = useState('')
  const roleacc = ['ROLE_SUPER_ADMIN', 'ROLE_VOLUNTEER']

  const camplists = allcamplists.filter(item => {
    const campNameSearch = searchText ? item.campName !== null && item.campName.toLowerCase().includes(searchText.toLowerCase()) : true
    const activitySearch = selectType ? item.activityType !== null && item.activityType.toLowerCase().includes(selectType.toLowerCase()) : true
    const useraccess = roleacc.includes(userRole)
    const createdaccess = userId ? item.created_by === userId : true

    return campNameSearch && activitySearch && (useraccess || createdaccess)
  })

  // const camplists = searchCamplists.filter(item =>
  //   selectType ? item.activityType !== null && item.activityType.toLowerCase().includes(selectType.toLowerCase()) : true
  //     && userRole === "ROLE_SUPER_ADMIN" ? true : userId ? item.created_by === userId : true
  // )

  // const userCampDet = camplists.filter(item =>
  //   userId ? item.created_by === userId : true
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

  const editRecord = (row, edit) => {
    setSelectedData(row);
    setformMode('edit')
    setEditModalOpen(true);
  }

  const viewRecord = (row, view) => {
    setSelectedData(row);
    setformMode('view')
    setEditModalOpen(true);
  }


  const [deletePop, setDeletePop] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);

  const deleteRecord = (row) => {
    setSelectedData(row);
    setDeleteOption('Camp')
    setDeletePop(true);
  }

  const handleClickOpen = () => {
    setDeletePop(true);
  };

  const handleClose = () => {
    setDeletePop(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='main-container'>
        <section>
          <div className="order">
            <div className="head">
              <div className="search-filter">
                <input type="text" placeholder="Search with camp name"
                  onChange={e => setsearchText(e.target.value)}
                  value={searchText}
                />
                <select className="search-text"
                  onChange={e => setselectType(e.target.value)}
                  value={selectType}>
                  <option>Select Activity Type</option>
                  {activityTypes === undefined ?
                    <option>Select Activity Type</option> :
                    activityTypes.map((item) => (
                      <option key={item.id} value={item.activityName}>
                        {item.activityName}
                      </option>
                    ))}

                </select>
                <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                  variant="contained" color="error" onClick={clearSearch}>
                  Clear
                </Button>
              </div>

              <div className='icon-manage' style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton className='bx'>
                  <Tooltip className='bx' title='Camp Details refresh'>
                    {/* <UploadFileOutlined className='bx' onClick={openModal} /> */}
                    <RefreshIcon className='bx' onClick={fetchData} />
                  </Tooltip>
                </IconButton>
                {masterRole.includes(userRole) ?
                  <IconButton className='bx'>
                    <Tooltip className='bx' title='Add Camp Details'>
                      <AddCircleOutlineOutlined className='bx' onClick={() => addRecord(null)} />
                    </Tooltip>
                  </IconButton>
                  : ''}
              </div>


            </div>
            <Paper className='table-container-camp'>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}> 
                <Table size='small' aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">Camp ID</TableCell>
                      <TableCell >Camp Name</TableCell>
                      <TableCell align="left">Date&Time</TableCell>
                      <TableCell align="left">Address</TableCell>
                      <TableCell align="left">Description</TableCell>
                      <TableCell align="left">Activity Type</TableCell>
                      <TableCell align="left">Assoication with </TableCell>
                      <TableCell align="left">Organizer</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {camplists
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow key={row.id}>
                            <TableCell component="td" scope="row"
                              // onClick={() => viewRecord(row)} 
                              className='row-selection'>
                              <div style={{ display: 'flex', gridGap: '5px', alignItems: 'center' }}>
                                {row.campID}
                                {masterRole.includes(userRole) ? <CustomizedMenus data={row} /> : ''}
                              </div>
                            </TableCell>
                            <TableCell component="td" scope="row">
                              {row.campName}
                            </TableCell>
                            <TableCell align="left">{row.campDate} & <br /> {row.startTime} - {row.endTime} </TableCell>
                            <TableCell align="left">{row.street}, {row.city}
                              <br /> {row.state} - {row.zipCode}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.activityType}{row.otherActivityType !== null ? ' - '.concat(row.otherActivityType) : ''}</TableCell>
                            <TableCell align="left">{row.timeSlotAllocation}</TableCell>
                            <TableCell align="left">{row.users.organizationDet.orgName}</TableCell>

                            <TableCell component="td" scope="row" className='action-items'>
                          
                              {userRole === 'ROLE_SUPER_ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'ROLE_HEALTHCARE_PROVIDER' || userRole === 'ROLE_CAMP_ADMIN' || userRole === 'ROLE_VOLUNTEER' ?
                                <IconButton className='icon-action'>
                                  <Tooltip title='Patient Det' >
                                    <LocalHospitalTwoTone
                                      className='icon-action'
                                      onClick={() => sidebarChange(row)} />
                                  </Tooltip>
                                </IconButton> : ''
                              }
                              {userRole !== 'ROLE_HEALTHCARE_PROVIDER' && userRole !== 'ROLE_VOLUNTEER' ?
                                <IconButton className='icon-action'>
                                  <Tooltip title='Volunteer Det' >
                                    <GroupAddTwoTone
                                      className='icon-action'
                                      onClick={() => volunteerDisply(row)}
                                    />
                                  </Tooltip>
                                </IconButton>
                                : ''}

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

                count={camplists === undefined ? null : camplists.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
          <UploadJobDet modelType='CampUpload' fetchData={fetchData} isOpen={isModalOpen} onClose={closeModal} />

          {isEditModalOpen && (
            <EditCampDet fetchData={fetchData} userData={userProfile} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
          )}
          {deletePop && (
            <DeleteCampDet deleteItem={deleteOption} data={selectedData} isDeletePop={deletePop} OnDeletePopClose={() => setDeletePop(false)} userId={userId} fetchData={fetchData} />
          )}
        </section >
        <NotificationContainer />

      </div>
    </>
  );
}


export default CampDatadet