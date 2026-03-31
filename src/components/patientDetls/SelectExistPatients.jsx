import { CancelOutlined } from '@mui/icons-material';
import { Button, Grid, Modal, TextField, ThemeProvider } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

const getStyles = (name, personName, theme) => {
    return {
        fontWeight:
            personName.some((person) => person.patientFullName === name)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
    };
};

const SelectExistPatients = ({ fetchVoluntrData, campIdD, userID, isSelectPatients, onSelectPatients }) => {

    const apiUrl = process.env.REACT_APP_API_URL;


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px'
    };

    const theme = useTheme();

    const [personName, setPersonName] = useState([]);

    const [patientsNames, setPatientsNames] = useState([])
    useEffect(() => {
        fetch(`${apiUrl}/getPatientsNames`)
            .then(response => response.json())
            .then(data => {
                setPatientsNames(data)
            }).catch(err => {

            })
    }, [])

    const newCampId = campIdD;

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const addVolunteerCamps = async (e) => {
        let payload = {
            "campId": newCampId,
            "userIds": personName.map(person => person.id)
        }
        setPersonName([])
        try {
            const res = await fetch(`${apiUrl}/assignCamptoPatients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message !== 'FAILED') {
                    await fetchVoluntrData();
                    NotificationManager.success(data.message)
                    onSelectPatients();
                } else {
                    NotificationManager.error(data.message)
                }
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error.message)
        }
    }
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredVolunteers = patientsNames.filter((patient) =>
        patient.patientFullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Modal open={isSelectPatients}>
                <div>
                    <Box sx={style} >
                        <CancelOutlined className="closed-editjobmodal" onClick={onSelectPatients} />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gridGap: '10px' }}>
                            <Grid item xs={12} className="forms-controfl">
                                <label style={{ fontSize: '16px' }}>Select Patients</label>
                                <ThemeProvider theme={theme}>
                                    <input type='search'
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        placeholder="Search volunteers"
                                        variant="outlined"
                                        style={{ marginBottom: '10px', width: '300px', fontSize:'14px'}}
                                    />
                                    <Select
                                        style={{ width: '300px' }}
                                        multiple
                                        value={personName}
                                        onChange={handleChange}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value.id} label={value.patientFullName} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={{ PaperProps: { style: { maxHeight: 224, width: 250 } } }}
                                    >
                                        {filteredVolunteers.map((patient) => (
                                            <MenuItem
                                                key={patient.id}
                                                value={patient}
                                                style={getStyles(patient.patientFullName, personName, theme)}
                                            >
                                                {patient.patientFullName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </ThemeProvider>
                            </Grid>

                            <Button style={{ height: '25px' }}
                                onClick={addVolunteerCamps}
                                variant="contained" color="success">
                                Assign
                            </Button>
                        </div>
                    </Box>
                </div>
            </Modal >
        </div >
    );
}


export default SelectExistPatients;