import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CampDet from '../../campdetails/CampDet';
import Dashboard from '../../dashboard/Dashboard';
import HealthFormPage from '../../healthForm/page';
import HCCRecords from '../../healthForm/HCCRecords';
import Statistics from '../../healthForm/Statistics';
import AllPatientRecords from '../../patientDetls/AllPatientRecords';
import PatientDet from '../../patientDetls/PatientDet';
import Settings from '../../settings/Settings';
import AllVolunteerRecords from '../../volunteerDet/AllVolunteerRecords';
import VolunteerDet from '../../volunteerDet/VolunteerDet';
import Sidebar from '../sidebar/Sidebar';
import AccountMenu from './AccountMenu';
import './appbar.css';
import UserDet from '../../userdetails/UserDet';
import { isHccAdmin, isHccDataEntry, isHccRole, isHccSupervisor, isSuperAdmin } from '../../../utils/roleUtils';
import { setactiveStyle, setValue } from '../../redux/reducer';

const Appbar = () => {

    const currentUser = localStorage.getItem('userData')
    const userProfile = JSON.parse(currentUser)
    const userRole = userProfile.role;
    const masterRole = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']

    const [hideSidebar, sethideSidebar] = useState('')

    const hidebarOption = (e) => {
        sethideSidebar(e);
    }


    const dispatch = useDispatch();
    const value = useSelector(state => state.myReducer.value)

    const canSeeHcc = isSuperAdmin() || isHccRole() || userRole === 'ROLE_HCC_ADMIN' || userRole === 'ROLE_HCC_DATA_ENTRY' || userRole === 'ROLE_HCC_SUPERVISOR' || userRole === 'ROLE_HCC_SUPERVISORE';
    const canSeeHccStats = isSuperAdmin() || isHccAdmin() || isHccSupervisor() || userRole === 'ROLE_HCC_ADMIN' || userRole === 'ROLE_HCC_SUPERVISOR' || userRole === 'ROLE_HCC_SUPERVISORE';
    const canSeeHccRecords = canSeeHcc;
    const canSeeHccEntry =
        isSuperAdmin() ||
        isHccAdmin() ||
        isHccDataEntry() ||
        userRole === 'ROLE_HCC_ADMIN' ||
        userRole === 'ROLE_HCC_DATA_ENTRY';

    const isMaster = masterRole.includes(userRole);
    const isHccUser = userRole === 'ROLE_HCC_ADMIN' || userRole === 'ROLE_HCC_DATA_ENTRY' || userRole === 'ROLE_HCC_SUPERVISOR' || userRole === 'ROLE_HCC_SUPERVISORE' || isHccRole();
    const isHccSupervisorRole = userRole === 'ROLE_HCC_SUPERVISOR' || userRole === 'ROLE_HCC_SUPERVISORE' || isHccSupervisor();

    // Default landing page after login:
    // - HCC Admin / HCC Data Entry: HCC Data Entry (id 90)
    // - Master roles: Dashboard (id 1)
    // - Others: Camp Management (id 2)
    useEffect(() => {
        if (value !== '') return;

        const defaultId = isHccUser ? (isHccSupervisorRole ? 91 : 90) : (isMaster ? 1 : 2);
        dispatch(setValue(defaultId));
        dispatch(setactiveStyle(defaultId));
    }, [dispatch, isHccSupervisorRole, isHccUser, isMaster, value]);

    const sideMenu = value === '' ? (isHccUser ? (isHccSupervisorRole ? 91 : 90) : (isMaster ? 1 : 2)) : value;

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
                {sideMenu === 90 && (canSeeHccEntry ? <HealthFormPage /> : <Dashboard />)}
                {sideMenu === 91 && (canSeeHccRecords ? <HCCRecords /> : <Dashboard />)}
                {sideMenu === 92 && (canSeeHccStats ? <Statistics /> : <Dashboard />)}
            </div>
        </>
    )
}

export default Appbar