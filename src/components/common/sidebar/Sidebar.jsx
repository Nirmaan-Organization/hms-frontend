import { DashboardCustomizeOutlined, GroupAddTwoTone, Inventory2Outlined, LocalHospitalTwoTone, LogoutOutlined, SettingsApplicationsOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import headerIcon from '../../../images/hms-icon.png';
import headerLogo from '../../../images/hms-logo.png';
import { setValue } from '../../redux/reducer';
import './sidebar.css';
 
const Sidebar = ({ hideStyle, userData }) => {

  const userRole = userData.role;

  const masterRole = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']
  const specifyRole = ['ROLE_HEALTHCARE_PROVIDER']


  const sidebarIcons = [
    masterRole.includes(userRole) ? { id: 1, menuItem: 'Dashboard', iconImg: <DashboardCustomizeOutlined className='bx' />, menuLink: '#' } : '',
    { id: 2, menuItem: 'Camp Management', iconImg: <HolidayVillageOutlinedIcon className='bx' />, menuLink: '#' },
    masterRole.includes(userRole) || specifyRole.includes(userRole) ? { id: 4, menuItem: 'Patient Information', iconImg: <LocalHospitalTwoTone className='bx' />, menuLink: '#' } : '',
    masterRole.includes(userRole) ? { id: 6, menuItem: 'All Volunteer Details', iconImg: <GroupAddTwoTone className='bx' />, menuLink: '#' } : '',
    // userRole === 'ROLE_SUPER_ADMIN' || userRole === 'ROLE_ADMIN' ? { id: 7, menuItem: 'Inventory Management', iconImg: <Inventory2Outlined className='bx' />, menuLink: '#' } : '',
    userRole === 'ROLE_SUPER_ADMIN' ? { id: 9, menuItem: 'User Management', iconImg: <VerifiedUserOutlined className='bx' />, menuLink: '#' } : ''
  ]

  const commonSidebar = [
    {
      id: 8, menuItem: 'Settings',
      iconImg: <SettingsApplicationsOutlined className='bx' />, menuLink: '#',
      styleClr: ''
    },
    {
      id: 10, menuItem: 'Logout',
      iconImg: <LogoutOutlined className='bx' />, menuLink: '/logout',
      styleClr: 'red'
    },
  ]
  const dispatch = useDispatch();

  const actStyle = useSelector(state => state.myReducer.activeStyle)

  const [activeStyle, setactiveStyle] = useState(actStyle === '' ? 1 : actStyle)
  const styleChange = (data) => {
    setactiveStyle(data.id);
    dispatch(setValue(data.id))
  } 


  return (
    <section className='sidebar' id={hideStyle}>
      <a href="#" className='brand'>
        <div className="form-input">
          <img src={headerIcon} className='img-icon2' alt="Logo" />
          {hideStyle === 'hide' ?
            <img src={headerIcon} className='img-icon' alt="Logo" /> :
            <img src={headerLogo} className='img-logo' alt="Logo" id={hideStyle} />
          }

        </div>
      </a>
      <ul className="side-menu top">
        {sidebarIcons && sidebarIcons.length > 0 ? (
          sidebarIcons.filter(item => item && item !== '').map((data, index) =>
            <li key={index}
              className={activeStyle === data.id ? 'active' : ''}
              onClick={() => styleChange(data)}> 
              <a href={data.menuLink} >
                {data.iconImg}
                <span className="text">{data.menuItem}</span>
              </a>
            </li>
          ))
          : (
            <div>No data available</div>
          )}
      </ul>
      <ul className='side-menu'>
        {commonSidebar.map((data, index) =>
          <li style={{ color: data.styleClr }} key={index}
            className={activeStyle === data.id ? 'active' : ''}
            onClick={() => styleChange(data)}>
            <a href={data.menuLink}>
              {data.iconImg}
              <span className="text">{data.menuItem}</span>
            </a>
          </li>
        )}
      </ul>
    </section >
  )
}

export default Sidebar