import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CampDet from '../../campdetails/CampDet';
import Dashboard from '../../dashboard/Dashboard';
import AllPatientRecords from '../../patientDetls/AllPatientRecords';
import PatientDet from '../../patientDetls/PatientDet';
import PatientRecords from '../../patientDetls/PatientRecords';
import Settings from '../../settings/Settings';
import AllVolunteerRecords from '../../volunteerDet/AllVolunteerRecords';
import VolunteerDet from '../../volunteerDet/VolunteerDet';
import Sidebar from '../sidebar/Sidebar';
import AccountMenu from './AccountMenu';
import './appbar.css';
import UserDet from '../../userdetails/UserDet';

const Appbar = () => {

    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const name = userProfile ? userProfile.fullName : null;
    const userRole = userProfile.role;
    const masterRole = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']

    const [hideSidebar, sethideSidebar] = useState('')

    const hidebarOption = (e) => {
        sethideSidebar(e);
    }


    const value = useSelector(state => state.myReducer.value)
    const actStyle = useSelector(state => state.myReducer.activeStyle)
    const sideMenu = value === '' ? masterRole.includes(userRole) ? 1 : 2 : value;




    return (
        <>
            <Sidebar hideStyle={hideSidebar} userData={userProfile} />
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
                                {/* <h4  className='nav-link'>Health Management System</h4> */}
                            </div>
                            <div className="header-profile">
                                <AccountMenu />
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
                {sideMenu === 9 && <UserDet />}
            </div>
        </>
    )
}

export default Appbar