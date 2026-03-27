import React, { useState } from 'react'
import './appbar.css'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Sidebar from '../sidebar/Sidebar';
import Dashboard from '../../dashboard/Dashboard';
import CampDet from '../../campdetails/CampDet';
import { useSelector } from 'react-redux';
import VolunteerDet from '../../volunteerDet/VolunteerDet';
import Settings from '../../settings/Settings';
import AccountMenu from './AccountMenu';
import PatientDet from '../../patientDetls/PatientDet';
import AllPatientRecords from '../../patientDetls/AllPatientRecords';
import AllVolunteerRecords from '../../volunteerDet/AllVolunteerRecords';
import HealthFormPage from '../../healthForm/page';
import HCCRecords from '../../healthForm/HCCRecords';
import Statistics from '../../healthForm/Statistics';
import { isHccAdmin, isHccRole, isSuperAdmin } from '../../../utils/roleUtils';

const Appbar = () => {

    const [hideSidebar, sethideSidebar] = useState('')

    const hidebarOption = (e) => {
        sethideSidebar(e);
    }

    const value = useSelector(state => state.myReducer.value)
    const sideMenu = value === '' ? 1 : value;

    const canSeeHcc = isSuperAdmin() || isHccRole();
    const canSeeHccStats = isSuperAdmin() || isHccAdmin();

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
                {sideMenu === 9 && (canSeeHcc ? <HealthFormPage /> : <Dashboard />)}
                {sideMenu === 10 && (canSeeHcc ? <HCCRecords /> : <Dashboard />)}
                {sideMenu === 11 && (canSeeHccStats ? <Statistics /> : <Dashboard />)}
            </div>
        </>
    )
}

export default Appbar