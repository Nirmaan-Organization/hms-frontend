import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './chart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CampDetailsChart = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [campPatientData, setCampPatientData] = useState([]);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0); // Default to the first month
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${apiUrl}/campPatient/count-by-month`)
            .then((response) => response.json())
            .then((data) => {
                setCampPatientData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching camp patient data:', error);
                setError('Failed to load data.');
                setLoading(false);
            });
    }, [apiUrl]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!campPatientData.length) {
        return <div>No data available.</div>;
    }

    const selectedMonth = campPatientData[selectedMonthIndex];
    const getAbbreviation = (name) => name.split(' ').map(word => word.charAt(0)).join(''); // Abbreviate camp names
    const labels = selectedMonth?.camps?.map((camp) => getAbbreviation(camp.name.trim())) || [];
    const patientCounts = selectedMonth?.camps?.map((camp) => camp.patientCount) || [];

    const chartData = {
        labels,
        datasets: [
            {
                label: `Patient Counts for ${selectedMonth?.month || ''}`,
                data: patientCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (context) {
                        const index = context[0].dataIndex;
                        return selectedMonth?.camps[index]?.name || ''; // Full camp name on hover
                    },
                },
            },
            legend: {
                position: 'top',
            },
            // title: {
            //     display: true,
            //     text: `Camp Patient Data for ${selectedMonth?.month || ''}`,
            // },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
    };

    const handleMonthChange = (e) => {
        setSelectedMonthIndex(Number(e.target.value));
    };

    return (
        <div className="campcontainerchart">
            <div className="filter-header">
                <h5>Camp Patient details month wise </h5>
                <div className="filter-container">
                    <label htmlFor="month-select">Select Month: </label>
                    <select
                        id="month-select"
                        value={selectedMonthIndex}
                        onChange={handleMonthChange}
                    >
                        {campPatientData.map((monthData, index) => (
                            <option key={index} value={index}>
                                {monthData.month}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default CampDetailsChart;
