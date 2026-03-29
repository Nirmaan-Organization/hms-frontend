import React from 'react';
import CampDatadet from './CampDatadet';
import './campdet.css';

const CampDet = () => {
  return (
    <>
      <div className="container">

        <div className="head-title">
          <div className="left">
            <div className="sesstion-header-name">
              <h2>Camp Details</h2>
            </div>

            <a href="#" className="btn-download"></a>
          </div>
        </div> {/* ✅ FIX: close head-title */}

        <div className="table-data-camp">
          <CampDatadet />
        </div>

      </div>
    </>
  );
};

export default CampDet;