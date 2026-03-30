import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import './chart.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoleBasedUserChart = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${apiUrl}/roleUserCount`)
            .then(response => response.json())
            .then(data => {
                setRoleData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching role data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Function to abbreviate role names
    const getAbbreviation = (roleName) => {
        const words = roleName.split(' ');
        if (words.length > 1) {
            // If more than one word, take the first letter of each word
            return words.map(word => word.charAt(0)).join('');
        } else {
            // For single words, just return the first letter
            return roleName.charAt(0);
        }
    };

    // Create dataset with abbreviations of role names
    const data = {
        // labels: roleData.map(role => getAbbreviation(role.roleName)),  
        labels: roleData.map(role => role.roleName),
        datasets: [
            {
                label: 'User Count',
                data: roleData.map(role => role.userCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    min: 0,
                    max: Math.max(...roleData.map(role => role.userCount)) + 5
                },
                grid: {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    // Custom tooltip to display full role name on hover
                    title: function (context) {
                        const index = context[0].dataIndex;
                        return roleData[index].roleName; // Show full role name
                    }
                }
            }
        }
    };

    return (
        <div className="campcontainerchart">
            <div className="filter-header">
                <h5>Role wise Users count </h5>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default RoleBasedUserChart;
