import React from "react";
import "./userdet.css";
import UserDatadetls from "./UserDatadetls";

const UserDet = () => {
  return (
    <div className="container">
      
      {/* Header */}
      <div className="head-title">
        <div className="left">
          <div className="session-header-name">
            <h2>User Management</h2>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-data">
        <UserDatadetls />
      </div>

    </div>
  );
};

export default UserDet;