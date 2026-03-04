import React, { useState } from 'react';
import { getApiUrl } from '../../config';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  MenuItem,
} from '@mui/material';

export default function HealthFormPage() {

  const today = new Date().toISOString().split('T')[0];
  const apiUrl = getApiUrl();

  // Get current user ID from localStorage
  const currentUser = localStorage.getItem('userData');
  const userProfile = currentUser ? JSON.parse(currentUser) : null;
  const userId = userProfile ? userProfile.id : null;

  const [formData, setFormData] = useState({
    schoolName: '',
    studentName: '',
    studentId: '',
    studentClass: '',
    // Type 4 or KGBV
    schoolType: '',
    illnessType: '',
    district: '',
    illness: '',
    healthDate: today,
    // Vitals
    temperatureF: '',
    bloodPressure: '',
    pulseBpm: '',
    oxygenSaturation: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    temperatureF: '',
    bloodPressure: '',
    pulseBpm: '',
    oxygenSaturation: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (['temperatureF', 'bloodPressure', 'pulseBpm', 'oxygenSaturation'].includes(name)) {
      const errorMsg = validateVitalsField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  const [reportFile, setReportFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-validate vitals before submit
    const newErrors = {
      temperatureF: validateVitalsField('temperatureF', formData.temperatureF),
      bloodPressure: validateVitalsField('bloodPressure', formData.bloodPressure),
      pulseBpm: validateVitalsField('pulseBpm', formData.pulseBpm),
      oxygenSaturation: validateVitalsField('oxygenSaturation', formData.oxygenSaturation),
    };
    setFieldErrors(newErrors);
    const messages = Object.values(newErrors).filter((msg) => msg);
    if (messages.length > 0) {
      setError('Please fix the highlighted vitals fields before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });
      // Add user ID as created_by
      if (userId) {
        formDataToSend.append('created_by', userId.toString());
        console.log('Adding created_by:', userId);
      } else {
        console.warn('No user ID found in localStorage');
      }
      if (reportFile) {
        formDataToSend.append('report', reportFile);
      }
      
      // Debug: log all FormData entries
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const res = await fetch(`${apiUrl}/health/records`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        let message = 'Failed to submit form. Please try again.';
        try {
          const data = await res.json();
          if (data && data.message) {
            message = data.message;
          }
        } catch (_) {
          // ignore JSON parse errors, keep default message
        }
        throw new Error(message);
      }

      alert('Form submitted!');
      // Optionally clear form
      setFormData({
        schoolName: '',
        studentName: '',
        studentId: '',
        studentClass: '',
        schoolType: '',
        illnessType: '',
        district: '',
        illness: '',
        healthDate: today,
        temperatureF: '',
        bloodPressure: '',
        pulseBpm: '',
        oxygenSaturation: '',
      });
      setReportFile(null);

    } catch (err) {
      setError(
        err && err.message
          ? err.message
          : 'Failed to submit form. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const districts = [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Kumuram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Rangareddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal Rural',
    'Warangal Urban',
    'Yadadri Bhuvanagiri',
  ];

  const illnessTypes = [
    { value: 'infectious', label: 'Infectious' },
    { value: 'non-infectious', label: 'Non Infectious' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'injuries', label: 'Injuries' },
  ];

  return (
    <Box
      sx={{
        p: 3,
        maxHeight: 'calc(100vh - 80px)',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Student Health Form
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Please fill in the student details and select the type of illness.
        </Typography>

        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                placeholder="Enter school name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                placeholder="Enter student name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="Enter student ID"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                required
                placeholder="Enter class (e.g. 5A)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="School Type"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select school type</em>
                </MenuItem>
                <MenuItem value="Type 4">Type 4</MenuItem>
                <MenuItem value="KGBV">KGBV</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Record"
                name="healthDate"
                type="date"
                value={formData.healthDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    border: 'none',
                    fontSize: 16,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select district</em>
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Vitals */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Temperature (°F)"
                name="temperatureF"
                type="number"
                inputProps={{ step: '0.1' }}
                value={formData.temperatureF}
                onChange={handleChange}
                required
                sx={{
                    '& input': {
                      border: 'none',
                      fontSize: 16,
                    },
                  }}
                error={Boolean(fieldErrors.temperatureF)}
                helperText={fieldErrors.temperatureF}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="BP (mmHg)"
                name="bloodPressure"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={handleChange}
                required
                sx={{
                    '& input': {
                      border: 'none',
                      fontSize: 16,
                    },
                  }}
                error={Boolean(fieldErrors.bloodPressure)}
                helperText={fieldErrors.bloodPressure}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Pulse (BPM)"
                name="pulseBpm"
                type="number"
                value={formData.pulseBpm}
                onChange={handleChange}
                required
                sx={{
                    '& input': {
                      border: 'none',
                      fontSize: 16,
                    },
                  }}
                error={Boolean(fieldErrors.pulseBpm)}
                helperText={fieldErrors.pulseBpm}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Oxygen Saturation (%)"
                name="oxygenSaturation"
                type="number"
                value={formData.oxygenSaturation}
                onChange={handleChange}
                required
                sx={{
                    '& input': {
                      border: 'none',
                      fontSize: 16,
                    },
                  }}
                error={Boolean(fieldErrors.oxygenSaturation)}
                helperText={fieldErrors.oxygenSaturation}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type of Illness"
                name="illnessType"
                value={formData.illnessType}
                onChange={handleChange}
                required
              >
                <MenuItem value="">
                  <em>Select illness type</em>
                </MenuItem>
                {illnessTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Illness Details"
                name="illness"
                value={formData.illness}
                onChange={handleChange}
                placeholder="Enter illness details (e.g., Fever, Cold, etc.)"
                multiline
                minRows={2}
                required
              />
            </Grid>

            {/* Report upload */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
              >
                {reportFile ? 'Change Report (Image / PDF)' : 'Upload Report (Image / PDF)'}
                <input
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setReportFile(file || null);
                  }}
                />
              </Button>
              {reportFile && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {reportFile.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} mt={1}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}