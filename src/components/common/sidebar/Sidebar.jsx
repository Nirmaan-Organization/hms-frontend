import { DashboardCustomizeOutlined, GroupAddTwoTone, LocalHospitalTwoTone, LogoutOutlined, SettingsApplicationsOutlined, QueryStatsOutlined } from '@mui/icons-material';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setValue } from '../../redux/reducer';
import './sidebar.css';
import headerLogo from '../../../images/hms-logo.png'
import headerIcon from '../../../images/hms-icon.png'
import { isHccAdmin, isHccRole, isSuperAdmin } from '../../../utils/roleUtils';

const Sidebar = ({ hideStyle }) => {

  const canSeeHcc = isSuperAdmin() || isHccRole();
  const canSeeHccStats = isSuperAdmin() || isHccAdmin();

  const sidebarIcons = [
    {
      id: 1, menuItem: 'Dashboard',
      iconImg: <DashboardCustomizeOutlined className='bx' />, menuLink: '/'
    },
    { id: 2, menuItem: 'Camp Management', iconImg: <HolidayVillageOutlinedIcon className='bx' />, menuLink: '/' },
    { id: 4, menuItem: 'All Patient Details', iconImg: <LocalHospitalTwoTone className='bx' />, menuLink: '/' },
    { id: 6, menuItem: 'All Volunteer Details', iconImg: <GroupAddTwoTone className='bx' />, menuLink: '/' },
    ...(canSeeHcc ? [
      { id: 9, menuItem: 'HCC Data Entry', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '/' },
      { id: 10, menuItem: 'HCC Records', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '/' },
    ] : []),
    ...(canSeeHccStats ? [
      { id: 11, menuItem: 'HCC Dashboard', iconImg: <QueryStatsOutlined className='bx' />, menuLink: '/' },
    ] : []),
    // { id: 7, menuItem: 'Inventory Management', iconImg: <InventoryOutlinedIcon className='bx' />, menuLink: '/' }
  ]

  const commonSidebar = [
    {
      id: 8, menuItem: 'Settings',
      iconImg: <SettingsApplicationsOutlined className='bx' />, menuLink: '/',
      styleClr: ''
    },
    {
      id: 7, menuItem: 'Logout',
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
      <a href="/" className='brand' onClick={(e) => e.preventDefault()}>
        <div className="form-input">
        <img src={headerIcon} className='img-icon2' alt="Logo" />
          {hideStyle === 'hide' ?
            <img src={headerIcon} className='img-icon' alt="Logo" /> :
            <img src={headerLogo} className='img-logo' alt="Logo" id={hideStyle} />
          }

        </div>
      </a>
      <ul className="side-menu top">
        {sidebarIcons.map((data, index) =>
          <li key={index}
            className={activeStyle === data.id ? 'active' : ''}
            onClick={() => styleChange(data)}>
            <a href="/" onClick={(e) => e.preventDefault()}>
              {data.iconImg}
              <span className="text">{data.menuItem}</span>
            </a>
          </li>
        )}
      </ul>
      <ul className='side-menu'>
        {commonSidebar.map((data, index) =>
          <li style={{ color: data.styleClr }} key={index}
            className={activeStyle === data.id ? 'active' : ''}
            onClick={() => styleChange(data)}>
            <a href={data.id === 6 ? '#' : data.menuLink}>
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