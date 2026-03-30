import { GroupAddOutlined, MedicalServicesOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import CampDataChart from './charts/CampDataChart';
import RoleBasedUserChart from './charts/RoleBasedUserChart';
import './dashboard.css';

const Dashboard = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [patientCount, setpatientCount] = useState('')
    const [campCount, setcampCount] = useState('')
    const [userCount, setUserCount] = useState('')

    useEffect(() => {
        fetch(`${apiUrl}/getcount`)
            .then(response => response.json())
            .then(data => {
                setpatientCount(data.patientcount)
                setcampCount(data.campCount)
                setUserCount(data.userCount)
            }).catch(err => {

            })
    }, [])


    return (
        <>
            <div className='dashboard'>
                <div className="head-title">
                    <div className="sesstion-header-name">
                        <h2>Dashboard</h2>
                    </div>
                </div>
                <ul className="box-info">
                    <li>
                        <PersonOutlineOutlined className='bx' />
                        <span className="text">
                            <h3>{userCount}</h3>
                            <p>Users</p>
                        </span>
                    </li>
                    <li>
                        <MedicalServicesOutlined className='bx' />
                        <span className="text">
                            <h3>{campCount}</h3>
                            <p>Overall Camp</p>
                        </span>
                    </li>
                    <li>
                        <GroupAddOutlined className='bx' />
                        <span className="text">
                            <h3>{patientCount}</h3>
                            <p>Patient Count</p>
                        </span>
                    </li>
                </ul>
                <div className="head-session1">
                    <div className="head-subsession1">
                        <RoleBasedUserChart />
                    </div>
                    <div className="head-subsession1">
                        <CampDataChart />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard