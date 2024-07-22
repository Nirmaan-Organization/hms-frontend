import React, { useEffect } from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Appbar from '../common/header/Appbar';
import { GroupAddOutlined, MedicalServicesOutlined, PeopleOutlineOutlined, PersonOutlineOutlined, VolunteerActivismOutlined } from '@mui/icons-material';
import { useState } from 'react';

import './dashboard.css'

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
                    <div className="left">
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

                    </div>
                    <div className="head-subsession1">

                    </div>

                </div>

            </div>
        </>
    )
}

export default Dashboard