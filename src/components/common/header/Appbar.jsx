import React, { useEffect, useState } from 'react'
import './appbar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import avatar from '../../../images/userprofile.png'
import Sidebar from '../sidebar/Sidebar';
import Dashboard from '../../dashboard/Dashboard';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import CampDet from '../../campdetails/CampDet';
import { useSelector } from 'react-redux';
import VolunteerDet from '../../volunteerDet/VolunteerDet';
import Settings from '../../settings/Settings';
import AccountMenu from './AccountMenu';
import headerLogo from '../../../images/hms-logo.png'
import PatientDet from '../../patientDetls/PatientDet';
import AllPatientRecords from '../../patientDetls/AllPatientRecords';
import AllVolunteerRecords from '../../volunteerDet/AllVolunteerRecords';

const Appbar = () => {

    const [hideSidebar, sethideSidebar] = useState('')

    const hidebarOption = (e) => {
        sethideSidebar(e);
    }

    const value = useSelector(state => state.myReducer.value)
    const actStyle = useSelector(state => state.myReducer.activeStyle)
    const sideMenu = value == '' ? 1 : value;


    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const name = userProfile ? userProfile.fullName : null;

    return (
        <>
            <Sidebar hideStyle={hideSidebar} />
            <div className='container-main' id={hideSidebar}>
                <section className='content'>
                    <div>
                        <nav>
                            {hideSidebar === '' ?
                                <MenuOpenIcon className='bx bx-menu'
                                    onClick={() => hidebarOption('hide')} />
                                :
                                <MenuOpenIcon className='bx bx-menu'
                                    onClick={() => hidebarOption('')} />
                            }
                            <div className="form-input">
                                {/* <img src={headerLogo} alt="Logo" /> */}
                                {/* <a href='#' className='nav-link'>Health Camp Org</a> */}
                            </div>
                            <div className="header-profile">
                                <AccountMenu />
                                {/* <div className="header-name">
                                    <p>Hi, {name.slice(name.lastIndexOf(' ') + 1)}</p>
                                </div>
                                <a href='#' className='profile'>
                                    <img src={avatar} alt="" />
                                </a> */}
                            </div>

                        </nav>
                    </div>
                </section>
                {sideMenu === 1 && <Dashboard />}
                {sideMenu === 2 && <CampDet />}
                {sideMenu === 3 && <PatientDet />}
                {sideMenu === 4 && <AllPatientRecords />}
                {sideMenu === 5 && <VolunteerDet />}
                {sideMenu === 6 && <AllVolunteerRecords />}
                {sideMenu === 8 && <Settings />}
            </div>
        </>
    )
}

export default Appbar