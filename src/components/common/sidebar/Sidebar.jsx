import { DashboardCustomizeOutlined, GroupAddTwoTone, LocalHospitalTwoTone, LogoutOutlined, QueryStatsOutlined, SettingsApplicationsOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import headerIcon from '../../../images/hms-icon.png';
import headerLogo from '../../../images/hms-logo.png';
import { isHccAdmin, isHccDataEntry, isHccRole, isHccSupervisor, isSuperAdmin } from '../../../utils/roleUtils';
import { setValue } from '../../redux/reducer';
import './sidebar.css';
 
const Sidebar = ({ hideStyle, userData }) => {

  const userRole = userData.role;

  const masterRole = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']
  const specifyRole = ['ROLE_HEALTHCARE_PROVIDER']

  const isSuper = userRole === 'ROLE_SUPER_ADMIN' || isSuperAdmin();
  const isHccAdminRole = userRole === 'ROLE_HCC_ADMIN' || isHccAdmin();
  const isHccDataEntryRole = userRole === 'ROLE_HCC_DATA_ENTRY' || isHccDataEntry();
  const isHccSupervisorRole = userRole === 'ROLE_HCC_SUPERVISOR' || userRole === 'ROLE_HCC_SUPERVISORE' || isHccSupervisor();
  const isAnyHccRole = isHccAdminRole || isHccDataEntryRole || isHccSupervisorRole || isHccRole();

  const hccMenuItems = [
    { id: 90, menuItem: 'HCC Data Entry', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '#' },
    { id: 91, menuItem: 'HCC Records', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '#' },
  ];

  const hccDashboardItem = { id: 92, menuItem: 'HCC Dashboard', iconImg: <QueryStatsOutlined className='bx' />, menuLink: '#' };
  const hccSupervisorItems = [
    { id: 91, menuItem: 'HCC Records', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '#' },
    hccDashboardItem,
  ];

  const baseSidebarIcons = [
    masterRole.includes(userRole) ? { id: 1, menuItem: 'Dashboard', iconImg: <DashboardCustomizeOutlined className='bx' />, menuLink: '#' } : '',
    { id: 2, menuItem: 'Camp Management', iconImg: <HolidayVillageOutlinedIcon className='bx' />, menuLink: '#' },
    masterRole.includes(userRole) || specifyRole.includes(userRole) ? { id: 4, menuItem: 'Patient Information', iconImg: <LocalHospitalTwoTone className='bx' />, menuLink: '#' } : '',
    masterRole.includes(userRole) ? { id: 6, menuItem: 'All Volunteer Details', iconImg: <GroupAddTwoTone className='bx' />, menuLink: '#' } : '',
    isSuper ? { id: 9, menuItem: 'User Management', iconImg: <VerifiedUserOutlined className='bx' />, menuLink: '#' } : ''
  ];

  // Visibility rules requested:
  // - HCC admin: only HCC Data Entry, HCC Records, HCC Dashboard
  // - HCC data entry: only HCC Data Entry, HCC Records
  // - HCC supervisor: only HCC Records, HCC Dashboard
  // - Super admin: sees everything + all HCC items
  let sidebarIcons = baseSidebarIcons;
  if (!isSuper && isAnyHccRole) {
    sidebarIcons = isHccAdminRole
      ? [...hccMenuItems, hccDashboardItem]
      : isHccSupervisorRole
        ? [...hccSupervisorItems]
        : [...hccMenuItems];
  } else if (isSuper) {
    sidebarIcons = [
      ...baseSidebarIcons,
      ...hccMenuItems,
      hccDashboardItem,
    ];
  }

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