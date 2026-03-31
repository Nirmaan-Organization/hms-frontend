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
  const [exportingCsv, setExportingCsv] = useState(false);
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
  const [followUpErrors, setFollowUpErrors] = useState({
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
      const list =
        Array.isArray(data) ? data
          : Array.isArray(data?.data) ? data.data
            : Array.isArray(data?.value) ? data.value
              : Array.isArray(data?.rows) ? data.rows
                : [];
      setRecords(list);
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

  const exportFilteredRecordsCsv = async () => {
    if (exportingCsv) return;
    setExportingCsv(true);
    try {
      const columns = [
        { header: 'Type', getValue: (r) => r.type },
        { header: 'School Name', getValue: (r) => r.schoolName },
        { header: 'Student Name', getValue: (r) => r.studentName },
        { header: 'Student ID', getValue: (r) => r.studentId },
        { header: 'Class', getValue: (r) => r.studentClass },
        { header: 'School Type', getValue: (r) => r.schoolType },
        { header: 'District', getValue: (r) => r.district },
        { header: 'Illness Type', getValue: (r) => r.illnessType },
        { header: 'Illness Details', getValue: (r) => r.illness },
        { header: 'Vitals Recorded At', getValue: (r) => r.vitalsRecordedAt },
        { header: 'Temp (°F)', getValue: (r) => r.temperatureF },
        { header: 'BP (mmHg)', getValue: (r) => r.bloodPressure },
        { header: 'Pulse (BPM)', getValue: (r) => r.pulseBpm },
        { header: 'Oxygen Sat (%)', getValue: (r) => r.oxygenSaturation },
      ];

      const fetchVitals = async (recordId) => {
        const res = await fetch(`${apiUrl}/health/records/${recordId}/vitals`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      };

      const rowsNested = await Promise.all(
        filteredRecords.map(async (rec) => {
          let vitals = [];
          try {
            vitals = await fetchVitals(rec.id);
          } catch {
            vitals = [];
          }

          // If no vitals exist, still export one "Record" row with blanks.
          if (!vitals || vitals.length === 0) {
            return [{
              type: 'Record',
              ...rec,
              vitalsRecordedAt: '',
              temperatureF: '',
              bloodPressure: '',
              pulseBpm: '',
              oxygenSaturation: '',
            }];
          }

          // Earliest vitals row is treated as the original "Record";
          // subsequent rows are "Follow-up".
          return vitals.map((v, idx) => ({
            type: idx === 0 ? 'Record' : 'Follow-up',
            ...rec,
            vitalsRecordedAt: v.recordedAt ? new Date(v.recordedAt).toLocaleString() : '',
            temperatureF: v.temperatureF ?? '',
            bloodPressure: v.bloodPressure ?? '',
            pulseBpm: v.pulseBpm ?? '',
            oxygenSaturation: v.oxygenSaturation ?? '',
          }));
        })
      );

      const exportRows = rowsNested.flat();
      const csv = buildCsv(columns, exportRows);
      const today = new Date().toISOString().slice(0, 10);
      downloadTextFile({
        filename: `hcc-records-with-vitals-${today}.csv`,
        content: csv,
        mimeType: 'text/csv;charset=utf-8',
      });
    } finally {
      setExportingCsv(false);
    }
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
    setFollowUpErrors({
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
    setFollowUpErrors({
      temperatureF: '',
      bloodPressure: '',
      pulseBpm: '',
      oxygenSaturation: '',
    });
    setFollowUpReport(null);
  };

  const validateVitalsField = (name, value) => {
    switch (name) {
      case 'temperatureF': {
        if (!value) return 'Temperature is required.';
        const temp = parseFloat(value);
        if (Number.isNaN(temp)) return 'Temperature must be a number.';
        if (temp < 90 || temp > 110) return 'Temperature should be between 90°F and 110°F.';
        return '';
      }
      case 'bloodPressure': {
        const bpValue = (value || '').trim();
        if (!bpValue) return 'BP is required.';
        const bpMatch = bpValue.match(/^(\d{2,3})\/(\d{2,3})$/);
        if (!bpMatch) return 'BP must be in the format 120/80.';
        const systolic = parseInt(bpMatch[1], 10);
        const diastolic = parseInt(bpMatch[2], 10);
        if (systolic < 80 || systolic > 200 || diastolic < 40 || diastolic > 130) {
          return 'BP values look out of range (systolic 80–200, diastolic 40–130).';
        }
        return '';
      }
      case 'pulseBpm': {
        if (!value) return 'Pulse is required.';
        const pulse = parseInt(value, 10);
        if (Number.isNaN(pulse)) return 'Pulse must be a number.';
        if (pulse < 40 || pulse > 200) return 'Pulse (BPM) should be between 40 and 200.';
        return '';
      }
      case 'oxygenSaturation': {
        if (!value) return 'Oxygen saturation is required.';
        const spo2 = parseInt(value, 10);
        if (Number.isNaN(spo2)) return 'Oxygen saturation must be a number.';
        if (spo2 < 70 || spo2 > 100) return 'Oxygen Saturation (%) should be between 70 and 100.';
        return '';
      }
      default:
        return '';
    }
  };

  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (['temperatureF', 'bloodPressure', 'pulseBpm', 'oxygenSaturation'].includes(name)) {
      const msg = validateVitalsField(name, value);
      setFollowUpErrors((prev) => ({
        ...prev,
        [name]: msg,
      }));
    }
  };

  const isFollowUpReadyToSubmit =
    Boolean(selectedRecord) &&
    ['temperatureF', 'bloodPressure', 'pulseBpm', 'oxygenSaturation'].every((k) => {
      const v = String(followUpData[k] ?? '').trim();
      return v !== '' && validateVitalsField(k, v) === '';
    });

  const submitFollowUp = async () => {
    if (!selectedRecord) return;

    const newErrors = {
      temperatureF: validateVitalsField('temperatureF', followUpData.temperatureF),
      bloodPressure: validateVitalsField('bloodPressure', followUpData.bloodPressure),
      pulseBpm: validateVitalsField('pulseBpm', followUpData.pulseBpm),
      oxygenSaturation: validateVitalsField('oxygenSaturation', followUpData.oxygenSaturation),
    };
    setFollowUpErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

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
      setFollowUpErrors({
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
          disabled={filteredRecords.length === 0 || exportingCsv}
        >
          {exportingCsv ? 'Exporting…' : 'Export CSV'}
        </Button>
      </Box>
      <Paper>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>District</TableCell>
                <TableCell>School Name</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>School Type</TableCell>
                <TableCell sx={{ minWidth: 170 }}>Student Name</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Class</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Illness Type</TableCell>
                <TableCell>Illness Details</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Date of Record</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedRecords.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.district}</TableCell>
                  <TableCell>{row.schoolName}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.schoolType}</TableCell>
                  <TableCell>
                    <Box sx={{ lineHeight: 1.2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.studentName}
                      </Typography>
                      {row.studentId ? (
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          ({row.studentId})
                        </Typography>
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.studentClass}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.illnessType}</TableCell>
                  <TableCell>{row.illness}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.healthDate}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 220,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.75,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => openVitals(row)}
                        fullWidth
                        sx={{
                          minWidth: 190,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View Vitals & Reports
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openFollowUp(row)}
                        fullWidth
                        sx={{
                          minWidth: 190,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Follow-up
                      </Button>
                    </Box>
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
                    <TableCell>Report</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vitalsHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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
                        </TableRow>
                      );
                    })
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
                    required
                    error={Boolean(followUpErrors.temperatureF)}
                    helperText={followUpErrors.temperatureF}
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
                    required
                    error={Boolean(followUpErrors.bloodPressure)}
                    helperText={followUpErrors.bloodPressure}
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
                    required
                    error={Boolean(followUpErrors.pulseBpm)}
                    helperText={followUpErrors.pulseBpm}
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
                    required
                    error={Boolean(followUpErrors.oxygenSaturation)}
                    helperText={followUpErrors.oxygenSaturation}
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
          <Button onClick={submitFollowUp} variant="contained" disabled={!isFollowUpReadyToSubmit}>
            Save Follow-up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HCCRecords;

