import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { EnergyData } from '../types/EnergyData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get('/api/energy');
        setEnergyData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch energy data.');
        setLoading(false);
      }
    };
    fetchEnergyData();
  }, []);

  const data = {
    labels: energyData.map((d) => new Date(d.time).toLocaleDateString()),
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: energyData.map((d) => d.consumption),
        borderColor: '#FF6384',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Energy Generation (kWh)',
        data: energyData.map((d) => d.generation),
        borderColor: '#36A2EB',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Energy Management Dashboard</h1>
      {loading && <p>Loading data...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="chart-container">
          <Line data={data} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;