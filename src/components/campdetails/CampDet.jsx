import React from 'react';
import CampDatadet from './CampDatadet';
import './campdet.css';


const CampDet = () => {
  return (
    <>
      <div className="container">
        <div className="head-title">
          <div className="left">
            <h2>Camp Details</h2>

          </div>
          <a href="#" className='btn-download'>

          </a>
        </div>
        <div className="table-data">

          <CampDatadet />
        </div>
      </div>
    </>
  )
}

export default CampDet