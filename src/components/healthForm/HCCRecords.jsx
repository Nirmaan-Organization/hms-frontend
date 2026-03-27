import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { getApiUrl } from '../../config';

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape double-quotes by doubling them; wrap in quotes if needed
  if (/[",\r\n]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function buildCsv(columns, rows) {
  const header = columns.map((c) => toCsvValue(c.header)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => toCsvValue(c.getValue(row))).join(',')
  );
  // Add UTF-8 BOM so Excel opens Unicode CSV correctly
  return `\uFEFF${[header, ...lines].join('\r\n')}`;
}

function downloadTextFile({ filename, content, mimeType }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const HCCRecords = () => {
  const apiUrl = getApiUrl();

  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [vitalsOpen, setVitalsOpen] = useState(false);     // view-only dialog
  const [followOpen, setFollowOpen] = useState(false);     // follow-up dialog
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [followUpData, setFollowUpData] = useState({
    temperatureF: '',
    bloodPressure: '',
    pulseBpm: '',
    oxygenSaturation: '',
  });
  const [loadingVitals, setLoadingVitals] = useState(false);
  const [followUpReport, setFollowUpReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [illnessFilter, setIllnessFilter] = useState('');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState('');

  // current user for follow-up created_by
  const currentUser = localStorage.getItem('userData');
  const userProfile = currentUser ? JSON.parse(currentUser) : null;
  const userId = userProfile ? userProfile.id : null;

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${apiUrl}/health/records`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching health records', err);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const illnessOptions = Array.from(
    new Set(records.map((r) => r.illnessType).filter(Boolean))
  );
  const schoolTypeOptions = Array.from(
    new Set(records.map((r) => r.schoolType).filter(Boolean))
  );

  const filteredRecords = records.filter((row) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [row.studentName, row.schoolName, row.studentId]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(term)
        );

    const matchesIllness =
      !illnessFilter || row.illnessType === illnessFilter;
    const matchesSchoolType =
      !schoolTypeFilter || row.schoolType === schoolTypeFilter;

    return matchesSearch && matchesIllness && matchesSchoolType;
  });

  const pagedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const exportFilteredRecordsCsv = () => {
    const columns = [
      { header: 'School Name', getValue: (r) => r.schoolName },
      { header: 'Student Name', getValue: (r) => r.studentName },
      { header: 'Student ID', getValue: (r) => r.studentId },
      { header: 'Class', getValue: (r) => r.studentClass },
      { header: 'School Type', getValue: (r) => r.schoolType },
      { header: 'District', getValue: (r) => r.district },
      { header: 'Illness Type', getValue: (r) => r.illnessType },
      { header: 'Illness Details', getValue: (r) => r.illness },
      { header: 'Date of Record', getValue: (r) => r.healthDate },
    ];

    const csv = buildCsv(columns, filteredRecords);
    const today = new Date().toISOString().slice(0, 10);
    downloadTextFile({
      filename: `hcc-records-${today}.csv`,
      content: csv,
      mimeType: 'text/csv;charset=utf-8',
    });
  };

  const fetchVitalsForRecord = async (recordId) => {
    setLoadingVitals(true);
    try {
      const res = await fetch(`${apiUrl}/health/records/${recordId}/vitals`);
      const data = await res.json();
      setVitalsHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching vitals history', err);
      setVitalsHistory([]);
    } finally {
      setLoadingVitals(false);
    }
  };

  const openVitals = async (record) => {
    setSelectedRecord(record);
    setVitalsOpen(true);
    await fetchVitalsForRecord(record.id);
  };

  const openFollowUp = async (record) => {
    setSelectedRecord(record);
    setFollowOpen(true);
    await fetchVitalsForRecord(record.id);
  };

  const closeVitals = () => {
    setVitalsOpen(false);
    setSelectedRecord(null);
    setVitalsHistory([]);
    setFollowUpData({
      temperatureF: '',
      bloodPressure: '',
      pulseBpm: '',
      oxygenSaturation: '',
    });
    setFollowUpReport(null);
  };

  const closeFollowUp = () => {
    setFollowOpen(false);
    setSelectedRecord(null);
    setVitalsHistory([]);
    setFollowUpData({
      temperatureF: '',
      bloodPressure: '',
      pulseBpm: '',
      oxygenSaturation: '',
    });
    setFollowUpReport(null);
  };

  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFollowUp = async () => {
    if (!selectedRecord) return;
    try {
      const formData = new FormData();
      Object.entries(followUpData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      if (userId) {
        formData.append('created_by', userId.toString());
      }
      if (followUpReport) {
        formData.append('report', followUpReport);
      }

      const res = await fetch(`${apiUrl}/health/records/${selectedRecord.id}/vitals`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        console.error('Failed to save follow-up vitals');
        return;
      }

      // refresh history in follow-up dialog
      await fetchVitalsForRecord(selectedRecord.id);

      setFollowUpData({
        temperatureF: '',
        bloodPressure: '',
        pulseBpm: '',
        oxygenSaturation: '',
      });
      setFollowUpReport(null);
    } catch (err) {
      console.error('Error saving follow-up vitals', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        HCC Records
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Search"
          placeholder="Student / School / ID"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
        />
        <TextField
          select
          label="Illness Type"
          size="small"
          value={illnessFilter}
          onChange={(e) => {
            setIllnessFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">
            <em>All Illness Types</em>
          </MenuItem>
          {illnessOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="School Type"
          size="small"
          value={schoolTypeFilter}
          onChange={(e) => {
            setSchoolTypeFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">
            <em>All School Types</em>
          </MenuItem>
          {schoolTypeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <Button
          size="small"
          onClick={() => {
            setSearchTerm('');
            setIllnessFilter('');
            setSchoolTypeFilter('');
            setPage(0);
          }}
        >
          Clear
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={exportFilteredRecordsCsv}
          disabled={filteredRecords.length === 0}
        >
          Export CSV
        </Button>
      </Box>
      <Paper>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>School Name</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>School Type</TableCell>
                <TableCell>District</TableCell>
                <TableCell>Illness Type</TableCell>
                <TableCell>Illness Details</TableCell>
                <TableCell>Date of Record</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedRecords.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.schoolName}</TableCell>
                  <TableCell>{row.studentName}</TableCell>
                  <TableCell>{row.studentId}</TableCell>
                  <TableCell>{row.studentClass}</TableCell>
                  <TableCell>{row.schoolType}</TableCell>
                  <TableCell>{row.district}</TableCell>
                  <TableCell>{row.illnessType}</TableCell>
                  <TableCell>{row.illness}</TableCell>
                  <TableCell>{row.healthDate}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => openVitals(row)}
                      sx={{ mr: 1 }}
                    >
                      View Vitals
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openFollowUp(row)}
                    >
                      Follow-up
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View vitals dialog */}
      <Dialog open={vitalsOpen} onClose={closeVitals} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord
            ? `Vitals History - ${selectedRecord.studentName} (${selectedRecord.studentId})`
            : 'Vitals History'}
        </DialogTitle>
        <DialogContent dividers>
          {loadingVitals ? (
            <Typography variant="body2">Loading vitals...</Typography>
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Previous Vitals
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Recorded At</TableCell>
                    <TableCell>Temp (°F)</TableCell>
                    <TableCell>BP (mmHg)</TableCell>
                    <TableCell>Pulse (BPM)</TableCell>
                    <TableCell>Oxygen Sat (%)</TableCell>
                    <TableCell>Report</TableCell>
                    <TableCell>Created by</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vitalsHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No vitals recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vitalsHistory.map((v) => {
                      const reportLink =
                        v.reportUrl ||
                        (v.reportPath ? `${apiUrl}/uploads/${v.reportPath}` : null);

                      return (
                        <TableRow key={v.id}>
                          <TableCell>
                            {v.recordedAt
                              ? new Date(v.recordedAt).toLocaleString()
                              : ''}
                          </TableCell>
                          <TableCell>{v.temperatureF}</TableCell>
                          <TableCell>{v.bloodPressure}</TableCell>
                          <TableCell>{v.pulseBpm}</TableCell>
                          <TableCell>{v.oxygenSaturation}</TableCell>
                          <TableCell>
                            {reportLink ? (
                              <Button
                                size="small"
                                href={reportLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </Button>
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell>{v.created_by_name || v.created_by || ''}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVitals}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Follow-up dialog: history + form */}
      <Dialog open={followOpen} onClose={closeFollowUp} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord
            ? `Follow-up Vitals - ${selectedRecord.studentName} (${selectedRecord.studentId})`
            : 'Follow-up Vitals'}
        </DialogTitle>
        <DialogContent dividers>
          {loadingVitals ? (
            <Typography variant="body2">Loading vitals...</Typography>
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Previous Vitals
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Recorded At</TableCell>
                    <TableCell>Temp (°F)</TableCell>
                    <TableCell>BP (mmHg)</TableCell>
                    <TableCell>Pulse (BPM)</TableCell>
                    <TableCell>Oxygen Sat (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vitalsHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No vitals recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vitalsHistory.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>
                          {v.recordedAt
                            ? new Date(v.recordedAt).toLocaleString()
                            : ''}
                        </TableCell>
                        <TableCell>{v.temperatureF}</TableCell>
                        <TableCell>{v.bloodPressure}</TableCell>
                        <TableCell>{v.pulseBpm}</TableCell>
                        <TableCell>{v.oxygenSaturation}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add Follow-up Vitals
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 180px)', // equal, smaller width boxes
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Temperature (°F)"
                    name="temperatureF"
                    type="number"
                    value={followUpData.temperatureF}
                    onChange={handleFollowUpChange}
                    size="small"
                    sx={{
                      '& input': {
                        border: 'none',
                        fontSize: 14,
                        padding: '6px 8px',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                      },
                    }}
                  />
                  <TextField
                    label="BP (mmHg)"
                    name="bloodPressure"
                    value={followUpData.bloodPressure}
                    onChange={handleFollowUpChange}
                    size="small"
                    placeholder="120/80"
                    sx={{
                      '& input': {
                        border: 'none',
                        fontSize: 14,
                        padding: '6px 8px',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                      },
                    }}
                  />
                  <TextField
                    label="Pulse (BPM)"
                    name="pulseBpm"
                    type="number"
                    value={followUpData.pulseBpm}
                    onChange={handleFollowUpChange}
                    size="small"
                    sx={{
                      '& input': {
                        border: 'none',
                        fontSize: 14,
                        padding: '6px 8px',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                      },
                    }}
                  />
                  <TextField
                    label="Oxygen Sat (%)"
                    name="oxygenSaturation"
                    type="number"
                    value={followUpData.oxygenSaturation}
                    onChange={handleFollowUpChange}
                    size="small"
                    sx={{
                      '& input': {
                        border: 'none',
                        fontSize: 14,
                        padding: '6px 8px',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: 36,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                  >
                    {followUpReport ? 'Change Report (Image / PDF)' : 'Upload Report (Image / PDF)'}
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        setFollowUpReport(file || null);
                      }}
                    />
                  </Button>
                  {followUpReport && (
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      {followUpReport.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFollowUp}>Close</Button>
          <Button onClick={submitFollowUp} variant="contained" disabled={!selectedRecord}>
            Save Follow-up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HCCRecords;

