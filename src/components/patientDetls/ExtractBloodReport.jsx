import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const ExtractBloodReport = ({ CloseReport }) => {
    const personalInfo = {
        name: 'Yash M. Patel',
        age: '21 Years',
        sex: 'Male',
        pid: '555',
        referredBy: 'Dr. Hiren Shah',
        sampleCollectedAt: '125, Shivam Bungalow, S G Road, Mumbai',
    };

    const bloodTests = [
        { test: 'Hemoglobin (Hb)', result: '12.5', range: '13.0 - 17.0', unit: 'g/dL', status: 'Low' },
        { test: 'Total RBC count', result: '5.2', range: '4.5 - 5.5', unit: 'mill/cumm', status: 'Normal' },
        { test: 'Total WBC count', result: '9000', range: '4000 - 11000', unit: 'cumm', status: 'Normal' },
        { test: 'Neutrophils', result: '60', range: '50 - 62', unit: '%', status: 'Normal' },
        { test: 'Lymphocytes', result: '31', range: '20 - 40', unit: '%', status: 'Normal' },
        { test: 'Eosinophils', result: '1', range: '00 - 06', unit: '%', status: 'Normal' },
        { test: 'Monocytes', result: '7', range: '00 - 10', unit: '%', status: 'Normal' },
        { test: 'Basophils', result: '1', range: '00 - 02', unit: '%', status: 'Normal' },
        { test: 'Platelet Count', result: '150000', range: '150000 - 410000', unit: 'cumm', status: 'Borderline' },
    ];

    return (
        <div>
            <div style={{ padding: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <IconButton onClick={CloseReport} size="small">
                        <Tooltip title="Back">
                            <ArrowCircleLeftIcon fontSize="small" />
                        </Tooltip>
                    </IconButton>
                    <Typography variant="h6" align="center" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                        Complete Blood Count (CBC) Report
                    </Typography>
                </Box>

                {/* Scrollable Content */}
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {/* Personal Information */}
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Personal Information
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Name:</strong> {personalInfo.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">
                                    <strong>Age:</strong> {personalInfo.age}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">
                                    <strong>Sex:</strong> {personalInfo.sex}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>PID:</strong> {personalInfo.pid}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Referred By:</strong> {personalInfo.referredBy}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <strong>Sample Collected At:</strong> {personalInfo.sampleCollectedAt}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Blood Test Results */}
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Blood Test Results
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Test</strong></TableCell>
                                        <TableCell><strong>Result</strong></TableCell>
                                        <TableCell><strong>Reference Range</strong></TableCell>
                                        <TableCell><strong>Unit</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bloodTests.map((test, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{test.test}</TableCell>
                                            <TableCell>{test.result}</TableCell>
                                            <TableCell>{test.range}</TableCell>
                                            <TableCell>{test.unit}</TableCell>
                                            <TableCell>{test.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default ExtractBloodReport;
