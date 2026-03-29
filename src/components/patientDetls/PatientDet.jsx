import React, { useEffect, useState } from 'react'
import './patientDet.css'
import PatientRecords from './PatientRecords'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowBackIosNewOutlined, BackHandOutlined, BackpackOutlined } from '@mui/icons-material';
import { setactiveStyle, setValue } from '../redux/reducer';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const PatientDet = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

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
                                cursor:'pointer'
                            }} />
                        <h2>Patient Details - {campDetls}</h2>
                    </div>
                   
                </div>
                <div className="table-data">
                    <PatientRecords />
                </div>
            </div>
        </>
    )
}

export default PatientDet