import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getApiUrl } from '../../config';

const CHART_COLORS = ['#2E86DE', '#E67E22', '#27AE60', '#8E44AD', '#C0392B', '#16A085', '#2C3E50', '#F1C40F'];
const RADIAN = Math.PI / 180;

function renderPieValueLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (!value) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}
    >
      {value}
    </text>
  );
}

function normalizeValue(value, fallback = 'Unknown') {
  return String(value || '').trim() || fallback;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isYmdString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toLocalYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseYmdToLocalDate(ymd) {
  if (!isYmdString(ymd)) return null;
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
}

function getRecordYmd(record) {
  const raw = record?.healthDate;
  if (isYmdString(raw)) return raw; // already a date-only string from backend
  const d = parseDate(raw);
  return d ? toLocalYmd(d) : null;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday-based week start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthLabel(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function quarterLabel(date) {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatTrendTick(period, mode) {
  if (!period) return '';
  if (mode === 'weekly') {
    const start = parseYmdToLocalDate(period);
    if (!start) return period;
    return toLocalYmd(addDays(start, 7));
  }
  return period;
}

function getDateRangeLabel(fromDate, toDate, hasCustomDate) {
  if (!hasCustomDate) return 'Till date';
  return `${fromDate || 'Start'} to ${toDate || 'End'}`;
}

function buildCountMap(records, keySelector) {
  const map = {};
  for (const item of records) {
    const key = keySelector(item);
    map[key] = (map[key] || 0) + 1;
  }
  return map;
}

export default function Statistics() {
  const apiUrl = getApiUrl();
  const [records, setRecords] = useState([]);
  const [section1FromDate, setSection1FromDate] = useState('');
  const [section1ToDate, setSection1ToDate] = useState('');
  const [section2FromDate, setSection2FromDate] = useState('');
  const [section2ToDate, setSection2ToDate] = useState('');
  const [trendMode, setTrendMode] = useState('daily');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`${apiUrl}/health/records`);
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load statistics records', error);
        setRecords([]);
      }
    };
    fetchRecords();
  }, [apiUrl]);

  const filterRecordsByDate = (items, fromDate, toDate) => {
    return items.filter((item) => {
      const ymd = getRecordYmd(item);
      if (!ymd) return false;
      const d = parseYmdToLocalDate(ymd);
      if (!d) return false;
      if (fromDate && d < parseYmdToLocalDate(fromDate)) return false;
      if (toDate && d > parseYmdToLocalDate(toDate)) return false;
      return true;
    });
  };

  const section1HasCustomDate = Boolean(section1FromDate || section1ToDate);
  const section2HasCustomDate = Boolean(section2FromDate || section2ToDate);

  const section1Records = useMemo(() => {
    return filterRecordsByDate(records, section1FromDate, section1ToDate);
  }, [records, section1FromDate, section1ToDate]);

  const section2Records = useMemo(() => {
    return filterRecordsByDate(records, section2FromDate, section2ToDate);
  }, [records, section2FromDate, section2ToDate]);

  const illnessPieData = useMemo(() => {
    const map = buildCountMap(section1Records, (r) => normalizeValue(r.illnessType));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [section1Records]);

  const districtPieData = useMemo(() => {
    const map = buildCountMap(section1Records, (r) => normalizeValue(r.district));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [section1Records]);

  const classPieData = useMemo(() => {
    const map = buildCountMap(section1Records, (r) => normalizeValue(r.studentClass));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [section1Records]);

  const illnessKeys = useMemo(() => {
    return Array.from(new Set(section2Records.map((r) => normalizeValue(r.illnessType))));
  }, [section2Records]);

  const classKeys = useMemo(() => {
    return Array.from(new Set(section2Records.map((r) => normalizeValue(r.studentClass))));
  }, [section2Records]);

  const districtVsIllnessData = useMemo(() => {
    const districtMap = {};
    for (const row of section2Records) {
      const district = normalizeValue(row.district);
      const illnessType = normalizeValue(row.illnessType);
      if (!districtMap[district]) districtMap[district] = { district };
      districtMap[district][illnessType] = (districtMap[district][illnessType] || 0) + 1;
    }
    return Object.values(districtMap);
  }, [section2Records]);

  const districtVsClassData = useMemo(() => {
    const districtMap = {};
    for (const row of section2Records) {
      const district = normalizeValue(row.district);
      const studentClass = normalizeValue(row.studentClass);
      if (!districtMap[district]) districtMap[district] = { district };
      districtMap[district][studentClass] = (districtMap[district][studentClass] || 0) + 1;
    }
    return Object.values(districtMap);
  }, [section2Records]);

  const trendData = useMemo(() => {
    const now = new Date();
    const trendMap = {};

    if (trendMode === 'daily') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startBoundary = new Date(today);
      startBoundary.setDate(today.getDate() - 6);

      for (let i = 0; i < 7; i += 1) {
        const d = new Date(startBoundary);
        d.setDate(startBoundary.getDate() + i);
        trendMap[toLocalYmd(d)] = 0;
      }

      for (const row of records) {
        const key = getRecordYmd(row);
        if (!key) continue;
        const d = parseYmdToLocalDate(key);
        if (!d || d < startBoundary || d > today) continue;
        if (trendMap[key] !== undefined) trendMap[key] += 1;
      }

      return Object.entries(trendMap).map(([period, totalCases]) => ({ period, totalCases }));
    }

    if (trendMode === 'weekly') {
      const currentWeek = startOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
      const firstWeek = new Date(currentWeek);
      firstWeek.setDate(currentWeek.getDate() - (3 * 7));

      for (let i = 0; i < 4; i += 1) {
        const wk = new Date(firstWeek);
        wk.setDate(firstWeek.getDate() + (i * 7));
        trendMap[toLocalYmd(wk)] = 0;
      }

      for (const row of records) {
        const ymd = getRecordYmd(row);
        const d = ymd ? parseYmdToLocalDate(ymd) : null;
        if (!d || d < firstWeek || d > now) continue;
        const wk = startOfWeek(d);
        const key = toLocalYmd(wk);
        if (trendMap[key] !== undefined) trendMap[key] += 1;
      }

      return Object.entries(trendMap).map(([period, totalCases]) => ({ period, totalCases }));
    }

    if (trendMode === 'quarterly') {
      const currentQuarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const currentQuarterStart = new Date(now.getFullYear(), currentQuarterStartMonth, 1);
      const firstQuarter = new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth() - 9, 1);

      for (let i = 0; i < 4; i += 1) {
        const q = new Date(firstQuarter.getFullYear(), firstQuarter.getMonth() + (i * 3), 1);
        trendMap[quarterLabel(q)] = 0;
      }

      for (const row of records) {
        const ymd = getRecordYmd(row);
        const d = ymd ? parseYmdToLocalDate(ymd) : null;
        if (!d || d < firstQuarter || d > now) continue;
        const quarterStartMonth = Math.floor(d.getMonth() / 3) * 3;
        const key = quarterLabel(new Date(d.getFullYear(), quarterStartMonth, 1));
        if (trendMap[key] !== undefined) trendMap[key] += 1;
      }

      return Object.entries(trendMap).map(([period, totalCases]) => ({ period, totalCases }));
    }

    // monthly
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 2, 1);

    for (let i = 0; i < 3; i += 1) {
      const m = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + i, 1);
      trendMap[monthLabel(m)] = 0;
    }

    for (const row of records) {
      const ymd = getRecordYmd(row);
      const d = ymd ? parseYmdToLocalDate(ymd) : null;
      if (!d || d < firstMonth || d > now) continue;
      const key = monthLabel(new Date(d.getFullYear(), d.getMonth(), 1));
      if (trendMap[key] !== undefined) trendMap[key] += 1;
    }

    return Object.entries(trendMap).map(([period, totalCases]) => ({ period, totalCases }));
  }, [records, trendMode]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              HCC Dashboard
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {getDateRangeLabel(section1FromDate, section1ToDate, section1HasCustomDate)}
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="From Date"
                type="date"
                size="small"
                value={section1FromDate}
                onChange={(e) => setSection1FromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    border: 'none',
                    fontSize: 16,
                  },
                }}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                value={section1ToDate}
                onChange={(e) => setSection1ToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    border: 'none',
                    fontSize: 16,
                  },
                }}
              />
            </Stack>
          </Stack>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, textAlign: 'center' }}>
            Total number of cases: {section1Records.length}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 330 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  Illness Type
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={illnessPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      labelLine={false}
                      label={renderPieValueLabel}
                    >
                      {illnessPieData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 330 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  District Wise
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={districtPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      labelLine={false}
                      label={renderPieValueLabel}
                    >
                      {districtPieData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 330 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  Class Wise
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={classPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      labelLine={false}
                      label={renderPieValueLabel}
                    >
                      {classPieData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getDateRangeLabel(section2FromDate, section2ToDate, section2HasCustomDate)}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="From Date"
                type="date"
                size="small"
                value={section2FromDate}
                onChange={(e) => setSection2FromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    border: 'none',
                    fontSize: 16,
                  },
                }}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                value={section2ToDate}
                onChange={(e) => setSection2ToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input': {
                    border: 'none',
                    fontSize: 16,
                  },
                }}
              />
            </Stack>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 380 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  District vs Total Cases (Illness Type Stacked)
                </Typography>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={districtVsIllnessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {illnessKeys.map((key, index) => (
                      <Bar key={key} dataKey={key} stackId="illnessStack" fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 380 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
                  District vs Total Cases (Class Wise Stacked)
                </Typography>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={districtVsClassData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    {classKeys.map((key, index) => (
                      <Bar key={key} dataKey={key} stackId="classStack" fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ textAlign: 'center', width: '100%' }}>
              Illness Trends
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignSelf: 'flex-end' }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="trend-mode-label">View</InputLabel>
                <Select
                  labelId="trend-mode-label"
                  value={trendMode}
                  label="View"
                  onChange={(e) => setTrendMode(e.target.value)}
                >
                  <MenuItem value="daily">Daily (Last 7 days)</MenuItem>
                  <MenuItem value="weekly">Weekly (Last 4 weeks)</MenuItem>
                  <MenuItem value="monthly">Monthly (Last 3 months)</MenuItem>
                  <MenuItem value="quarterly">Quarterly (Last 4 quarters)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Paper sx={{ p: 2, borderRadius: 2, height: 420, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickFormatter={(v) => formatTrendTick(v, trendMode)} minTickGap={24} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(label) => formatTrendTick(label, trendMode)} />
                <Legend />
                <Line type="monotone" dataKey="totalCases" stroke="#2E86DE" strokeWidth={2} dot={false} name="Total cases" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}
