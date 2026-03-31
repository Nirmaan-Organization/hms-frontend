import React, { useEffect, useState } from 'react';
import './volunteerDet.css';
import VolunteerRecords from './VolunteerRecords';
import { useDispatch, useSelector } from 'react-redux';
import { setactiveStyle, setValue } from '../redux/reducer';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const VolunteerDet = () => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const campIdD = useSelector(state => state.myReducer.campId);

    const [campDetls, setCampDetls] = useState('');

    useEffect(() => {
        if (campIdD) {
            fetch(`${apiUrl}/getCampNameDet/${campIdD}`)
                .then(res => res.json())
                .then(data => setCampDetls(data.campName))
                .catch(() => setCampDetls(''));
        }
    }, [campIdD, apiUrl]); // ✅ FIX: dependency added

    const dispatch = useDispatch();

    const sidebarChange = () => {
        dispatch(setactiveStyle(2));
        dispatch(setValue(2));
    };

    return (
        <div className="container">

            <div className="head-title">
                <div className="left" style={{ display: 'flex', gap: '10px' }}>
                    
                    <div
                        className="sesstion-header-name"
                        style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                    >
                        <ArrowCircleLeftIcon
                            onClick={sidebarChange}
                            style={{ cursor: 'pointer' }}
                        />
                        <h2>Volunteer Details - {campDetls}</h2>
                    </div>

                </div>
            </div> {/* ✅ CLOSED properly */}

            <div className="table-data">
                <VolunteerRecords />
            </div>

        </div>
    );
};

export default VolunteerDet;
