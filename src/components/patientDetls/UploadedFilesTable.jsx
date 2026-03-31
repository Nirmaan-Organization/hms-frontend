import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip
} from "@mui/material";
import {
  DownloadOutlined,
  DeleteOutlineOutlined,
  AddCircleOutlineOutlined
} from "@mui/icons-material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileSaver from "file-saver";
import { NotificationContainer, NotificationManager } from "react-notifications"; 
import ExtractBloodReport from "./ExtractBloodReport";
import "./patientDet.css"; 
import AddPatientReport from "./patientReports/AddPatientReport";

const UploadedFilesTable = ({
  data,
  handleBack,
  selectedPatientName,
  selectedData
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAddAttachmentOpen, setIsAddAttachmentOpen] = useState(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);

  // 📅 Format Date
  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  // 📡 Fetch Files
  const fetchUploadedFiles = async () => {
    try {
      if (!data) return;

      const res = await fetch(`${apiUrl}/getPatientReports/${data}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();
      setUploadedFiles(json || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, [data]);

  // 📥 Download
  const handleDownload = async (filePath) => {
    try {
      const res = await fetch(`${apiUrl}/downloadattachment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      FileSaver.saveAs(blob, filePath);
    } catch (err) {
      console.error(err);
      NotificationManager.error("Download failed");
    }
  };

  // 🗑 Delete
  const deleteAttachment = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/deleteAttachment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ created_by: "2" })
      });

      const data = await res.json();

      if (res.ok) {
        NotificationManager.success(data.message);
        fetchUploadedFiles();
      } else {
        NotificationManager.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 👁 View
  const viewReport = () => setIsViewReportOpen(true);
  const closeReport = () => setIsViewReportOpen(false);

  return (
    <>
      {isViewReportOpen ? (
        <ExtractBloodReport CloseReport={closeReport} />
      ) : (
        <div className="sub-container">

          {/* 🔝 Header */}
          <div className="head">
            <div className="flex items-center gap-2 mb-2">
              <Tooltip title="Back">
                <IconButton onClick={handleBack}>
                  <ArrowCircleLeftIcon />
                </IconButton>
              </Tooltip>

              <h3>
                Files for Patient: {selectedPatientName}
              </h3>
            </div>

            <div>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchUploadedFiles}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Report">
                <IconButton onClick={() => setIsAddAttachmentOpen(true)}>
                  <AddCircleOutlineOutlined />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* 📊 Table */}
          <Paper className="table-patient-container">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {uploadedFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No files uploaded
                      </TableCell>
                    </TableRow>
                  ) : (
                    uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          {file.reportFileName?.length > 25
                            ? `${file.reportFileName.slice(0, 20)}...`
                            : file.reportFileName}
                        </TableCell>

                        <TableCell>{file.reportType}</TableCell>
                        <TableCell>{file.description}</TableCell>
                        <TableCell>
                          {formatDateTime(file.reportUploadDate)}
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton onClick={() => viewReport(file)}>
                              <FileOpenOutlinedIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Download">
                            <IconButton
                              onClick={() =>
                                handleDownload(file.reportFilePath)
                              }
                            >
                              <FileDownloadOutlinedIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => deleteAttachment(file.id)}
                            >
                              <DeleteOutlineOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* ➕ Add Attachment Modal */}
          {isAddAttachmentOpen && (
            <AddPatientReport
              data={selectedData}
              loadUploadedFiles={fetchUploadedFiles}
              isOpen={isAddAttachmentOpen}
              onClose={() => setIsAddAttachmentOpen(false)}
            />
          )}

          <NotificationContainer />
        </div>
      )}
    </>
  );
};

export default UploadedFilesTable;