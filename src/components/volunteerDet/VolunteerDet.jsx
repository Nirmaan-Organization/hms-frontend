import React, { useEffect, useState } from 'react'
import './volunteerDet.css'
import VolunteerRecords from './VolunteerRecords'
import { useDispatch, useSelector } from 'react-redux';
import { setactiveStyle, setValue } from '../redux/reducer';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { getApiUrl } from '../../config';

const VolunteerDet = () => {

    const apiUrl = getApiUrl();

    const campIdD = useSelector(state => state.myReducer.campId)

    const [campDetls, setCampDetls] = useState([])
    useEffect(() => {

        fetch(`${apiUrl}/getOneCamp/${campIdD}`)
            .then(response => response.json())
            .then(data => {
                setCampDetls(data.data.campName)
            }).catch(err => {
                setCampDetls('')
            })
    }, [])


    const dispatch = useDispatch();
    const sidebarChange = () => {
        dispatch(setactiveStyle(2))
        dispatch(setValue(2))
    }

    return (
        <>
            <div className="container">
                <div className="head-title">
                    <div className="left" style={{ display: 'flex', gridGap: '10px' }}>
                        <ArrowCircleLeftIcon onClick={() => sidebarChange()}
                            style={{
                                cursor: 'pointer'
                            }} />
                        <h2>Volunteer Details - {campDetls}</h2>
                    </div>
                    <a href="#" className='btn-download'>

                    </a>
                </div>
                <div className="table-data">
                    <VolunteerRecords />
                </div>
            </div>
        </>
    )
}

export default VolunteerDet